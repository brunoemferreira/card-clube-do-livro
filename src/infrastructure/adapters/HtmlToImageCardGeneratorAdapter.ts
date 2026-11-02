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

    const themeKey = this.extractThemeFromElement(element);
    const palette =
      THEME_PALETTES[themeKey] ?? THEME_PALETTES['mais-esperto-que-o-diabo'];

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

    // Pre-calcula linhas de texto para determinar a altura exata do card sem qualquer sobreposição
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

    const bodyStartY = cardTopY + bannerHeight + 70 + 14; // Abaixo do avatar
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

    // Texto Vertical na Fita
    ctx.save();
    ctx.translate(baseWidth / 2 + 3, strapHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '800 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = palette.lanyardTextColor;
    ctx.textAlign = 'center';
    ctx.fillText('CLUBE DO LIVRO', 0, 0);
    ctx.restore();

    // Presilha Metálica Dourada
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

    // 3. Corpo Principal do Crachá (com clip arredondado)
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

    // Clip do interior do crachá
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

    // Linha divisória inferior do banner
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.34)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cardX, cardTopY + bannerHeight);
    ctx.lineTo(cardX + cardWidth, cardTopY + bannerHeight);
    ctx.stroke();

    // Furo superior do crachá
    const slotW = 50;
    const slotH = 6;
    const slotX = (baseWidth - slotW) / 2;
    const slotY = cardTopY + 8;
    ctx.fillStyle = '#070304';
    this.fillRoundedRect(ctx, slotX, slotY, slotW, slotH, 99);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    this.strokeRoundedRect(ctx, slotX, slotY, slotW, slotH, 99);

    // Medalhão e Logo Oficial Clube do Livro no Banner
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

    // Título "CLUBE DO LIVRO" e Subtítulo "Livros & Negócios" ao lado do medalhão (sem quebrar linha!)
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

    // 6. Nome do Membro + Ícone Verificado ao lado da primeira linha
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

        // Ícone Verificado ao lado do nome
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
        this.drawMiniBookIcon(ctx, pillX + 4.5, pillY + 5, 11, '#f6e29c');

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
      } else {
        ctx.fillText(line, baseWidth / 2, lineY);
      }
    });

    // 7. Cargo / Comunidade em 2 linhas
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

    // 8. Localização (Cidade / Estado) com Pin
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    const locWidth = ctx.measureText(locationText).width;
    const locTotalW = 14 + 5 + locWidth;
    const locStartX = (baseWidth - locTotalW) / 2;
    this.drawMapPinIcon(ctx, locStartX + 7, locationY + 7, '#d4af37');
    ctx.fillStyle = '#d6ccbe';
    ctx.textAlign = 'left';
    ctx.fillText(locationText, locStartX + 19, locationY + 12);

    // 9. Caixa da Pergunta de Transformação (Altura Dinâmica — Nunca corta!)
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

    // Ícone Sparkle + Pergunta com o nome do livro
    this.drawSparkleIcon(ctx, boxX + 16, quoteBoxY + 16, '#d4af37');
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f6e29c';
    ctx.textAlign = 'left';
    questionLines.forEach((line, idx) => {
      ctx.fillText(line, boxX + 27, quoteBoxY + 19 + idx * 15);
    });

    // Citação / Resposta do Membro
    const quoteStartY = quoteBoxY + 19 + questionBlockHeight + 6;
    ctx.font = 'italic 600 15px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#f3f0ec';
    quoteLines.forEach((line, idx) => {
      ctx.fillText(line, boxX + 14, quoteStartY + idx * 20);
    });

    // 10. Tags de Pilares (LEITURA | ESTRATÉGIA | MENTALIDADE)
    const tags = [
      {
        label: 'LEITURA',
        textColor: '#f6e29c',
        bgColor: 'rgba(212, 175, 55, 0.12)',
        borderColor: 'rgba(212, 175, 55, 0.34)',
      },
      {
        label: 'ESTRATÉGIA',
        textColor: '#fda4af',
        bgColor: 'rgba(153, 0, 0, 0.24)',
        borderColor: 'rgba(182, 12, 45, 0.4)',
      },
      {
        label: 'MENTALIDADE',
        textColor: '#fcd34d',
        bgColor: 'rgba(180, 83, 9, 0.18)',
        borderColor: 'rgba(245, 158, 11, 0.34)',
      },
    ];

    ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
    const tagGap = 6;
    const tagWidths = tags.map((t) => ctx.measureText(t.label).width + 20);
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

      ctx.fillStyle = tag.textColor;
      ctx.textAlign = 'center';
      ctx.fillText(tag.label, currentTagX + tw / 2, pillarsY + 14.5);
      currentTagX += tw + tagGap;
    });

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

    ctx.restore(); // Fim do clip do card

    // Borda externa do crachá
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

  private extractThemeFromElement(element: HTMLElement): string {
    for (const className of Array.from(element.classList)) {
      if (className.startsWith('theme-')) {
        return className.replace('theme-', '');
      }
    }
    return 'mais-esperto-que-o-diabo';
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

  private drawMiniBookIcon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y + 1.5);
    ctx.lineTo(x + size / 2, y + size - 1);
    ctx.moveTo(x + 1, y + 1);
    ctx.quadraticCurveTo(x + size * 0.25, y + 0.5, x + size / 2, y + 2);
    ctx.quadraticCurveTo(x + size * 0.75, y + 0.5, x + size - 1, y + 1);
    ctx.lineTo(x + size - 1, y + size - 1.5);
    ctx.quadraticCurveTo(x + size * 0.75, y + size - 2, x + size / 2, y + size - 0.5);
    ctx.quadraticCurveTo(x + size * 0.25, y + size - 2, x + 1, y + size - 1.5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  private drawMapPinIcon(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    color: string,
  ): void {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(centerX, centerY - 1.5, 4.2, Math.PI * 0.85, Math.PI * 0.15, false);
    ctx.lineTo(centerX, centerY + 5.5);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY - 1.5, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  private drawSparkleIcon(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    color: string,
  ): void {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    const rOuter = 5;
    const rInner = 1.6;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? rOuter : rInner;
      const px = centerX + Math.cos(angle) * r;
      const py = centerY + Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
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
