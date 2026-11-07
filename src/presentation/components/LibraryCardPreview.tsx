import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Camera,
  Flame,
  MapPin,
  Move,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MemberCard, PhotoAlignment } from '@domain/entities/MemberCard';

export interface LibraryCardPreviewProps {
  readonly card: MemberCard;
  readonly alignedPhotoDataUrl: string | null;
  readonly exportRef: React.RefObject<HTMLDivElement | null>;
  readonly onTriggerPhotoUpload: () => void;
  readonly onUpdatePhotoAlignment: (partial: Partial<PhotoAlignment>) => void;
}

export const LibraryCardPreview: React.FC<LibraryCardPreviewProps> = ({
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
  const bookTitle = card.getBookTitle();
  const catalogCode = card.getLibraryCatalogCode();
  const initials = card.getInitials();

  return (
    <div className="badge-preview-stage">
      {/* Container exportável completo do Cartão de Biblioteca (Proporção 4:5 ideal para WhatsApp) */}
      <div
        ref={exportRef}
        data-card-model="library-card"
        className={`library-export-canvas theme-${card.themeAccent}`}
      >
        <div className="badge-ambient-glow" aria-hidden="true" />

        <article className="member-library-card">
          {/* Moldura interna pontilhada de Ficha Catalográfica */}
          <div className="library-inner-frame" aria-hidden="true" />

          {/* 1. Cabeçalho Timbrado da Biblioteca do Clube do Livro */}
          <header className="library-card-header">
            <div className="library-header-brand">
              <div className="library-logo-seal">
                <img
                  src="./logo-clube.png"
                  alt="Logo Oficial Clube do Livro"
                  className="library-header-logo"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="library-header-titles">
                <span className="library-kicker">FICHA DE BIBLIOTECA</span>
                <h2 className="library-club-title">CLUBE DO LIVRO</h2>
                <span className="library-club-subtitle">
                  Comunidade Livros &amp; Negócios
                </span>
              </div>
            </div>

            <div className="library-header-right">
              <span className="library-catalog-stamp">{catalogCode}</span>
              <button
                type="button"
                className="library-edit-photo-btn"
                onClick={onTriggerPhotoUpload}
                title="Escolher ou trocar foto"
                aria-label="Escolher ou trocar foto"
                data-export-ignore="true"
              >
                <Camera size={14} />
              </button>
            </div>
          </header>

          {/* 2. Grade de Identificação do Leitor (Foto 3x4 + Campos Catalográficos) */}
          <div className="library-reader-grid">
            <div
              className={`library-photo-frame ${card.photoDataUrl ? 'has-photo' : ''} ${
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
                    className="library-avatar-img"
                    draggable={false}
                  />
                  <span
                    className="avatar-drag-badge"
                    data-export-ignore="true"
                  >
                    <Move size={10} /> Arraste
                  </span>
                </>
              ) : (
                <div className="library-avatar-placeholder">
                  <span className="avatar-initials">{initials}</span>
                  <span className="avatar-upload-hint">
                    <Camera size={12} /> Foto 3x4
                  </span>
                </div>
              )}
            </div>

            <div className="library-reader-fields">
              <div className="library-field-box">
                <span className="library-field-label">LEITOR(A) CREDENCIADO(A)</span>
                <div className="library-reader-name-row">
                  <span className="library-reader-name">{displayName}</span>
                  <span
                    className="badge-verified-pill"
                    title="Leitor Oficial Clube do Livro"
                  >
                    <BookOpen size={12} />
                  </span>
                </div>
              </div>

              <div className="library-field-box">
                <span className="library-field-label">LOCALIZAÇÃO (CIDADE / UF)</span>
                <div className="library-reader-location">
                  <MapPin size={13} className="location-pin-icon" />
                  <span>{displayLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tabela Catalográfica (Obra em Leitura + Data de Registro) */}
          <div className="library-catalog-table">
            <div className="library-catalog-cell cell-book">
              <span className="library-cell-label">
                <BookOpen size={11} /> OBRA EM LEITURA
              </span>
              <strong className="library-book-title">{bookTitle}</strong>
            </div>
            <div className="library-catalog-cell cell-date">
              <span className="library-cell-label">
                <Calendar size={11} /> REGISTRO
              </span>
              <strong className="library-register-date">{card.memberSince}</strong>
            </div>
          </div>

          {/* 4. Ficha Pautada Literária (Pergunta Dinâmica do Livro + Citação) */}
          <div className="library-ruled-notes-box">
            <div className="library-notes-header">
              <Sparkles size={13} className="transformation-sparkle" />
              <span className="library-notes-question">{transformationQuestion}</span>
            </div>
            <p className="library-notes-quote">“{displayGoal}”</p>
          </div>

          {/* 5. Pilares do Clube do Livro */}
          <div
            className="badge-pillars-row library-pillars-row"
            aria-label="Pilares do Clube do Livro"
          >
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

          {/* 6. Rodapé com Selo + Carimbo "ACERVO OFICIAL" */}
          <footer className="library-card-footer">
            <div className="library-footer-left">
              <img
                src="./logo-clube.png"
                alt=""
                className="footer-mini-seal"
                crossOrigin="anonymous"
              />
              <span>Passaporte Literário • Clube do Livro</span>
            </div>
            <span className="library-official-stamp">ACERVO OFICIAL</span>
          </footer>
        </article>
      </div>
    </div>
  );
};
