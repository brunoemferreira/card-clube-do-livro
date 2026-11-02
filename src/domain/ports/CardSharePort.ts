import { GeneratedCardImage } from './CardImageGeneratorPort';

export type WhatsAppShareMethod =
  | 'native-file-share'
  | 'clipboard-image-and-whatsapp'
  | 'download-and-whatsapp';

export interface WhatsAppShareOutcome {
  readonly method: WhatsAppShareMethod;
  readonly completed: boolean;
  readonly cardImage: GeneratedCardImage;
}

export interface CardSharePort {
  shareViaWhatsApp(params: {
    readonly cardImage: GeneratedCardImage;
    readonly caption: string;
  }): Promise<WhatsAppShareOutcome>;

  triggerImageDownload(cardImage: GeneratedCardImage): void;

  copyImageToClipboard(cardImage: GeneratedCardImage): Promise<boolean>;
}
