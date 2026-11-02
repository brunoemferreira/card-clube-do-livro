import { DEFAULT_PHOTO_ALIGNMENT, MemberCard } from '@domain/entities/MemberCard';
import { ImageReaderPort } from '@domain/ports/ImageReaderPort';

export class UploadCardAvatarUseCase {
  private readonly imageReader: ImageReaderPort;

  public constructor(imageReader: ImageReaderPort) {
    this.imageReader = imageReader;
  }

  public async execute(card: MemberCard, file: File): Promise<MemberCard> {
    const fullImageDataUrl = await this.imageReader.readFullImagePreserveAspect(file);
    return card
      .withUpdatedField('photoDataUrl', fullImageDataUrl)
      .withUpdatedField('photoAlignment', DEFAULT_PHOTO_ALIGNMENT);
  }
}
