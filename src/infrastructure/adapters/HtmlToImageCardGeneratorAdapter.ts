import {
  CardImageGeneratorPort,
  GeneratedCardImage,
} from '@domain/ports/CardImageGeneratorPort';

interface ThemeVisualPalette {
  readonly bannerStops: readonly [string, string, string];
  readonly bannerGlowPrimary: string;
  readonly bannerGlowSecondary: string;
  readonly bannerTitleColor: string;
  readonly bannerSubtitleColor: string;
  readonly lanyardStops: readonly [string, string, string];
  readonly lanyardBorder: string;
  readonly lanyardTextColor: string;
  readonly cardBgStops: readonly [string, string];
  readonly cardBorder: string;
  readonly avatarBorderStops: readonly [string, string, string];
  readonly quoteBoxBgStops: readonly [string, string];
  readonly quoteBoxBorder: string;
  readonly libraryAccentColor: string;
  readonly libraryStampBg: string;
  readonly libraryStampBorder: string;
  readonly libraryStampText: string;
}

const THEME_PALETTES: Record<string, ThemeVisualPalette> = {
  'triade-do-tempo': {
    bannerStops: ['#c2410c', '#f97316', '#7c2d12'],
    bannerGlowPrimary: 'rgba(255, 255, 255, 0.42)',
    bannerGlowSecondary: 'rgba(251, 146, 60, 0.72)',
    bannerTitleColor: '#f6e29c',
    bannerSubtitleColor: '#f3f0ec',
    lanyardStops: ['#431407', '#ea580c', '#431407'],
    lanyardBorder: 'rgba(255, 255, 255, 0.45)',
    lanyardTextColor: 'rgba(246, 226, 156, 0.75)',
    cardBgStops: ['#271107', '#160904'],
    cardBorder: 'rgba(249, 115, 22, 0.5)',
    avatarBorderStops: ['#ffffff', '#f97316', '#fbbf24'],
    quoteBoxBgStops: ['rgba(249, 115, 22, 0.25)', 'rgba(28, 12, 5, 0.88)'],
    quoteBoxBorder: 'rgba(251, 146, 60, 0.48)',
    libraryAccentColor: '#fb923c',
    libraryStampBg: 'rgba(249, 115, 22, 0.22)',
    libraryStampBorder: 'rgba(251, 146, 60, 0.65)',
    libraryStampText: '#ffedd5',
  },
  'mais-esperto-que-o-diabo': {
    bannerStops: ['#09090b', '#991b1b', '#180406'],
    bannerGlowPrimary: 'rgba(220, 38, 38, 0.82)',
    bannerGlowSecondary: 'rgba(250, 204, 21, 0.38)',
    bannerTitleColor: '#f6e29c',
    bannerSubtitleColor: '#f3f0ec',
    lanyardStops: ['#1c0c0e', '#2f1217', '#190a0c'],
    lanyardBorder: 'rgba(212, 175, 55, 0.35)',
    lanyardTextColor: 'rgba(246, 226, 156, 0.65)',
    cardBgStops: ['#1b1214', '#120b0d'],
    cardBorder: 'rgba(212, 175, 55, 0.34)',
    avatarBorderStops: ['#f6e29c', '#990000', '#d4af37'],
    quoteBoxBgStops: ['rgba(91, 0, 0, 0.28)', 'rgba(20, 10, 12, 0.82)'],
    quoteBoxBorder: 'rgba(212, 175, 55, 0.28)',
    libraryAccentColor: '#facc15',
    libraryStampBg: 'rgba(220, 38, 38, 0.24)',
    libraryStampBorder: 'rgba(250, 204, 21, 0.55)',
    libraryStampText: '#fef08a',
  },
  'a-montanha': {
    bannerStops: ['#09090b', '#18181b', '#09090b'],
    bannerGlowPrimary: 'rgba(212, 175, 55, 0.3)',
    bannerGlowSecondary: 'rgba(234, 179, 8, 0.45)',
    bannerTitleColor: '#f6e29c',
    bannerSubtitleColor: '#f3f0ec',
    lanyardStops: ['#09090b', '#27272a', '#09090b'],
    lanyardBorder: 'rgba(234, 179, 8, 0.5)',
    lanyardTextColor: 'rgba(246, 226, 156, 0.65)',
    cardBgStops: ['#141417', '#09090b'],
    cardBorder: 'rgba(234, 179, 8, 0.48)',
    avatarBorderStops: ['#fef08a', '#ca8a04', '#18181b'],
    quoteBoxBgStops: ['rgba(234, 179, 8, 0.16)', 'rgba(12, 12, 14, 0.92)'],
    quoteBoxBorder: 'rgba(234, 179, 8, 0.42)',
    libraryAccentColor: '#eab308',
    libraryStampBg: 'rgba(234, 179, 8, 0.16)',
    libraryStampBorder: 'rgba(234, 179, 8, 0.6)',
    libraryStampText: '#fef08a',
  },
  'habitos-atomicos': {
    bannerStops: ['#e7dfd3', '#f5efe6', '#d6c7b2'],
    bannerGlowPrimary: 'rgba(166, 110, 36, 0.4)',
    bannerGlowSecondary: 'rgba(212, 175, 55, 0.35)',
    bannerTitleColor: '#784712',
    bannerSubtitleColor: '#292524',
    lanyardStops: ['#cfc2b0', '#f5efe6', '#cfc2b0'],
    lanyardBorder: 'rgba(166, 110, 36, 0.55)',
    lanyardTextColor: '#784712',
    cardBgStops: ['#261c14', '#17110b'],
    cardBorder: 'rgba(194, 132, 47, 0.55)',
    avatarBorderStops: ['#f5efe6', '#a66e24', '#d4af37'],
    quoteBoxBgStops: ['rgba(245, 239, 230, 0.12)', 'rgba(30, 20, 12, 0.88)'],
    quoteBoxBorder: 'rgba(194, 132, 47, 0.48)',
    libraryAccentColor: '#f6e29c',
    libraryStampBg: 'rgba(166, 110, 36, 0.28)',
    libraryStampBorder: 'rgba(212, 175, 55, 0.65)',
    libraryStampText: '#784712',
  },
};

export class HtmlToImageCardGeneratorAdapter implements CardImageGeneratorPort {
  public async generatePngFromElement(
    element: HTMLElement,
    fileNameWithoutExtension: string,
  ): Promise<GeneratedCardImage> {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const isLibraryCard =
      element.getAttribute('data-card-model') === 'library-card' ||
      element.classList.contains('library-export-canvas');

    if (isLibraryCard) {
      return this.generateLibraryCardPng(element, fileNameWithoutExtension);
    }

    return this.generateBadgeCardPng(element, fileNameWithoutExtension);
  }

  private async generateBadgeCardPng(
    element: HTMLElement,
    fileNameWithoutExtension: string,
  ): Promise<GeneratedCardImage> {
    const themeKey = this.extractThemeFromElement(element);
    const palette =
      THEME_PALETTES[themeKey] ?? THEME_PALETTES['habitos-atomicos'];

    const memberName =
      element.querySelector('.badge-member-name')?.textContent?.trim() ||
      'Seu Nome Completo';
    const locationText =
      element.querySelector('.badge-location-row span')?.textContent?.trim() ||
      'Sua Cidade / UF';
    const transformationQuestion =
      element.querySelector('.transformation-header span')?.textContent?.trim() ||
      'O que você busca transformar na sua vida através da leitura?';
    const transformationQuote =
      element.querySelector('.transformation-quote')?.textContent?.trim() ||
      '“Expandir minha mentalidade, desenvolver liderança e transformar conhecimento em resultados reais através da leitura.”';
    const footerText =
      element.querySelector('.badge-card-footer span')?.textContent?.trim() ||
      'Embarcou no Clube do Livro';
    const initialsText =
      element.querySelector('.avatar-initials')?.textContent?.trim() || 'CL';

    const avatarImgElement = element.querySelector<HTMLImageElement>('.badge-avatar-img');
    const logoImgElement =
      element.querySelector<HTMLImageElement>('.banner-prominent-logo');

    const [logoImage, avatarImage] = await Promise.all([
      this.loadImageSafe(logoImgElement?.src || './logo-clube.png'),
      avatarImgElement?.src ? this.loadImageSafe(avatarImgElement.src) : Promise.resolve(null),
    ]);

    const scale = 3;
    const baseWidth = 382;
    const cardX = 16;
    const cardWidth = baseWidth - cardX * 2; // 350px
    const cardTopY = 52;
    const bannerHeight = 128;

    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d')!;

    measureCtx.font = '800 19px "Plus Jakarta Sans", sans-serif';
    const nameLines = this.wrapText(measureCtx, memberName, cardWidth - 76);

    measureCtx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    const questionLines = this.wrapText(
      measureCtx,
      transformationQuestion,
      cardWidth - 66,
    );

    measureCtx.font = 'italic 600 15px "Cormorant Garamond", Georgia, serif';
    const quoteLines = this.wrapText(measureCtx, transformationQuote, cardWidth - 52);

    const nameBlockHeight = nameLines.length * 23;
    const questionBlockHeight = questionLines.length * 15;
    const quoteBlockHeight = quoteLines.length * 20;
    const quoteBoxHeight = 24 + questionBlockHeight + 8 + quoteBlockHeight;

    const bodyStartY = cardTopY + bannerHeight + 70 + 14;
    const roleY = bodyStartY + nameBlockHeight + 8;
    const locationY = roleY + 38;
    const quoteBoxY = locationY + 24;
    const pillarsY = quoteBoxY + quoteBoxHeight + 14;
    const footerY = pillarsY + 36;
    const footerHeight = 36;
    const cardBottomY = footerY + footerHeight;
    const baseHeight = cardBottomY + 20;

    const canvas = document.createElement('canvas');
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    // 1. Fundo do Canvas Exportado (#0A0506 + Brilho Radial)
    ctx.fillStyle = '#0a0506';
    this.fillRoundedRect(ctx, 0, 0, baseWidth, baseHeight, 22);

    const bgGlow = ctx.createRadialGradient(
      baseWidth / 2,
      baseHeight * 0.2,
      10,
      baseWidth / 2,
      baseHeight * 0.2,
      baseWidth * 0.65,
    );
    bgGlow.addColorStop(0, 'rgba(153, 0, 0, 0.28)');
    bgGlow.addColorStop(1, 'rgba(10, 5, 6, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // 2. Lanyard (Fita Superior + Presilha Dourada)
    const strapWidth = 40;
    const strapHeight = 50;
    const strapX = (baseWidth - strapWidth) / 2;
    const strapGrad = ctx.createLinearGradient(strapX, 0, strapX + strapWidth, 0);
    strapGrad.addColorStop(0, palette.lanyardStops[0]);
    strapGrad.addColorStop(0.5, palette.lanyardStops[1]);
    strapGrad.addColorStop(1, palette.lanyardStops[2]);
    ctx.fillStyle = strapGrad;
    ctx.fillRect(strapX, 0, strapWidth, strapHeight);

    ctx.strokeStyle = palette.lanyardBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(strapX, 0);
    ctx.lineTo(strapX, strapHeight);
    ctx.moveTo(strapX + strapWidth, 0);
    ctx.lineTo(strapX + strapWidth, strapHeight);
    ctx.stroke();

    ctx.save();
    ctx.translate(baseWidth / 2 + 3, strapHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '800 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.lanyardTextColor;
    ctx.textAlign = 'center';
    ctx.fillText('CLUBE DO LIVRO', 0, 0);
    ctx.restore();

    const claspWidth = 50;
    const claspHeight = 9;
    const claspX = (baseWidth - claspWidth) / 2;
    const claspY = strapHeight - 2;
    const claspGrad = ctx.createLinearGradient(claspX, 0, claspX + claspWidth, 0);
    claspGrad.addColorStop(0, '#8b6514');
    claspGrad.addColorStop(0.5, '#f5df98');
    claspGrad.addColorStop(1, '#8b6514');
    ctx.fillStyle = claspGrad;
    this.fillRoundedRect(ctx, claspX, claspY, claspWidth, claspHeight, 4);

    // 3. Corpo Principal do Crachá
    const cardHeight = cardBottomY - cardTopY;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;
    const cardBgGrad = ctx.createLinearGradient(0, cardTopY, 0, cardBottomY);
    cardBgGrad.addColorStop(0, palette.cardBgStops[0]);
    cardBgGrad.addColorStop(1, palette.cardBgStops[1]);
    ctx.fillStyle = cardBgGrad;
    this.fillRoundedRect(ctx, cardX, cardTopY, cardWidth, cardHeight, 20);
    ctx.restore();

    ctx.save();
    this.roundedRectPath(ctx, cardX, cardTopY, cardWidth, cardHeight, 20);
    ctx.clip();

    // 4. Banner Superior do Tema do Livro
    const bannerGrad = ctx.createLinearGradient(
      cardX,
      cardTopY,
      cardX + cardWidth,
      cardTopY + bannerHeight,
    );
    bannerGrad.addColorStop(0, palette.bannerStops[0]);
    bannerGrad.addColorStop(0.52, palette.bannerStops[1]);
    bannerGrad.addColorStop(1, palette.bannerStops[2]);
    ctx.fillStyle = bannerGrad;
    ctx.fillRect(cardX, cardTopY, cardWidth, bannerHeight);

    const bannerGlow1 = ctx.createRadialGradient(
      cardX + cardWidth * 0.8,
      cardTopY + bannerHeight * 0.26,
      4,
      cardX + cardWidth * 0.8,
      cardTopY + bannerHeight * 0.26,
      cardWidth * 0.55,
    );
    bannerGlow1.addColorStop(0, palette.bannerGlowPrimary);
    bannerGlow1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bannerGlow1;
    ctx.fillRect(cardX, cardTopY, cardWidth, bannerHeight);

    const bannerGlow2 = ctx.createRadialGradient(
      cardX + cardWidth * 0.22,
      cardTopY + bannerHeight * 0.4,
      4,
      cardX + cardWidth * 0.22,
      cardTopY + bannerHeight * 0.4,
      cardWidth * 0.5,
    );
    bannerGlow2.addColorStop(0, palette.bannerGlowSecondary);
    bannerGlow2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bannerGlow2;
    ctx.fillRect(cardX, cardTopY, cardWidth, bannerHeight);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.34)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cardX, cardTopY + bannerHeight);
    ctx.lineTo(cardX + cardWidth, cardTopY + bannerHeight);
    ctx.stroke();

    const slotW = 50;
    const slotH = 6;
    const slotX = (baseWidth - slotW) / 2;
    const slotY = cardTopY + 8;
    ctx.fillStyle = '#070304';
    this.fillRoundedRect(ctx, slotX, slotY, slotW, slotH, 99);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, slotX, slotY, slotW, slotH, 99);

    const medX = cardX + 14;
    const medY = cardTopY + 16;
    const medSize = 58;
    const medCenterX = medX + medSize / 2;
    const medCenterY = medY + medSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(medCenterX, medCenterY, medSize / 2, 0, Math.PI * 2);
    const medGrad = ctx.createRadialGradient(
      medCenterX,
      medCenterY,
      4,
      medCenterX,
      medCenterY,
      medSize / 2,
    );
    medGrad.addColorStop(0, 'rgba(246, 226, 156, 0.28)');
    medGrad.addColorStop(1, 'rgba(16, 6, 8, 0.85)');
    ctx.fillStyle = medGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(246, 226, 156, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    if (logoImage) {
      const logoDrawSize = 52;
      ctx.drawImage(
        logoImage,
        medCenterX - logoDrawSize / 2,
        medCenterY - logoDrawSize / 2,
        logoDrawSize,
        logoDrawSize,
      );
    }

    const brandTextX = medX + medSize + 10;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '700 17px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = palette.bannerTitleColor;
    ctx.fillText('CLUBE DO LIVRO', brandTextX, medCenterY - 2);

    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.bannerSubtitleColor;
    ctx.fillText('Livros & Negócios', brandTextX, medCenterY + 13);
    ctx.restore();

    // 5. Foto do Perfil (Squircle Centralizado)
    const avatarSize = 116;
    const avatarX = (baseWidth - avatarSize) / 2;
    const avatarY = cardTopY + bannerHeight - 46;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.68)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    const avatarBorderGrad = ctx.createLinearGradient(
      avatarX,
      avatarY,
      avatarX + avatarSize,
      avatarY + avatarSize,
    );
    avatarBorderGrad.addColorStop(0, palette.avatarBorderStops[0]);
    avatarBorderGrad.addColorStop(0.5, palette.avatarBorderStops[1]);
    avatarBorderGrad.addColorStop(1, palette.avatarBorderStops[2]);
    ctx.fillStyle = avatarBorderGrad;
    this.fillRoundedRect(ctx, avatarX, avatarY, avatarSize, avatarSize, 30);
    ctx.restore();

    const innerPad = 3;
    const innerSize = avatarSize - innerPad * 2;
    const innerX = avatarX + innerPad;
    const innerY = avatarY + innerPad;

    ctx.save();
    this.roundedRectPath(ctx, innerX, innerY, innerSize, innerSize, 27);
    ctx.clip();
    if (avatarImage) {
      ctx.drawImage(avatarImage, innerX, innerY, innerSize, innerSize);
    } else {
      const placeholderGrad = ctx.createRadialGradient(
        innerX + innerSize * 0.3,
        innerY + innerSize * 0.25,
        5,
        innerX + innerSize * 0.5,
        innerY + innerSize * 0.5,
        innerSize,
      );
      placeholderGrad.addColorStop(0, '#3d1218');
      placeholderGrad.addColorStop(1, '#15080a');
      ctx.fillStyle = placeholderGrad;
      ctx.fillRect(innerX, innerY, innerSize, innerSize);

      ctx.font = '700 32px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#f6e29c';
      ctx.textAlign = 'center';
      ctx.fillText(initialsText, baseWidth / 2, innerY + innerSize / 2 + 10);
    }
    ctx.restore();

    // 6. Nome do Membro + Ícone Verificado
    ctx.font = '800 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';

    nameLines.forEach((line, index) => {
      const lineY = bodyStartY + (index + 1) * 20;
      if (index === 0) {
        const lineWidth = ctx.measureText(line).width;
        const pillSize = 20;
        const gap = 6;
        const totalRowWidth = lineWidth + gap + pillSize;
        const startX = (baseWidth - totalRowWidth) / 2;

        ctx.textAlign = 'left';
        ctx.fillText(line, startX, lineY);

        const pillX = startX + lineWidth + gap;
        const pillY = lineY - 15;
        const pillGrad = ctx.createLinearGradient(
          pillX,
          pillY,
          pillX + pillSize,
          pillY + pillSize,
        );
        pillGrad.addColorStop(0, '#7b0918');
        pillGrad.addColorStop(1, '#b60c2d');
        ctx.fillStyle = pillGrad;
        this.fillRoundedRect(ctx, pillX, pillY, pillSize, pillSize, 6);
        ctx.strokeStyle = 'rgba(246, 226, 156, 0.5)';
        ctx.lineWidth = 1;
        this.strokeRoundedRect(ctx, pillX, pillY, pillSize, pillSize, 6);
        this.drawLucideBookOpenIcon(ctx, pillX + 3.5, pillY + 3.5, 13, '#f6e29c');

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
      } else {
        ctx.fillText(line, baseWidth / 2, lineY);
      }
    });

    // 7. Cargo / Comunidade
    ctx.textAlign = 'center';
    ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f6e29c';
    ctx.fillText('• Membro Oficial •', baseWidth / 2, roleY + 11);

    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f3f0ec';
    ctx.fillText(
      'Comunidade Clube do Livro - Livros & Negócios',
      baseWidth / 2,
      roleY + 26,
    );

    // 8. Localização
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    const locWidth = ctx.measureText(locationText).width;
    const locTotalW = 14 + 5 + locWidth;
    const locStartX = (baseWidth - locTotalW) / 2;
    this.drawLucideMapPinIcon(ctx, locStartX, locationY + 1, 14, '#d4af37');
    ctx.fillStyle = '#d6ccbe';
    ctx.textAlign = 'left';
    ctx.fillText(locationText, locStartX + 19, locationY + 12);

    // 9. Caixa da Pergunta de Transformação
    const boxMarginX = 18;
    const boxX = cardX + boxMarginX;
    const boxW = cardWidth - boxMarginX * 2;

    const boxGrad = ctx.createLinearGradient(0, quoteBoxY, 0, quoteBoxY + quoteBoxHeight);
    boxGrad.addColorStop(0, palette.quoteBoxBgStops[0]);
    boxGrad.addColorStop(1, palette.quoteBoxBgStops[1]);
    ctx.fillStyle = boxGrad;
    this.fillRoundedRect(ctx, boxX, quoteBoxY, boxW, quoteBoxHeight, 12);
    ctx.strokeStyle = palette.quoteBoxBorder;
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, boxX, quoteBoxY, boxW, quoteBoxHeight, 12);

    this.drawLucideSparklesIcon(ctx, boxX + 10, quoteBoxY + 9, 13, '#d4af37');
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f6e29c';
    ctx.textAlign = 'left';
    questionLines.forEach((line, idx) => {
      ctx.fillText(line, boxX + 27, quoteBoxY + 19 + idx * 15);
    });

    const quoteStartY = quoteBoxY + 19 + questionBlockHeight + 6;
    ctx.font = 'italic 600 15px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#f3f0ec';
    quoteLines.forEach((line, idx) => {
      ctx.fillText(line, boxX + 14, quoteStartY + idx * 20);
    });

    // 10. Tags de Pilares (LEITURA | ESTRATÉGIA | MENTALIDADE)
    this.drawPillarTagsRow(ctx, baseWidth, pillarsY);

    // 11. Rodapé do Crachá
    ctx.fillStyle = 'rgba(8, 3, 4, 0.5)';
    ctx.fillRect(cardX, footerY, cardWidth, footerHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX, footerY);
    ctx.lineTo(cardX + cardWidth, footerY);
    ctx.stroke();

    ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
    const footerTextW = ctx.measureText(footerText).width;
    const footerTotalW = 15 + 6 + footerTextW;
    const footerStartX = (baseWidth - footerTotalW) / 2;

    if (logoImage) {
      ctx.drawImage(logoImage, footerStartX, footerY + 10.5, 15, 15);
    }
    ctx.fillStyle = '#8c7b72';
    ctx.textAlign = 'left';
    ctx.fillText(footerText, footerStartX + 21, footerY + 21.5);

    ctx.restore();

    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 1.5;
    this.strokeRoundedRect(ctx, cardX, cardTopY, cardWidth, cardHeight, 20);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await this.convertDataUrlToBlob(dataUrl);
    const fileName = `${fileNameWithoutExtension}.png`;

    return {
      dataUrl,
      blob,
      fileName,
    };
  }

  /**
   * Renderiza o Modelo 2: Cartão de Biblioteca do Clube do Livro em 3x Retina (Proporção 4:5 ideal para WhatsApp)
   */
  private async generateLibraryCardPng(
    element: HTMLElement,
    fileNameWithoutExtension: string,
  ): Promise<GeneratedCardImage> {
    const themeKey = this.extractThemeFromElement(element);
    const palette =
      THEME_PALETTES[themeKey] ?? THEME_PALETTES['habitos-atomicos'];

    const memberName =
      element.querySelector('.library-reader-name')?.textContent?.trim() ||
      'Seu Nome Completo';
    const locationText =
      element.querySelector('.library-reader-location span')?.textContent?.trim() ||
      'Sua Cidade / UF';
    const catalogCode =
      element.querySelector('.library-catalog-stamp')?.textContent?.trim() ||
      '#HA-2026';
    const bookTitle =
      element.querySelector('.library-book-title')?.textContent?.trim() ||
      'Hábitos Atômicos';
    const registerDate =
      element.querySelector('.library-register-date')?.textContent?.trim() ||
      '07/11/2026';
    const transformationQuestion =
      element.querySelector('.library-notes-question')?.textContent?.trim() ||
      'O que você busca transformar na sua vida através da leitura?';
    const transformationQuote =
      element.querySelector('.library-notes-quote')?.textContent?.trim() ||
      '“Expandir minha mentalidade, desenvolver liderança e transformar conhecimento em resultados reais através da leitura.”';
    const initialsText =
      element.querySelector('.avatar-initials')?.textContent?.trim() || 'CL';

    const avatarImgElement =
      element.querySelector<HTMLImageElement>('.library-avatar-img');
    const logoImgElement =
      element.querySelector<HTMLImageElement>('.library-header-logo');

    const [logoImage, avatarImage] = await Promise.all([
      this.loadImageSafe(logoImgElement?.src || './logo-clube.png'),
      avatarImgElement?.src
        ? this.loadImageSafe(avatarImgElement.src)
        : Promise.resolve(null),
    ]);

    const scale = 3;
    const baseWidth = 382;
    const cardX = 16;
    const cardWidth = baseWidth - cardX * 2; // 350px
    const cardTopY = 18;
    const headerHeight = 82;

    const measureCanvas = document.createElement('canvas');
    const measureCtx = measureCanvas.getContext('2d')!;

    // Medir linhas do nome do leitor ao lado da foto 3x4
    const readerRightColW = cardWidth - 36 - 86 - 12; // ~216px
    measureCtx.font = '800 15px "Plus Jakarta Sans", sans-serif';
    const nameLines = this.wrapText(measureCtx, memberName, readerRightColW - 36);

    // Medir pergunta e citação nas linhas pautadas
    const notesBoxW = cardWidth - 36; // 314px
    measureCtx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    const questionLines = this.wrapText(
      measureCtx,
      transformationQuestion,
      notesBoxW - 42,
    );

    measureCtx.font = 'italic 600 15px "Cormorant Garamond", Georgia, serif';
    const quoteLines = this.wrapText(
      measureCtx,
      transformationQuote,
      notesBoxW - 28,
    );

    const questionBlockH = questionLines.length * 15;
    const quoteBlockH = Math.max(2, quoteLines.length) * 22;
    const notesBoxHeight = 20 + questionBlockH + 10 + quoteBlockH + 10;

    const readerGridY = cardTopY + headerHeight + 14;
    const readerGridH = 104;
    const catalogTableY = readerGridY + readerGridH + 12;
    const catalogTableH = 48;
    const notesBoxY = catalogTableY + catalogTableH + 12;
    const pillarsY = notesBoxY + notesBoxHeight + 14;
    const footerY = pillarsY + 34;
    const footerHeight = 40;
    const cardBottomY = footerY + footerHeight;
    const baseHeight = cardBottomY + 18;

    const canvas = document.createElement('canvas');
    canvas.width = baseWidth * scale;
    canvas.height = baseHeight * scale;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(scale, scale);

    // 1. Fundo Escuro do Canvas Exportado (#0a0506)
    ctx.fillStyle = '#0a0506';
    this.fillRoundedRect(ctx, 0, 0, baseWidth, baseHeight, 22);

    const bgGlow = ctx.createRadialGradient(
      baseWidth / 2,
      baseHeight * 0.25,
      10,
      baseWidth / 2,
      baseHeight * 0.25,
      baseWidth * 0.7,
    );
    bgGlow.addColorStop(0, palette.bannerGlowPrimary);
    bgGlow.addColorStop(1, 'rgba(10, 5, 6, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, baseWidth, baseHeight);

    // 2. Corpo Principal da Ficha de Biblioteca
    const cardHeight = cardBottomY - cardTopY;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    const cardBgGrad = ctx.createLinearGradient(0, cardTopY, 0, cardBottomY);
    cardBgGrad.addColorStop(0, palette.cardBgStops[0]);
    cardBgGrad.addColorStop(1, palette.cardBgStops[1]);
    ctx.fillStyle = cardBgGrad;
    this.fillRoundedRect(ctx, cardX, cardTopY, cardWidth, cardHeight, 16);
    ctx.restore();

    ctx.save();
    this.roundedRectPath(ctx, cardX, cardTopY, cardWidth, cardHeight, 16);
    ctx.clip();

    // 3. Cabeçalho Timbrado da Ficha de Biblioteca (Com cores do Livro)
    const headerGrad = ctx.createLinearGradient(
      cardX,
      cardTopY,
      cardX + cardWidth,
      cardTopY + headerHeight,
    );
    headerGrad.addColorStop(0, palette.bannerStops[0]);
    headerGrad.addColorStop(0.55, palette.bannerStops[1]);
    headerGrad.addColorStop(1, palette.bannerStops[2]);
    ctx.fillStyle = headerGrad;
    ctx.fillRect(cardX, cardTopY, cardWidth, headerHeight);

    const headerGlow = ctx.createRadialGradient(
      cardX + cardWidth * 0.8,
      cardTopY + headerHeight * 0.3,
      4,
      cardX + cardWidth * 0.8,
      cardTopY + headerHeight * 0.3,
      cardWidth * 0.55,
    );
    headerGlow.addColorStop(0, palette.bannerGlowPrimary);
    headerGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = headerGlow;
    ctx.fillRect(cardX, cardTopY, cardWidth, headerHeight);

    // Linha dupla de ficha catalográfica abaixo do header
    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cardX, cardTopY + headerHeight);
    ctx.lineTo(cardX + cardWidth, cardTopY + headerHeight);
    ctx.stroke();

    // Selo Redondo com Logo Oficial no Header
    const sealSize = 50;
    const sealX = cardX + 16;
    const sealY = cardTopY + (headerHeight - sealSize) / 2;
    const sealCX = sealX + sealSize / 2;
    const sealCY = sealY + sealSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(sealCX, sealCY, sealSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 6, 8, 0.82)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(246, 226, 156, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    if (logoImage) {
      const logoDraw = 44;
      ctx.drawImage(
        logoImage,
        sealCX - logoDraw / 2,
        sealCY - logoDraw / 2,
        logoDraw,
        logoDraw,
      );
    }

    // Textos do Cabeçalho da Ficha de Biblioteca
    const titleX = sealX + sealSize + 10;
    ctx.textAlign = 'left';
    ctx.font = '800 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = palette.bannerTitleColor;
    ctx.fillText('FICHA DE BIBLIOTECA', titleX, cardTopY + 26);

    ctx.font = '700 16.5px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = palette.bannerTitleColor;
    ctx.fillText('CLUBE DO LIVRO', titleX, cardTopY + 45);

    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.bannerSubtitleColor;
    ctx.fillText('Comunidade Livros & Negócios', titleX, cardTopY + 60);

    // Selo de Código Catalográfico (#HA-2026) no canto direito
    ctx.font = '700 10px "JetBrains Mono", monospace';
    const stampW = ctx.measureText(catalogCode).width + 16;
    const stampH = 22;
    const stampX = cardX + cardWidth - stampW - 16;
    const stampY = cardTopY + 16;

    ctx.fillStyle = palette.libraryStampBg;
    this.fillRoundedRect(ctx, stampX, stampY, stampW, stampH, 6);
    ctx.strokeStyle = palette.libraryStampBorder;
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, stampX, stampY, stampW, stampH, 6);
    ctx.fillStyle = palette.libraryStampText;
    ctx.textAlign = 'center';
    ctx.fillText(catalogCode, stampX + stampW / 2, stampY + 14.5);

    // 4. Grade do Leitor: Foto 3x4 à Esquerda + Campos Catalográficos à Direita
    const innerMarginX = 18;
    const photoX = cardX + innerMarginX;
    const photoY = readerGridY;
    const photoW = 86;
    const photoH = readerGridH; // 104px (Proporção 3x4)

    ctx.save();
    const photoBorderGrad = ctx.createLinearGradient(
      photoX,
      photoY,
      photoX + photoW,
      photoY + photoH,
    );
    photoBorderGrad.addColorStop(0, palette.avatarBorderStops[0]);
    photoBorderGrad.addColorStop(0.5, palette.avatarBorderStops[1]);
    photoBorderGrad.addColorStop(1, palette.avatarBorderStops[2]);
    ctx.fillStyle = photoBorderGrad;
    this.fillRoundedRect(ctx, photoX, photoY, photoW, photoH, 12);
    ctx.restore();

    const pPad = 2.5;
    const pInnerX = photoX + pPad;
    const pInnerY = photoY + pPad;
    const pInnerW = photoW - pPad * 2;
    const pInnerH = photoH - pPad * 2;

    ctx.save();
    this.roundedRectPath(ctx, pInnerX, pInnerY, pInnerW, pInnerH, 10);
    ctx.clip();
    if (avatarImage) {
      // Desenha mantendo preenchimento centralizado (cover) no quadro 3x4
      const scaleCover = Math.max(
        pInnerW / avatarImage.width,
        pInnerH / avatarImage.height,
      );
      const dw = avatarImage.width * scaleCover;
      const dh = avatarImage.height * scaleCover;
      const dx = pInnerX + (pInnerW - dw) / 2;
      const dy = pInnerY + (pInnerH - dh) / 2;
      ctx.drawImage(avatarImage, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#190b0e';
      ctx.fillRect(pInnerX, pInnerY, pInnerW, pInnerH);
      ctx.font = '700 26px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#f6e29c';
      ctx.textAlign = 'center';
      ctx.fillText(initialsText, pInnerX + pInnerW / 2, pInnerY + pInnerH / 2 + 8);
    }
    ctx.restore();

    // Campos à Direita da Foto 3x4 (Leitor Credenciado + Cidade/UF)
    const fieldsX = photoX + photoW + 12;
    const fieldsW = cardWidth - innerMarginX * 2 - photoW - 12;

    // Caixa 1: LEITOR(A) CREDENCIADO(A)
    const field1Y = readerGridY;
    const field1H = 54;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    this.fillRoundedRect(ctx, fieldsX, field1Y, fieldsW, field1H, 9);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.24)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, fieldsX, field1Y, fieldsW, field1H, 9);

    ctx.textAlign = 'left';
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a8998c';
    ctx.fillText('LEITOR(A) CREDENCIADO(A)', fieldsX + 10, field1Y + 14);

    ctx.font = '800 14.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    const displayFirstLine = nameLines[0] || memberName;
    ctx.fillText(displayFirstLine, fieldsX + 10, field1Y + 34);

    if (nameLines.length > 1) {
      ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e5dec9';
      ctx.fillText(nameLines[1], fieldsX + 10, field1Y + 48);
    }

    // Ícone Verificado no canto da Caixa 1
    const vPillSize = 18;
    const vPillX = fieldsX + fieldsW - vPillSize - 8;
    const vPillY = field1Y + 18;
    ctx.fillStyle = '#8b0a1a';
    this.fillRoundedRect(ctx, vPillX, vPillY, vPillSize, vPillSize, 5);
    ctx.strokeStyle = 'rgba(246, 226, 156, 0.5)';
    this.strokeRoundedRect(ctx, vPillX, vPillY, vPillSize, vPillSize, 5);
    this.drawLucideBookOpenIcon(ctx, vPillX + 3, vPillY + 3, 12, '#f6e29c');

    // Caixa 2: LOCALIZAÇÃO (CIDADE / UF)
    const field2Y = field1Y + field1H + 6;
    const field2H = readerGridH - field1H - 6; // 44px
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    this.fillRoundedRect(ctx, fieldsX, field2Y, fieldsW, field2H, 9);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.24)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, fieldsX, field2Y, fieldsW, field2H, 9);

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a8998c';
    ctx.fillText('LOCALIZAÇÃO (CIDADE / UF)', fieldsX + 10, field2Y + 13);

    this.drawLucideMapPinIcon(ctx, fieldsX + 10, field2Y + 20, 13, '#d4af37');
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f3f0ec';
    ctx.fillText(locationText, fieldsX + 27, field2Y + 31);

    // 5. Tabela Catalográfica (OBRA EM LEITURA | REGISTRO)
    const tableX = cardX + innerMarginX;
    const tableW = cardWidth - innerMarginX * 2;
    const col1W = Math.round(tableW * 0.64);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    this.fillRoundedRect(ctx, tableX, catalogTableY, tableW, catalogTableH, 10);
    ctx.strokeStyle = palette.quoteBoxBorder;
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, tableX, catalogTableY, tableW, catalogTableH, 10);

    // Divisória vertical da tabela
    ctx.beginPath();
    ctx.moveTo(tableX + col1W, catalogTableY);
    ctx.lineTo(tableX + col1W, catalogTableY + catalogTableH);
    ctx.stroke();

    // Coluna 1: Obra em Leitura
    this.drawLucideBookOpenIcon(
      ctx,
      tableX + 10,
      catalogTableY + 8,
      11,
      palette.libraryAccentColor,
    );
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a8998c';
    ctx.textAlign = 'left';
    ctx.fillText('OBRA EM LEITURA', tableX + 24, catalogTableY + 17);

    ctx.font = '800 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.libraryAccentColor;
    ctx.fillText(bookTitle, tableX + 10, catalogTableY + 36);

    // Coluna 2: Registro (Data)
    const col2X = tableX + col1W;
    this.drawLucideCalendarIcon(
      ctx,
      col2X + 10,
      catalogTableY + 8,
      11,
      palette.libraryAccentColor,
    );
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a8998c';
    ctx.fillText('REGISTRO', col2X + 24, catalogTableY + 17);

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f3f0ec';
    ctx.fillText(registerDate, col2X + 10, catalogTableY + 36);

    // 6. Bloco Pautado Literário (Pergunta Dinâmica do Livro + Citação)
    const notesX = cardX + innerMarginX;
    const notesGrad = ctx.createLinearGradient(
      0,
      notesBoxY,
      0,
      notesBoxY + notesBoxHeight,
    );
    notesGrad.addColorStop(0, palette.quoteBoxBgStops[0]);
    notesGrad.addColorStop(1, palette.quoteBoxBgStops[1]);
    ctx.fillStyle = notesGrad;
    this.fillRoundedRect(ctx, notesX, notesBoxY, notesBoxW, notesBoxHeight, 12);
    ctx.strokeStyle = palette.quoteBoxBorder;
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, notesX, notesBoxY, notesBoxW, notesBoxHeight, 12);

    // Pergunta com Sparkles
    this.drawLucideSparklesIcon(ctx, notesX + 10, notesBoxY + 9, 13, '#d4af37');
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f6e29c';
    ctx.textAlign = 'left';
    questionLines.forEach((line, idx) => {
      ctx.fillText(line, notesX + 27, notesBoxY + 19 + idx * 15);
    });

    // Linhas pautadas de ficha de biblioteca + Citação
    const quoteFirstLineY = notesBoxY + 19 + questionBlockH + 22;
    const totalRuledLines = Math.max(2, quoteLines.length);

    for (let i = 0; i < totalRuledLines; i++) {
      const lineBaseY = quoteFirstLineY + i * 22;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(notesX + 12, lineBaseY + 4);
      ctx.lineTo(notesX + notesBoxW - 12, lineBaseY + 4);
      ctx.stroke();

      if (quoteLines[i]) {
        ctx.font = 'italic 600 15px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#f3f0ec';
        ctx.fillText(quoteLines[i], notesX + 14, lineBaseY);
      }
    }

    // 7. Tags de Pilares (LEITURA | ESTRATÉGIA | MENTALIDADE)
    this.drawPillarTagsRow(ctx, baseWidth, pillarsY);

    // 8. Rodapé com Selo + Carimbo "ACERVO OFICIAL"
    ctx.fillStyle = 'rgba(8, 3, 4, 0.58)';
    ctx.fillRect(cardX, footerY, cardWidth, footerHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX, footerY);
    ctx.lineTo(cardX + cardWidth, footerY);
    ctx.stroke();

    if (logoImage) {
      ctx.drawImage(logoImage, cardX + 16, footerY + 12.5, 15, 15);
    }
    ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#a8998c';
    ctx.textAlign = 'left';
    ctx.fillText('Passaporte Literário • Clube do Livro', cardX + 36, footerY + 23.5);

    // Carimbo "ACERVO OFICIAL"
    ctx.font = '800 8.5px "JetBrains Mono", monospace';
    const stampLabel = 'ACERVO OFICIAL';
    const officialW = ctx.measureText(stampLabel).width + 14;
    const officialH = 19;
    const officialX = cardX + cardWidth - officialW - 14;
    const officialY = footerY + 10.5;

    ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
    this.fillRoundedRect(ctx, officialX, officialY, officialW, officialH, 4);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, officialX, officialY, officialW, officialH, 4);
    ctx.fillStyle = '#f6e29c';
    ctx.textAlign = 'center';
    ctx.fillText(stampLabel, officialX + officialW / 2, officialY + 13);

    // Moldura interna tracejada sutil da ficha de biblioteca
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(
      ctx,
      cardX + 6,
      cardTopY + 6,
      cardWidth - 12,
      cardHeight - 12,
      12,
    );
    ctx.restore();

    ctx.restore(); // Fim do clip do card

    // Borda externa do Cartão de Biblioteca
    ctx.strokeStyle = palette.cardBorder;
    ctx.lineWidth = 1.5;
    this.strokeRoundedRect(ctx, cardX, cardTopY, cardWidth, cardHeight, 16);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await this.convertDataUrlToBlob(dataUrl);
    const fileName = `${fileNameWithoutExtension}.png`;

    return {
      dataUrl,
      blob,
      fileName,
    };
  }

  private drawPillarTagsRow(
    ctx: CanvasRenderingContext2D,
    baseWidth: number,
    pillarsY: number,
  ): void {
    const tags: ReadonlyArray<{
      readonly label: string;
      readonly icon: 'book' | 'trending' | 'flame';
      readonly textColor: string;
      readonly bgColor: string;
      readonly borderColor: string;
    }> = [
      {
        label: 'LEITURA',
        icon: 'book',
        textColor: '#f6e29c',
        bgColor: 'rgba(212, 175, 55, 0.12)',
        borderColor: 'rgba(212, 175, 55, 0.34)',
      },
      {
        label: 'ESTRATÉGIA',
        icon: 'trending',
        textColor: '#fda4af',
        bgColor: 'rgba(153, 0, 0, 0.24)',
        borderColor: 'rgba(182, 12, 45, 0.4)',
      },
      {
        label: 'MENTALIDADE',
        icon: 'flame',
        textColor: '#fcd34d',
        bgColor: 'rgba(180, 83, 9, 0.18)',
        borderColor: 'rgba(245, 158, 11, 0.34)',
      },
    ];

    ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
    const tagGap = 6;
    const iconSize = 11;
    const iconTextGap = 4.5;
    const tagPadX = 8.5;
    const tagWidths = tags.map(
      (t) => tagPadX * 2 + iconSize + iconTextGap + ctx.measureText(t.label).width,
    );
    const totalTagsWidth =
      tagWidths.reduce((acc, w) => acc + w, 0) + tagGap * (tags.length - 1);
    let currentTagX = (baseWidth - totalTagsWidth) / 2;

    tags.forEach((tag, i) => {
      const tw = tagWidths[i];
      const th = 22;
      ctx.fillStyle = tag.bgColor;
      this.fillRoundedRect(ctx, currentTagX, pillarsY, tw, th, 6);
      ctx.strokeStyle = tag.borderColor;
      ctx.lineWidth = 1;
      this.strokeRoundedRect(ctx, currentTagX, pillarsY, tw, th, 6);

      const iconX = currentTagX + tagPadX;
      const iconY = pillarsY + (th - iconSize) / 2;

      if (tag.icon === 'book') {
        this.drawLucideBookOpenIcon(ctx, iconX, iconY, iconSize, tag.textColor);
      } else if (tag.icon === 'trending') {
        this.drawLucideTrendingUpIcon(ctx, iconX, iconY, iconSize, tag.textColor);
      } else {
        this.drawLucideFlameIcon(ctx, iconX, iconY, iconSize, tag.textColor);
      }

      ctx.fillStyle = tag.textColor;
      ctx.textAlign = 'left';
      ctx.fillText(
        tag.label,
        iconX + iconSize + iconTextGap,
        pillarsY + 14.5,
      );
      currentTagX += tw + tagGap;
    });
  }

  private extractThemeFromElement(element: HTMLElement): string {
    for (const className of Array.from(element.classList)) {
      if (className.startsWith('theme-')) {
        return className.replace('theme-', '');
      }
    }
    return 'habitos-atomicos';
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [''];
    }
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const candidate = `${currentLine} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines;
  }

  private roundedRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  private fillRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    this.roundedRectPath(ctx, x, y, w, h, r);
    ctx.fill();
  }

  private strokeRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    this.roundedRectPath(ctx, x, y, w, h, r);
    ctx.stroke();
  }

  private drawLucideBookOpenIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D('M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'));
    ctx.stroke(new Path2D('M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'));
    ctx.restore();
  }

  private drawLucideCalendarIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D('M8 2v4M16 2v4'));
    ctx.stroke(
      new Path2D(
        'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      ),
    );
    ctx.stroke(new Path2D('M3 10h18'));
    ctx.restore();
  }

  private drawLucideTrendingUpIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(new Path2D('M22 7L13.5 15.5L8.5 10.5L2 17'));
    ctx.stroke(new Path2D('M16 7H22V13'));
    ctx.restore();
  }

  private drawLucideFlameIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(
      new Path2D(
        'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
      ),
    );
    ctx.restore();
  }

  private drawLucideMapPinIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(
      new Path2D(
        'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
      ),
    );
    ctx.beginPath();
    ctx.arc(12, 10, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private drawLucideSparklesIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(
      new Path2D(
        'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
      ),
    );
    ctx.stroke(new Path2D('M20 3v4M22 5h-4M4 17v2M5 18H3'));
    ctx.restore();
  }

  private loadImageSafe(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  private async convertDataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }
}
