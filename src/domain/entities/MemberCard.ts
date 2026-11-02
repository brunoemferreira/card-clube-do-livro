export type CardThemeAccent =
  | 'triade-do-tempo'
  | 'mais-esperto-que-o-diabo'
  | 'a-montanha'
  | 'habitos-atomicos';

export interface PhotoAlignment {
  readonly zoom: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export interface MemberCardProps {
  readonly fullName: string;
  readonly city: string;
  readonly state: string;
  readonly readingTransformationGoal: string;
  readonly photoDataUrl: string | null;
  readonly photoAlignment: PhotoAlignment;
  readonly memberSince: string;
  readonly themeAccent: CardThemeAccent;
}

export interface MemberCardValidationResult {
  readonly isValid: boolean;
  readonly missingFields: readonly string[];
}

export const DEFAULT_PHOTO_ALIGNMENT: PhotoAlignment = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

const BOOK_THEME_TITLES: Record<CardThemeAccent, string> = {
  'triade-do-tempo': 'A Tríade do Tempo',
  'mais-esperto-que-o-diabo': 'Mais Esperto que o Diabo',
  'a-montanha': 'A Montanha',
  'habitos-atomicos': 'Hábitos Atômicos',
};

export class MemberCard {
  public readonly fullName: string;
  public readonly city: string;
  public readonly state: string;
  public readonly readingTransformationGoal: string;
  public readonly photoDataUrl: string | null;
  public readonly photoAlignment: PhotoAlignment;
  public readonly memberSince: string;
  public readonly themeAccent: CardThemeAccent;

  private constructor(props: MemberCardProps) {
    this.fullName = props.fullName;
    this.city = props.city;
    this.state = props.state;
    this.readingTransformationGoal = props.readingTransformationGoal;
    this.photoDataUrl = props.photoDataUrl;
    this.photoAlignment = props.photoAlignment;
    this.memberSince = props.memberSince;
    this.themeAccent = props.themeAccent;
  }

  public static create(props: Partial<MemberCardProps>): MemberCard {
    const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());

    return new MemberCard({
      fullName: props.fullName ?? '',
      city: props.city ?? '',
      state: props.state ?? '',
      readingTransformationGoal: props.readingTransformationGoal ?? '',
      photoDataUrl: props.photoDataUrl ?? null,
      photoAlignment: props.photoAlignment ?? DEFAULT_PHOTO_ALIGNMENT,
      memberSince: props.memberSince ?? todayFormatted,
      themeAccent: props.themeAccent ?? 'habitos-atomicos',
    });
  }

  public withUpdatedField<K extends keyof MemberCardProps>(
    field: K,
    value: MemberCardProps[K],
  ): MemberCard {
    return new MemberCard({
      fullName: this.fullName,
      city: this.city,
      state: this.state,
      readingTransformationGoal: this.readingTransformationGoal,
      photoDataUrl: this.photoDataUrl,
      photoAlignment: this.photoAlignment,
      memberSince: this.memberSince,
      themeAccent: this.themeAccent,
      [field]: value,
    });
  }

  public withUpdatedPhotoAlignment(partialAlignment: Partial<PhotoAlignment>): MemberCard {
    return this.withUpdatedField('photoAlignment', {
      ...this.photoAlignment,
      ...partialAlignment,
    });
  }

  public getBookTitle(): string {
    return BOOK_THEME_TITLES[this.themeAccent];
  }

  public getTransformationPromptQuestion(): string {
    return `O que você busca transformar na sua vida através da leitura de ${this.getBookTitle()}?`;
  }

  public getDisplayName(): string {
    const trimmed = this.fullName.trim();
    return trimmed.length > 0 ? trimmed : 'Seu Nome Completo';
  }

  public getDisplayCityState(): string {
    const trimmedCity = this.city.trim();
    const trimmedState = this.state.trim();

    if (trimmedCity && trimmedState) {
      return `${trimmedCity} / ${trimmedState}`;
    }
    if (trimmedCity) {
      return trimmedCity;
    }
    if (trimmedState) {
      return trimmedState;
    }
    return 'Sua Cidade / UF';
  }

  public getDisplayTransformationGoal(): string {
    const trimmed = this.readingTransformationGoal.trim();
    return trimmed.length > 0
      ? trimmed
      : 'Expandir minha mentalidade, desenvolver liderança e transformar conhecimento em resultados reais através da leitura.';
  }

  public getInitials(): string {
    const trimmed = this.fullName.trim();
    if (!trimmed) {
      return 'CL';
    }
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  public getFileSlug(): string {
    const trimmed = this.fullName.trim();
    if (!trimmed) {
      return 'card-clube-do-livro';
    }
    const slug = trimmed
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `clube-do-livro-${slug || 'membro'}`;
  }

  public validateForExport(): MemberCardValidationResult {
    const missingFields: string[] = [];

    if (this.fullName.trim().length === 0) {
      missingFields.push('Nome');
    }
    if (this.city.trim().length === 0) {
      missingFields.push('Cidade');
    }
    if (this.state.trim().length === 0) {
      missingFields.push('Estado');
    }
    if (this.readingTransformationGoal.trim().length === 0) {
      missingFields.push('Objetivo de transformação com a leitura');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  public buildWhatsAppCaption(): string {
    const name = this.getDisplayName();
    const location = this.getDisplayCityState();
    const question = this.getTransformationPromptQuestion();
    const goal = this.getDisplayTransformationGoal();

    return [
      `📚✨ *Embarquei no Clube do Livro | Livros & Negócios!*`,
      ``,
      `👤 *Membro:* ${name} (${location})`,
      `🎯 *${question}*`,
      `"${goal}"`,
    ].join('\n');
  }

  public toPrimitives(): MemberCardProps {
    return {
      fullName: this.fullName,
      city: this.city,
      state: this.state,
      readingTransformationGoal: this.readingTransformationGoal,
      photoDataUrl: this.photoDataUrl,
      photoAlignment: this.photoAlignment,
      memberSince: this.memberSince,
      themeAccent: this.themeAccent,
    };
  }
}
