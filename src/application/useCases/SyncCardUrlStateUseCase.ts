import { MemberCard } from '@domain/entities/MemberCard';
import { CardSharePort } from '@domain/ports/CardSharePort';
import { CardUrlStatePort } from '@domain/ports/CardUrlStatePort';

export class SyncCardUrlStateUseCase {
  private readonly urlState: CardUrlStatePort;
  private readonly cardShare: CardSharePort;

  public constructor(urlState: CardUrlStatePort, cardShare: CardSharePort) {
    this.urlState = urlState;
    this.cardShare = cardShare;
  }

  public loadFromUrlOrDefault(): MemberCard {
    const decoded = this.urlState.decodeCardFromCurrentUrl();
    return decoded ?? MemberCard.create({});
  }

  public generateShareableLink(card: MemberCard): string {
    return this.urlState.encodeCardToUrl(card);
  }

  public async copyShareableLink(card: MemberCard): Promise<{
    readonly url: string;
    readonly copied: boolean;
  }> {
    const url = this.urlState.encodeCardToUrl(card);
    const copied = await this.cardShare.copyTextToClipboard(url);
    return { url, copied };
  }

  public buildEmbedCode(card: MemberCard): string {
    const shareUrl = this.urlState.encodeCardToUrl(card);
    const displayName = card.getDisplayName().replace(/"/g, '&quot;');
    const goal = card.getDisplayTransformationGoal().replace(/"/g, '&quot;');
    return `<a href="${shareUrl}" target="_blank" rel="noopener noreferrer" title="${displayName} - Clube do Livro (${goal})">📚 Card Clube do Livro — ${displayName}</a>`;
  }
}
