import { MemberCard } from '@domain/entities/MemberCard';
import { CardImageGeneratorPort } from '@domain/ports/CardImageGeneratorPort';
import { CardSharePort, WhatsAppShareOutcome } from '@domain/ports/CardSharePort';
import { CardUrlStatePort } from '@domain/ports/CardUrlStatePort';

export interface ShareCardViaWhatsAppDependencies {
  readonly imageGenerator: CardImageGeneratorPort;
  readonly cardShare: CardSharePort;
  readonly urlState: CardUrlStatePort;
}

export class ShareCardViaWhatsAppUseCase {
  private readonly imageGenerator: CardImageGeneratorPort;
  private readonly cardShare: CardSharePort;
  private readonly urlState: CardUrlStatePort;

  public constructor(dependencies: ShareCardViaWhatsAppDependencies) {
    this.imageGenerator = dependencies.imageGenerator;
    this.cardShare = dependencies.cardShare;
    this.urlState = dependencies.urlState;
  }

  public async execute(
    card: MemberCard,
    cardElement: HTMLElement,
  ): Promise<WhatsAppShareOutcome> {
    const shareUrl = this.urlState.encodeCardToUrl(card);
    const message = card.buildWhatsAppShareMessage(shareUrl);
    const generatedImage = await this.imageGenerator.generatePngFromElement(
      cardElement,
      card.getFileSlug(),
    );

    return this.cardShare.shareViaWhatsApp({
      cardImage: generatedImage,
      message,
      shareUrl,
    });
  }
}
