import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CardThemeAccent,
  DEFAULT_PHOTO_ALIGNMENT,
  MemberCard,
  PhotoAlignment,
} from '@domain/entities/MemberCard';
import { appContainer } from '@infrastructure/di/container';

export type FeedbackBannerType = 'success' | 'info' | 'error';

export interface FeedbackBanner {
  readonly type: FeedbackBannerType;
  readonly message: string;
}

const AVATAR_RENDER_SIZE_PX = 600;

export function useMemberCardController() {
  const [card, setCard] = useState<MemberCard>(() =>
    appContainer.syncCardUrlStateUseCase.loadFromUrlOrDefault(),
  );
  const [alignedPhotoDataUrl, setAlignedPhotoDataUrl] = useState<string | null>(null);
  const [lastGeneratedCardUrl, setLastGeneratedCardUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  const exportableCardRef = useRef<HTMLDivElement | null>(null);

  const showTemporaryFeedback = useCallback(
    (type: FeedbackBannerType, message: string) => {
      setFeedback({ type, message });
      window.setTimeout(() => {
        setFeedback((current) => (current?.message === message ? null : current));
      }, 8000);
    },
    [],
  );

  // Renderiza em tempo real a foto com o alinhamento (horizontal, vertical e zoom) em um canvas quadrado
  useEffect(() => {
    if (!card.photoDataUrl) {
      setAlignedPhotoDataUrl(null);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) {
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = AVATAR_RENDER_SIZE_PX;
      canvas.height = AVATAR_RENDER_SIZE_PX;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setAlignedPhotoDataUrl(card.photoDataUrl);
        return;
      }

      ctx.fillStyle = '#15080A';
      ctx.fillRect(0, 0, AVATAR_RENDER_SIZE_PX, AVATAR_RENDER_SIZE_PX);

      const { zoom, offsetX, offsetY } = card.photoAlignment;
      const baseScale = Math.max(
        AVATAR_RENDER_SIZE_PX / image.width,
        AVATAR_RENDER_SIZE_PX / image.height,
      );
      const effectiveScale = baseScale * zoom;

      const drawWidth = image.width * effectiveScale;
      const drawHeight = image.height * effectiveScale;

      const maxShiftX = Math.max(120, (drawWidth - AVATAR_RENDER_SIZE_PX) / 2 + 80);
      const maxShiftY = Math.max(120, (drawHeight - AVATAR_RENDER_SIZE_PX) / 2 + 80);

      const centerX =
        (AVATAR_RENDER_SIZE_PX - drawWidth) / 2 + (offsetX / 100) * maxShiftX;
      const centerY =
        (AVATAR_RENDER_SIZE_PX - drawHeight) / 2 + (offsetY / 100) * maxShiftY;

      ctx.drawImage(image, centerX, centerY, drawWidth, drawHeight);
      setAlignedPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.94));
    };
    image.src = card.photoDataUrl;

    return () => {
      cancelled = true;
    };
  }, [card.photoDataUrl, card.photoAlignment]);

  const updateFullName = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('fullName', value));
  }, []);

  const updateCity = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('city', value));
  }, []);

  const updateState = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('state', value));
  }, []);

  const updateTransformationGoal = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('readingTransformationGoal', value));
  }, []);

  const updateThemeAccent = useCallback((value: CardThemeAccent) => {
    setCard((prev) => prev.withUpdatedField('themeAccent', value));
  }, []);

  const updatePhotoAlignment = useCallback((partial: Partial<PhotoAlignment>) => {
    setCard((prev) => prev.withUpdatedPhotoAlignment(partial));
  }, []);

  const resetPhotoAlignment = useCallback(() => {
    setCard((prev) => prev.withUpdatedField('photoAlignment', DEFAULT_PHOTO_ALIGNMENT));
  }, []);

  const handleAvatarFileSelected = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }
      if (!file.type.startsWith('image/')) {
        showTemporaryFeedback(
          'error',
          'Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WebP).',
        );
        return;
      }

      setIsUploadingAvatar(true);
      try {
        const updatedCard = await appContainer.uploadCardAvatarUseCase.execute(card, file);
        setCard(updatedCard);
        showTemporaryFeedback(
          'success',
          'Foto carregada! Use os controles abaixo da foto (ou arraste a foto no crachá) para alinhar perfeitamente.',
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Não foi possível carregar a foto.';
        showTemporaryFeedback('error', message);
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [card, showTemporaryFeedback],
  );

  const removeAvatar = useCallback(() => {
    setCard((prev) =>
      prev
        .withUpdatedField('photoDataUrl', null)
        .withUpdatedField('photoAlignment', DEFAULT_PHOTO_ALIGNMENT),
    );
    setAlignedPhotoDataUrl(null);
  }, []);

  const handleDownloadPng = useCallback(async () => {
    if (!exportableCardRef.current) {
      return;
    }

    setIsGeneratingImage(true);
    try {
      const generated = await appContainer.downloadCardImageUseCase.execute(
        card,
        exportableCardRef.current,
      );
      setLastGeneratedCardUrl(generated.dataUrl);
      showTemporaryFeedback(
        'success',
        'Imagem completa do seu Card baixada em alta resolução (PNG)!',
      );
    } catch {
      showTemporaryFeedback(
        'error',
        'Ocorreu um erro ao gerar a imagem do Card. Tente novamente.',
      );
    } finally {
      setIsGeneratingImage(false);
    }
  }, [card, showTemporaryFeedback]);

  const handleShareWhatsApp = useCallback(async () => {
    if (!exportableCardRef.current) {
      return;
    }

    setIsGeneratingImage(true);
    try {
      const outcome = await appContainer.shareCardViaWhatsAppUseCase.execute(
        card,
        exportableCardRef.current,
      );
      setLastGeneratedCardUrl(outcome.cardImage.dataUrl);

      if (outcome.method === 'native-file-share' && outcome.completed) {
        showTemporaryFeedback(
          'success',
          'Imagem completa do seu Card enviada para o compartilhamento do WhatsApp!',
        );
      } else if (outcome.method === 'clipboard-image-and-whatsapp') {
        showTemporaryFeedback(
          'info',
          'A IMAGEM COMPLETA do seu Card foi COPIADA e também baixada! Na conversa do WhatsApp que abrimos, basta apertar Ctrl + V (Colar) para enviar a imagem!',
        );
      } else if (outcome.method === 'download-and-whatsapp') {
        showTemporaryFeedback(
          'info',
          'A imagem completa do seu Card foi baixada automaticamente! Basta anexá-la na conversa do WhatsApp que abrimos.',
        );
      }
    } catch {
      showTemporaryFeedback(
        'error',
        'Não foi possível iniciar o compartilhamento. Tente clicar em "Baixar Imagem PNG".',
      );
    } finally {
      setIsGeneratingImage(false);
    }
  }, [card, showTemporaryFeedback]);

  return {
    card,
    alignedPhotoDataUrl,
    lastGeneratedCardUrl,
    exportableCardRef,
    isGeneratingImage,
    isUploadingAvatar,
    feedback,
    updateFullName,
    updateCity,
    updateState,
    updateTransformationGoal,
    updateThemeAccent,
    updatePhotoAlignment,
    resetPhotoAlignment,
    handleAvatarFileSelected,
    removeAvatar,
    handleDownloadPng,
    handleShareWhatsApp,
  };
}
