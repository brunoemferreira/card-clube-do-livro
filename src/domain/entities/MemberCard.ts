export type CardThemeAccent = 'burgundy-gold' | 'espresso-bronze' | 'royal-crimson';

export interface MemberCardProps {
  readonly fullName: string;
  readonly cityState: string;
  readonly readingTransformationGoal: string;
  readonly photoDataUrl: string | null;
  readonly memberSince: string;
  readonly themeAccent: CardThemeAccent;
}

export interface MemberCardValidationResult {
  readonly isValid: boolean;
  readonly missingFields: readonly string[];
}

export class MemberCard {
  public readonly fullName: string;
  public readonly cityState: string;
  public readonly readingTransformationGoal: string;
  public readonly photoDataUrl: string | null;
  public readonly memberSince: string;
  public readonly themeAccent: CardThemeAccent;

  private constructor(props: MemberCardProps) {
    this.fullName = props.fullName;
    this.cityState = props.cityState;
    this.readingTransformationGoal = props.readingTransformationGoal;
    this.photoDataUrl = props.photoDataUrl;
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
      cityState: props.cityState ?? '',
      readingTransformationGoal: props.readingTransformationGoal ?? '',
      photoDataUrl: props.photoDataUrl ?? null,
      memberSince: props.memberSince ?? todayFormatted,
      themeAccent: props.themeAccent ?? 'burgundy-gold',
    });
  }

  public withUpdatedField<K extends keyof MemberCardProps>(
    field: K,
    value: MemberCardProps[K],
  ): MemberCard {
    return new MemberCard({
      fullName: this.fullName,
      cityState: this.cityState,
      readingTransformationGoal: this.readingTransformationGoal,
      photoDataUrl: this.photoDataUrl,
      memberSince: this.memberSince,
      themeAccent: this.themeAccent,
      [field]: value,
    });
  }

  public getDisplayName(): string {
    const trimmed = this.fullName.trim();
    return trimmed.length > 0 ? trimmed : 'Seu Nome Completo';
  }

  public getDisplayHandle(): string {
    const trimmed = this.fullName.trim();
    if (!trimmed) {
      return '@membro.clubedolivro';
    }
    const normalized = trimmed
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('.');
    return `@${normalized || 'leitor'}`;
  }

  public getDisplayCityState(): string {
    const trimmed = this.cityState.trim();
    return trimmed.length > 0 ? trimmed : 'Sua Cidade / UF';
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
    if (this.cityState.trim().length === 0) {
      missingFields.push('Cidade / Estado');
    }
    if (this.readingTransformationGoal.trim().length === 0) {
      missingFields.push('Objetivo de transformação com a leitura');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  public buildWhatsAppShareMessage(shareableUrl: string): string {
    const name = this.getDisplayName();
    const location = this.getDisplayCityState();
    const goal = this.getDisplayTransformationGoal();

    return [
      `📚✨ *Embarquei no Clube do Livro | Livros & Negócios!*`,
      ``,
      `👤 *Membro:* ${name}`,
      `📍 *Local:* ${location}`,
      `🎯 *O que busco transformar através da leitura:*`,
      `"${goal}"`,
      ``,
      `🔗 Veja meu Card Oficial ou gere o seu também:`,
      shareableUrl,
    ].join('\n');
  }

  public toPrimitives(): MemberCardProps {
    return {
      fullName: this.fullName,
      cityState: this.cityState,
      readingTransformationGoal: this.readingTransformationGoal,
      photoDataUrl: this.photoDataUrl,
      memberSince: this.memberSince,
      themeAccent: this.themeAccent,
    };
  }
}
