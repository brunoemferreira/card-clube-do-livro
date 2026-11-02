import { CardThemeAccent, MemberCard } from '@domain/entities/MemberCard';
import { CardUrlStatePort } from '@domain/ports/CardUrlStatePort';

const VALID_THEMES: readonly CardThemeAccent[] = [
  'burgundy-gold',
  'espresso-bronze',
  'royal-crimson',
];

export class BrowserUrlCardStateAdapter implements CardUrlStatePort {
  public encodeCardToUrl(card: MemberCard): string {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const searchParams = new URLSearchParams();

    if (card.fullName.trim()) {
      searchParams.set('nome', card.fullName.trim());
    }
    if (card.cityState.trim()) {
      searchParams.set('cidade', card.cityState.trim());
    }
    if (card.readingTransformationGoal.trim()) {
      searchParams.set('transformacao', card.readingTransformationGoal.trim());
    }
    if (card.memberSince.trim()) {
      searchParams.set('desde', card.memberSince.trim());
    }
    if (card.themeAccent !== 'burgundy-gold') {
      searchParams.set('tema', card.themeAccent);
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  public decodeCardFromCurrentUrl(): MemberCard | null {
    const searchParams = new URLSearchParams(window.location.search);
    const fullName = searchParams.get('nome');
    const cityState = searchParams.get('cidade');
    const readingTransformationGoal = searchParams.get('transformacao');
    const memberSince = searchParams.get('desde');
    const rawTheme = searchParams.get('tema');

    const hasAnyParam = Boolean(fullName || cityState || readingTransformationGoal);
    if (!hasAnyParam) {
      return null;
    }

    const themeAccent: CardThemeAccent =
      rawTheme && VALID_THEMES.includes(rawTheme as CardThemeAccent)
        ? (rawTheme as CardThemeAccent)
        : 'burgundy-gold';

    return MemberCard.create({
      fullName: fullName ?? '',
      cityState: cityState ?? '',
      readingTransformationGoal: readingTransformationGoal ?? '',
      memberSince: memberSince ?? undefined,
      themeAccent,
    });
  }
}

