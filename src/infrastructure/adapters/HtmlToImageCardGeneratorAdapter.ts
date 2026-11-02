import { toPng } from 'html-to-image';
import {
  CardImageGeneratorPort,
  GeneratedCardImage,
} from '@domain/ports/CardImageGeneratorPort';

export class HtmlToImageCardGeneratorAdapter implements CardImageGeneratorPort {
  public async generatePngFromElement(
    element: HTMLElement,
    fileNameWithoutExtension: string,
  ): Promise<GeneratedCardImage> {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3,
      cacheBust: true,
      backgroundColor: '#0D0708',
      style: {
        transform: 'none',
      },
    });

    const blob = await this.convertDataUrlToBlob(dataUrl);
    const fileName = `${fileNameWithoutExtension}.png`;

    return {
      dataUrl,
      blob,
      fileName,
    };
  }

  private async convertDataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }
}
