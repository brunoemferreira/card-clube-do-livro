import { MemberCard } from '@domain/entities/MemberCard';
import { CardImageGeneratorPort } from '@domain/ports/CardImageGeneratorPort';
import { CardSharePort, WhatsAppShareOutcome } from '@domain/ports/CardSharePort';

export interface ShareCardViaWhatsAppDependencies {
  readonly imageGenerator: CardImageGeneratorPort;
  readonly cardShare: CardSharePort;
}

export class ShareCardViaWhatsAppUseCase {
  private readonly imageGenerator: CardImageGeneratorPort;
  private readonly cardShare: CardSharePort;

  public constructor(dependencies: ShareCardViaWhatsAppDependencies) {
    this.imageGenerator = dependencies.imageGenerator;
    this.cardShare = dependencies.cardShare;
  }

  public async execute(
    card: MemberCard,
    cardElement: HTMLElement,
  ): Promise<WhatsAppShareOutcome> {
    const caption = card.buildWhatsAppCaption();
    const generatedImage = await this.imageGenerator.generatePngFromElement(
      cardElement,
      card.getFileSlug(),
    );

    return this.cardShare.shareViaWhatsApp({
      cardImage: generatedImage,
      caption,
    });
  }
}
