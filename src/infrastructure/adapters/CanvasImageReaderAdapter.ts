import { ImageReaderPort } from '@domain/ports/ImageReaderPort';

const TARGET_AVATAR_SIZE_PX = 640;

export class CanvasImageReaderAdapter implements ImageReaderPort {
  public async readAndOptimizeSquareAvatar(file: File): Promise<string> {
    const rawDataUrl = await this.readFileAsDataUrl(file);
    return this.cropCenterSquare(rawDataUrl, TARGET_AVATAR_SIZE_PX);
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

  private cropCenterSquare(sourceDataUrl: string, sizePx: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = sizePx;
        canvas.height = sizePx;

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(sourceDataUrl);
          return;
        }

        const shortestSide = Math.min(image.width, image.height);
        const sourceX = (image.width - shortestSide) / 2;
        const sourceY = (image.height - shortestSide) / 2;

        context.drawImage(
          image,
          sourceX,
          sourceY,
          shortestSide,
          shortestSide,
          0,
          0,
          sizePx,
          sizePx,
        );

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      image.onerror = () => reject(new Error('Imagem inválida ou corrompida.'));
      image.src = sourceDataUrl;
    });
  }
}
