export interface GeneratedCardImage {
  readonly dataUrl: string;
  readonly blob: Blob;
  readonly fileName: string;
}

export interface CardImageGeneratorPort {
  generatePngFromElement(
    element: HTMLElement,
    fileNameWithoutExtension: string,
  ): Promise<GeneratedCardImage>;
}
