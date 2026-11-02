import { useCallback, useMemo, useRef, useState } from 'react';
import { CardThemeAccent, MemberCard } from '@domain/entities/MemberCard';
import { appContainer } from '@infrastructure/di/container';

export type FeedbackBannerType = 'success' | 'info' | 'error';

export interface FeedbackBanner {
  readonly type: FeedbackBannerType;
  readonly message: string;
}

export function useMemberCardController() {
  const [card, setCard] = useState<MemberCard>(() =>
    appContainer.syncCardUrlStateUseCase.loadFromUrlOrDefault(),
  );
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);
  const [copiedTarget, setCopiedTarget] = useState<'link' | 'embed' | 'whatsapp-text' | null>(
    null,
  );

  const exportableCardRef = useRef<HTMLDivElement | null>(null);

  const showTemporaryFeedback = useCallback(
    (type: FeedbackBannerType, message: string) => {
      setFeedback({ type, message });
      window.setTimeout(() => {
        setFeedback((current) => (current?.message === message ? null : current));
      }, 6000);
    },
    [],
  );

  const updateFullName = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('fullName', value));
  }, []);

  const updateCityState = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('cityState', value));
  }, []);

  const updateTransformationGoal = useCallback((value: string) => {
    setCard((prev) => prev.withUpdatedField('readingTransformationGoal', value));
  }, []);

  const updateThemeAccent = useCallback((value: CardThemeAccent) => {
    setCard((prev) => prev.withUpdatedField('themeAccent', value));
  }, []);

  const handleAvatarFileSelected = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }
      if (!file.type.startsWith('image/')) {
        showTemporaryFeedback('error', 'Por favor, selecione um arquivo de imagem válido (JPG, PNG ou WebP).');
        return;
      }

      setIsUploadingAvatar(true);
      try {
        const updatedCard = await appContainer.uploadCardAvatarUseCase.execute(card, file);
        setCard(updatedCard);
        showTemporaryFeedback('success', 'Foto atualizada com sucesso no seu Card!');
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
    setCard((prev) => prev.withUpdatedField('photoDataUrl', null));
  }, []);

  const handleDownloadPng = useCallback(async () => {
    if (!exportableCardRef.current) {
      return;
    }

    setIsGeneratingImage(true);
    try {
      await appContainer.downloadCardImageUseCase.execute(card, exportableCardRef.current);
      showTemporaryFeedback(
        'success',
        'Card baixado em alta resolução (PNG)! Pronto para postar ou enviar no WhatsApp.',
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

      if (outcome.method === 'native-file-share' && outcome.completed) {
        showTemporaryFeedback(
          'success',
          'Compartilhamento aberto com a imagem do seu Card!',
        );
      } else if (outcome.method === 'whatsapp-web-with-download') {
        showTemporaryFeedback(
          'info',
          'Baixamos o PNG do seu Card automaticamente e abrimos o WhatsApp! Basta anexar a imagem baixada na conversa.',
        );
      }
    } catch {
      showTemporaryFeedback(
        'error',
        'Não foi possível iniciar o compartilhamento. Tente clicar em "Baixar PNG".',
      );
    } finally {
      setIsGeneratingImage(false);
    }
  }, [card, showTemporaryFeedback]);

  const handleCopyLink = useCallback(async () => {
    const { copied } = await appContainer.syncCardUrlStateUseCase.copyShareableLink(card);
    if (copied) {
      setCopiedTarget('link');
      showTemporaryFeedback('success', 'Link personalizado do seu Card copiado!');
      window.setTimeout(() => setCopiedTarget(null), 3000);
    }
  }, [card, showTemporaryFeedback]);

  const shareableUrl = useMemo(
    () => appContainer.syncCardUrlStateUseCase.generateShareableLink(card),
    [card],
  );

  const embedCode = useMemo(
    () => appContainer.syncCardUrlStateUseCase.buildEmbedCode(card),
    [card],
  );

  const whatsappMessagePreview = useMemo(
    () => card.buildWhatsAppShareMessage(shareableUrl),
    [card, shareableUrl],
  );

  const handleCopyEmbedOrText = useCallback(
    async (text: string, target: 'embed' | 'whatsapp-text') => {
      const copied = await navigator.clipboard
        ?.writeText(text)
        .then(() => true)
        .catch(() => false);
      if (copied) {
        setCopiedTarget(target);
        showTemporaryFeedback(
          'success',
          target === 'embed'
            ? 'Código de incorporação copiado!'
            : 'Mensagem para WhatsApp copiada!',
        );
        window.setTimeout(() => setCopiedTarget(null), 3000);
      }
    },
    [showTemporaryFeedback],
  );

  return {
    card,
    exportableCardRef,
    isGeneratingImage,
    isUploadingAvatar,
    feedback,
    copiedTarget,
    shareableUrl,
    embedCode,
    whatsappMessagePreview,
    updateFullName,
    updateCityState,
    updateTransformationGoal,
    updateThemeAccent,
    handleAvatarFileSelected,
    removeAvatar,
    handleDownloadPng,
    handleShareWhatsApp,
    handleCopyLink,
    handleCopyEmbedOrText,
  };
}
