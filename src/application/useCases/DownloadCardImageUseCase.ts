import { MemberCard } from '@domain/entities/MemberCard';
import { CardImageGeneratorPort, GeneratedCardImage } from '@domain/ports/CardImageGeneratorPort';
import { CardSharePort } from '@domain/ports/CardSharePort';

export interface DownloadCardImageDependencies {
  readonly imageGenerator: CardImageGeneratorPort;
  readonly cardShare: CardSharePort;
}

export class DownloadCardImageUseCase {
  private readonly imageGenerator: CardImageGeneratorPort;
  private readonly cardShare: CardSharePort;

  public constructor(dependencies: DownloadCardImageDependencies) {
    this.imageGenerator = dependencies.imageGenerator;
    this.cardShare = dependencies.cardShare;
  }

  public async execute(
    card: MemberCard,
    cardElement: HTMLElement,
  ): Promise<GeneratedCardImage> {
    const generatedImage = await this.imageGenerator.generatePngFromElement(
      cardElement,
      card.getFileSlug(),
    );
    this.cardShare.triggerImageDownload(generatedImage);
    return generatedImage;
  }
}

