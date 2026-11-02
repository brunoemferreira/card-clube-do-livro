import { GeneratedCardImage } from './CardImageGeneratorPort';

export type WhatsAppShareMethod = 'native-file-share' | 'whatsapp-web-with-download';

export interface WhatsAppShareOutcome {
  readonly method: WhatsAppShareMethod;
  readonly completed: boolean;
}

export interface CardSharePort {
  shareViaWhatsApp(params: {
    readonly cardImage: GeneratedCardImage;
    readonly message: string;
    readonly shareUrl: string;
  }): Promise<WhatsAppShareOutcome>;

  triggerImageDownload(cardImage: GeneratedCardImage): void;

  copyTextToClipboard(text: string): Promise<boolean>;
}
