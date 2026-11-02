import { CardThemeAccent, MemberCard } from '@domain/entities/MemberCard';
import { CardUrlStatePort } from '@domain/ports/CardUrlStatePort';

const VALID_THEMES: readonly CardThemeAccent[] = [
  'triade-do-tempo',
  'mais-esperto-que-o-diabo',
  'a-montanha',
  'habitos-atomicos',
];

export class BrowserUrlCardStateAdapter implements CardUrlStatePort {
  public encodeCardToUrl(card: MemberCard): string {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const searchParams = new URLSearchParams();

    if (card.fullName.trim()) {
      searchParams.set('nome', card.fullName.trim());
    }
    if (card.city.trim()) {
      searchParams.set('cidade', card.city.trim());
    }
    if (card.state.trim()) {
      searchParams.set('estado', card.state.trim());
    }
    if (card.readingTransformationGoal.trim()) {
      searchParams.set('transformacao', card.readingTransformationGoal.trim());
    }
    if (card.memberSince.trim()) {
      searchParams.set('desde', card.memberSince.trim());
    }
    if (card.themeAccent !== 'habitos-atomicos') {
      searchParams.set('tema', card.themeAccent);
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  public decodeCardFromCurrentUrl(): MemberCard | null {
    const searchParams = new URLSearchParams(window.location.search);
    const fullName = searchParams.get('nome');
    const city = searchParams.get('cidade');
    const state = searchParams.get('estado');
    const readingTransformationGoal = searchParams.get('transformacao');
    const memberSince = searchParams.get('desde');
    const rawTheme = searchParams.get('tema');

    const hasAnyParam = Boolean(fullName || city || state || readingTransformationGoal);
    if (!hasAnyParam) {
      return null;
    }

    const themeAccent: CardThemeAccent =
      rawTheme && VALID_THEMES.includes(rawTheme as CardThemeAccent)
        ? (rawTheme as CardThemeAccent)
        : 'habitos-atomicos';

    return MemberCard.create({
      fullName: fullName ?? '',
      city: city ?? '',
      state: state ?? '',
      readingTransformationGoal: readingTransformationGoal ?? '',
      memberSince: memberSince ?? undefined,
      themeAccent,
    });
  }
}
