export interface ImageReaderPort {
  readFullImagePreserveAspect(file: File): Promise<string>;
}
