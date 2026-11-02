import { MemberCard } from '@domain/entities/MemberCard';
import { CardUrlStatePort } from '@domain/ports/CardUrlStatePort';

export class SyncCardUrlStateUseCase {
  private readonly urlState: CardUrlStatePort;

  public constructor(urlState: CardUrlStatePort) {
    this.urlState = urlState;
  }

  public loadFromUrlOrDefault(): MemberCard {
    const decoded = this.urlState.decodeCardFromCurrentUrl();
    return decoded ?? MemberCard.create({});
  }
}
