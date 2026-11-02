import { GeneratedCardImage } from '@domain/ports/CardImageGeneratorPort';
import { CardSharePort, WhatsAppShareOutcome } from '@domain/ports/CardSharePort';

export class BrowserCardShareAdapter implements CardSharePort {
  public async shareViaWhatsApp(params: {
    readonly cardImage: GeneratedCardImage;
    readonly message: string;
    readonly shareUrl: string;
  }): Promise<WhatsAppShareOutcome> {
    const { cardImage, message } = params;
    const imageFile = new File([cardImage.blob], cardImage.fileName, {
      type: 'image/png',
    });

    if (this.canShareFilesNatively(imageFile)) {
      try {
        await navigator.share({
          title: 'Meu Card Oficial — Clube do Livro',
          text: message,
          files: [imageFile],
        });
        return {
          method: 'native-file-share',
          completed: true,
        };
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return {
            method: 'native-file-share',
            completed: false,
          };
        }
      }
    }

    this.triggerImageDownload(cardImage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    return {
      method: 'whatsapp-web-with-download',
      completed: true,
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

  public async copyTextToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textArea);
      return copied;
    } catch {
      return false;
    }
  }

  private canShareFilesNatively(file: File): boolean {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      return false;
    }
    if (typeof navigator.canShare !== 'function') {
      return false;
    }
    const isMobileViewport = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    return isMobileViewport && navigator.canShare({ files: [file] });
  }
}
