import { MemberCard } from '@domain/entities/MemberCard';
import { ImageReaderPort } from '@domain/ports/ImageReaderPort';

export class UploadCardAvatarUseCase {
  private readonly imageReader: ImageReaderPort;

  public constructor(imageReader: ImageReaderPort) {
    this.imageReader = imageReader;
  }

  public async execute(card: MemberCard, file: File): Promise<MemberCard> {
    const optimizedDataUrl = await this.imageReader.readAndOptimizeSquareAvatar(file);
    return card.withUpdatedField('photoDataUrl', optimizedDataUrl);
  }
}
