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
    const width = element.scrollWidth || element.offsetWidth;
    const height = element.scrollHeight || element.offsetHeight;

    // Executa uma primeira passagem rápida para garantir que todas as imagens e fontes estejam prontas no cache
    await toPng(element, {
      quality: 1,
      pixelRatio: 1,
      width,
      height,
      filter: (node) => this.shouldIncludeNode(node),
    }).catch(() => undefined);

    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 3,
      width,
      height,
      cacheBust: true,
      backgroundColor: '#0A0506',
      filter: (node) => this.shouldIncludeNode(node),
      style: {
        transform: 'none',
        margin: '0',
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

  private shouldIncludeNode(node: Node): boolean {
    if (node instanceof HTMLElement && node.dataset.exportIgnore === 'true') {
      return false;
    }
    return true;
  }

  private async convertDataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }
}
