import { ImageReaderPort } from '@domain/ports/ImageReaderPort';

const MAX_IMAGE_DIMENSION_PX = 1200;

export class CanvasImageReaderAdapter implements ImageReaderPort {
  public async readFullImagePreserveAspect(file: File): Promise<string> {
    const rawDataUrl = await this.readFileAsDataUrl(file);
    return this.resizePreservingAspect(rawDataUrl, MAX_IMAGE_DIMENSION_PX);
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Falha ao ler arquivo de imagem.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro na leitura da imagem selecionada.'));
      reader.readAsDataURL(file);
    });
  }

  private resizePreservingAspect(
    sourceDataUrl: string,
    maxDimensionPx: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          maxDimensionPx / Math.max(image.width, image.height),
        );
        const targetWidth = Math.round(image.width * scale);
        const targetHeight = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(sourceDataUrl);
          return;
        }

        context.drawImage(image, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.94));
      };
      image.onerror = () => reject(new Error('Imagem inválida ou corrompida.'));
      image.src = sourceDataUrl;
    });
  }
}
