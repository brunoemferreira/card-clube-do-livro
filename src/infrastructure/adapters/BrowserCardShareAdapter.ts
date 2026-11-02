import { GeneratedCardImage } from '@domain/ports/CardImageGeneratorPort';
import { CardSharePort, WhatsAppShareOutcome } from '@domain/ports/CardSharePort';

export class BrowserCardShareAdapter implements CardSharePort {
  public async shareViaWhatsApp(params: {
    readonly cardImage: GeneratedCardImage;
    readonly caption: string;
  }): Promise<WhatsAppShareOutcome> {
    const { cardImage, caption } = params;
    const imageFile = new File([cardImage.blob], cardImage.fileName, {
      type: 'image/png',
      lastModified: Date.now(),
    });

    // 1. Tenta compartilhar o arquivo de imagem PNG diretamente via Web Share API (Celular / OS nativo)
    if (this.canShareImageFile(imageFile)) {
      try {
        await navigator.share({
          files: [imageFile],
          title: 'Card Oficial — Clube do Livro',
          text: caption,
        });
        return {
          method: 'native-file-share',
          completed: true,
          cardImage,
        };
      } catch (firstError) {
        if (firstError instanceof DOMException && firstError.name === 'AbortError') {
          return {
            method: 'native-file-share',
            completed: false,
            cardImage,
          };
        }

        // Alguns aparelhos aceitam apenas { files } sem texto conjunto para enviar a imagem pura ao WhatsApp
        try {
          await navigator.share({
            files: [imageFile],
          });
          return {
            method: 'native-file-share',
            completed: true,
            cardImage,
          };
        } catch (secondError) {
          if (secondError instanceof DOMException && secondError.name === 'AbortError') {
            return {
              method: 'native-file-share',
              completed: false,
              cardImage,
            };
          }
        }
      }
    }

    // 2. No Desktop: copia a imagem PNG para a Área de Transferência (para colar com Ctrl+V direto no WhatsApp)
    //    e também baixa o arquivo PNG completo.
    const copiedToClipboard = await this.copyImageToClipboard(cardImage);
    this.triggerImageDownload(cardImage);

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(caption)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    return {
      method: copiedToClipboard
        ? 'clipboard-image-and-whatsapp'
        : 'download-and-whatsapp',
      completed: true,
      cardImage,
    };
  }

  public triggerImageDownload(cardImage: GeneratedCardImage): void {
    const anchor = document.createElement('a');
    anchor.href = cardImage.dataUrl;
    anchor.download = cardImage.fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  public async copyImageToClipboard(cardImage: GeneratedCardImage): Promise<boolean> {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.write === 'function' &&
        typeof ClipboardItem !== 'undefined'
      ) {
        const item = new ClipboardItem({ 'image/png': cardImage.blob });
        await navigator.clipboard.write([item]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  private canShareImageFile(file: File): boolean {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      return false;
    }
    if (typeof navigator.canShare !== 'function') {
      return false;
    }
    try {
      return navigator.canShare({ files: [file] });
    } catch {
      return false;
    }
  }
}
