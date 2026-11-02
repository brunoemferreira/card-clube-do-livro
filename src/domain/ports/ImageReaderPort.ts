export interface ImageReaderPort {
  readAndOptimizeSquareAvatar(file: File): Promise<string>;
}
