import React, { useState } from 'react';
import {
  BookOpen,
  Camera,
  Flame,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MemberCard } from '@domain/entities/MemberCard';

export interface BadgeCardPreviewProps {
  readonly card: MemberCard;
  readonly exportRef: React.RefObject<HTMLDivElement | null>;
  readonly onTriggerPhotoUpload: () => void;
}

export const BadgeCardPreview: React.FC<BadgeCardPreviewProps> = ({
  card,
  exportRef,
  onTriggerPhotoUpload,
}) => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    setTiltStyle({
      transform: `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg)',
    });
  };

  const displayName = card.getDisplayName();
  const displayHandle = card.getDisplayHandle();
  const displayLocation = card.getDisplayCityState();
  const displayGoal = card.getDisplayTransformationGoal();
  const initials = card.getInitials();

  return (
    <div
      className="badge-preview-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={exportRef}
        className={`badge-export-canvas theme-${card.themeAccent}`}
      >
        <div className="badge-ambient-glow" aria-hidden="true" />

        {/* Lanyard / Fita do Crachá */}
        <div className="badge-lanyard-wrapper" aria-hidden="true">
          <div className="badge-lanyard-strap">
            <span className="lanyard-text">
              CLUBE DO LIVRO • LIVROS &amp; NEGÓCIOS • CLUBE DO LIVRO
            </span>
          </div>
          <div className="badge-lanyard-clasp" />
        </div>

        {/* Cartão / Crachá Principal */}
        <article className="member-badge-card" style={tiltStyle}>
          {/* Furo do crachá */}
          <div className="badge-slot-hole" aria-hidden="true" />

          {/* Banner Superior Artístico */}
          <div className="badge-card-banner">
            <div className="banner-mesh-gradient" />
            <div className="banner-gold-lines" />

            <div className="banner-brand-pill">
              <img
                src="./logo-clube.png"
                alt="Logo Clube do Livro"
                className="banner-mini-logo"
                crossOrigin="anonymous"
              />
              <span>LIVROS &amp; NEGÓCIOS</span>
            </div>

            <button
              type="button"
              className="banner-edit-photo-btn"
              onClick={onTriggerPhotoUpload}
              title="Alterar foto do card"
              aria-label="Alterar foto do card"
            >
              <Camera size={15} />
            </button>
          </div>

          {/* Foto do Membro + Selo Clube do Livro */}
          <div className="badge-avatar-section">
            <div
              className="badge-avatar-frame"
              onClick={onTriggerPhotoUpload}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTriggerPhotoUpload();
                }
              }}
              title="Clique para enviar sua foto"
            >
              {card.photoDataUrl ? (
                <img
                  src={card.photoDataUrl}
                  alt={displayName}
                  className="badge-avatar-img"
                />
              ) : (
                <div className="badge-avatar-placeholder">
                  <span className="avatar-initials">{initials}</span>
                  <span className="avatar-upload-hint">
                    <Camera size={13} /> Sua Foto
                  </span>
                </div>
              )}

              {/* Selo Dourado Oficial no canto da foto (como na referência) */}
              <div className="badge-avatar-seal" title="Membro Oficial Clube do Livro">
                <img
                  src="./logo-clube.png"
                  alt="Selo Clube do Livro"
                  className="avatar-seal-img"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>

          {/* Corpo de Identificação do Membro */}
          <div className="badge-card-body">
            <div className="badge-name-row">
              <h2 className="badge-member-name">{displayName}</h2>
              <span className="badge-verified-pill" title="Clube do Livro ID">
                <BookOpen size={13} />
              </span>
            </div>

            <p className="badge-member-handle">{displayHandle}</p>

            <p className="badge-member-role">
              Membro Oficial • Comunidade Livros &amp; Negócios
            </p>

            <div className="badge-location-row">
              <MapPin size={14} className="location-pin-icon" />
              <span>{displayLocation}</span>
            </div>

            {/* Bloco da Pergunta de Transformação */}
            <div className="badge-transformation-box">
              <div className="transformation-header">
                <Sparkles size={12} className="transformation-sparkle" />
                <span>O QUE BUSCO TRANSFORMAR ATRAVÉS DA LEITURA</span>
              </div>
              <p className="transformation-quote">“{displayGoal}”</p>
            </div>

            {/* Tags Estilo Crachá Moderno */}
            <div className="badge-pillars-row" aria-label="Pilares do Clube do Livro">
              <span className="pillar-tag tag-gold">
                <BookOpen size={11} /> LEITURA
              </span>
              <span className="pillar-tag tag-crimson">
                <TrendingUp size={11} /> NEGÓCIOS
              </span>
              <span className="pillar-tag tag-amber">
                <Flame size={11} /> MENTALIDADE
              </span>
            </div>
          </div>

          {/* Rodapé do Crachá */}
          <footer className="badge-card-footer">
            <span>Embarcou no Clube do Livro • {card.memberSince}</span>
          </footer>
        </article>
      </div>
    </div>
  );
};
