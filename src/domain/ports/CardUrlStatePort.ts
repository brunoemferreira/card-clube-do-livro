import { MemberCard } from '../entities/MemberCard';

export interface CardUrlStatePort {
  encodeCardToUrl(card: MemberCard): string;
  decodeCardFromCurrentUrl(): MemberCard | null;
}

