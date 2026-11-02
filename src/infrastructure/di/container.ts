import { DownloadCardImageUseCase } from '@application/useCases/DownloadCardImageUseCase';
import { ShareCardViaWhatsAppUseCase } from '@application/useCases/ShareCardViaWhatsAppUseCase';
import { SyncCardUrlStateUseCase } from '@application/useCases/SyncCardUrlStateUseCase';
import { UploadCardAvatarUseCase } from '@application/useCases/UploadCardAvatarUseCase';
import { BrowserCardShareAdapter } from '../adapters/BrowserCardShareAdapter';
import { BrowserUrlCardStateAdapter } from '../adapters/BrowserUrlCardStateAdapter';
import { CanvasImageReaderAdapter } from '../adapters/CanvasImageReaderAdapter';
import { HtmlToImageCardGeneratorAdapter } from '../adapters/HtmlToImageCardGeneratorAdapter';

export interface ApplicationContainer {
  readonly shareCardViaWhatsAppUseCase: ShareCardViaWhatsAppUseCase;
  readonly downloadCardImageUseCase: DownloadCardImageUseCase;
  readonly uploadCardAvatarUseCase: UploadCardAvatarUseCase;
  readonly syncCardUrlStateUseCase: SyncCardUrlStateUseCase;
}

export function createApplicationContainer(): ApplicationContainer {
  const imageGenerator = new HtmlToImageCardGeneratorAdapter();
  const cardShare = new BrowserCardShareAdapter();
  const urlState = new BrowserUrlCardStateAdapter();
  const imageReader = new CanvasImageReaderAdapter();

  return {
    shareCardViaWhatsAppUseCase: new ShareCardViaWhatsAppUseCase({
      imageGenerator,
      cardShare,
    }),
    downloadCardImageUseCase: new DownloadCardImageUseCase({
      imageGenerator,
      cardShare,
    }),
    uploadCardAvatarUseCase: new UploadCardAvatarUseCase(imageReader),
    syncCardUrlStateUseCase: new SyncCardUrlStateUseCase(urlState),
  };
}

export const appContainer = createApplicationContainer();
