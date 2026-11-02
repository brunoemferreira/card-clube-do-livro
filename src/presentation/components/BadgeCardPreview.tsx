import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Camera,
  Flame,
  MapPin,
  Move,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MemberCard, PhotoAlignment } from '@domain/entities/MemberCard';

export interface BadgeCardPreviewProps {
  readonly card: MemberCard;
  readonly alignedPhotoDataUrl: string | null;
  readonly exportRef: React.RefObject<HTMLDivElement | null>;
  readonly onTriggerPhotoUpload: () => void;
  readonly onUpdatePhotoAlignment: (partial: Partial<PhotoAlignment>) => void;
}

export const BadgeCardPreview: React.FC<BadgeCardPreviewProps> = ({
  card,
  alignedPhotoDataUrl,
  exportRef,
  onTriggerPhotoUpload,
  onUpdatePhotoAlignment,
}) => {
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!card.photoDataUrl) {
      onTriggerPhotoUpload();
      return;
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingPhoto(true);
    dragStartRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      startOffsetX: card.photoAlignment.offsetX,
      startOffsetY: card.photoAlignment.offsetY,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPhoto || !dragStartRef.current) {
      return;
    }
    const deltaX = event.clientX - dragStartRef.current.clientX;
    const deltaY = event.clientY - dragStartRef.current.clientY;

    const nextOffsetX = Math.max(
      -100,
      Math.min(100, Math.round(dragStartRef.current.startOffsetX + deltaX * 0.9)),
    );
    const nextOffsetY = Math.max(
      -100,
      Math.min(100, Math.round(dragStartRef.current.startOffsetY + deltaY * 0.9)),
    );

    onUpdatePhotoAlignment({
      offsetX: nextOffsetX,
      offsetY: nextOffsetY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingPhoto) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setIsDraggingPhoto(false);
      dragStartRef.current = null;
    }
  };

  const displayName = card.getDisplayName();
  const displayLocation = card.getDisplayCityState();
  const displayGoal = card.getDisplayTransformationGoal();
  const transformationQuestion = card.getTransformationPromptQuestion();
  const initials = card.getInitials();

  return (
    <div className="badge-preview-stage">
      {/* Container exportável completo (Fita + Crachá inteiro) */}
      <div
        ref={exportRef}
        className={`badge-export-canvas theme-${card.themeAccent}`}
      >
        <div className="badge-ambient-glow" aria-hidden="true" />

        {/* Lanyard / Fita Superior do Crachá */}
        <div className="badge-lanyard-wrapper" aria-hidden="true">
          <div className="badge-lanyard-strap">
            <span className="lanyard-text">
              CLUBE DO LIVRO • LIVROS &amp; NEGÓCIOS
            </span>
          </div>
          <div className="badge-lanyard-clasp" />
        </div>

        {/* Cartão / Crachá Principal */}
        <article className="member-badge-card">
          {/* Furo do crachá */}
          <div className="badge-slot-hole" aria-hidden="true" />

          {/* Banner Superior com Grande Destaque para o Logo Oficial Clube do Livro */}
          <div className="badge-card-banner">
            <div className="banner-mesh-gradient" />
            <div className="banner-gold-lines" />

            <div className="banner-hero-brand">
              <div className="banner-logo-medallion">
                <img
                  src="./logo-clube.png"
                  alt="Logo Oficial Clube do Livro"
                  className="banner-prominent-logo"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="banner-brand-texts">
                <span className="banner-club-title">CLUBE DO LIVRO</span>
                <span className="banner-club-subtitle">Livros &amp; Negócios</span>
              </div>
            </div>

            <button
              type="button"
              className="banner-edit-photo-btn"
              onClick={onTriggerPhotoUpload}
              title="Escolher ou trocar foto"
              aria-label="Escolher ou trocar foto"
              data-export-ignore="true"
            >
              <Camera size={15} />
            </button>
          </div>

          {/* Foto do Membro com Suporte a Arrastar para Alinhar */}
          <div className="badge-avatar-section">
            <div
              className={`badge-avatar-frame ${card.photoDataUrl ? 'has-photo' : ''} ${
                isDraggingPhoto ? 'is-dragging' : ''
              }`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTriggerPhotoUpload();
                }
              }}
              title={
                card.photoDataUrl
                  ? 'Arraste a foto para alinhar ou use os controles ao lado'
                  : 'Clique para enviar sua foto'
              }
            >
              {alignedPhotoDataUrl ? (
                <>
                  <img
                    src={alignedPhotoDataUrl}
                    alt={displayName}
                    className="badge-avatar-img"
                    draggable={false}
                  />
                  <span
                    className="avatar-drag-badge"
                    data-export-ignore="true"
                  >
                    <Move size={11} /> Arraste p/ alinhar
                  </span>
                </>
              ) : (
                <div className="badge-avatar-placeholder">
                  <span className="avatar-initials">{initials}</span>
                  <span className="avatar-upload-hint">
                    <Camera size={13} /> Sua Foto
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Corpo de Identificação do Membro */}
          <div className="badge-card-body">
            <div className="badge-name-row">
              <h2 className="badge-member-name">{displayName}</h2>
              <span className="badge-verified-pill" title="Membro Verificado Clube do Livro">
                <BookOpen size={13} />
              </span>
            </div>

            <p className="badge-member-role">
              <span className="badge-role-kicker">• Membro Oficial •</span>
              <span className="badge-role-community">
                Comunidade Clube do Livro - Livros &amp; Negócios
              </span>
            </p>

            <div className="badge-location-row">
              <MapPin size={14} className="location-pin-icon" />
              <span>{displayLocation}</span>
            </div>

            {/* Bloco da Pergunta de Transformação com o Livro Selecionado */}
            <div className="badge-transformation-box">
              <div className="transformation-header">
                <Sparkles size={13} className="transformation-sparkle" />
                <span>{transformationQuestion}</span>
              </div>
              <p className="transformation-quote">“{displayGoal}”</p>
            </div>

            {/* Tags de Pilares */}
            <div className="badge-pillars-row" aria-label="Pilares do Clube do Livro">
              <span className="pillar-tag tag-gold">
                <BookOpen size={11} /> LEITURA
              </span>
              <span className="pillar-tag tag-crimson">
                <TrendingUp size={11} /> ESTRATÉGIA
              </span>
              <span className="pillar-tag tag-amber">
                <Flame size={11} /> MENTALIDADE
              </span>
            </div>
          </div>

          {/* Rodapé do Crachá com Selo e Data */}
          <footer className="badge-card-footer">
            <img
              src="./logo-clube.png"
              alt=""
              className="footer-mini-seal"
              crossOrigin="anonymous"
            />
            <span>Embarcou no Clube do Livro • {card.memberSince}</span>
          </footer>
        </article>
      </div>
    </div>
  );
};
