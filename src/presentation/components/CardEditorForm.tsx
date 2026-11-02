import React from 'react';
import {
  ArrowLeftRight,
  ArrowUpDown,
  Camera,
  MapPin,
  Palette,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  User,
  ZoomIn,
} from 'lucide-react';
import {
  CardThemeAccent,
  MemberCard,
  PhotoAlignment,
} from '@domain/entities/MemberCard';

export interface CardEditorFormProps {
  readonly card: MemberCard;
  readonly alignedPhotoDataUrl: string | null;
  readonly fileInputRef: React.RefObject<HTMLInputElement | null>;
  readonly isUploadingAvatar: boolean;
  readonly onUpdateFullName: (value: string) => void;
  readonly onUpdateCityState: (value: string) => void;
  readonly onUpdateTransformationGoal: (value: string) => void;
  readonly onUpdateThemeAccent: (value: CardThemeAccent) => void;
  readonly onUpdatePhotoAlignment: (partial: Partial<PhotoAlignment>) => void;
  readonly onResetPhotoAlignment: () => void;
  readonly onAvatarFileSelected: (file: File | null) => void;
  readonly onRemoveAvatar: () => void;
}

const TRANSFORMATION_SUGGESTIONS: readonly string[] = [
  'Desenvolver inteligência emocional, liderança e transformar leitura em resultados reais nos negócios.',
  'Criar o hábito diário da leitura para expandir minha visão estratégica e conquistar liberdade financeira.',
  'Conectar com mentes empreendedoras e aplicar cada livro na evolução da minha carreira e vida pessoal.',
];

const THEME_OPTIONS: ReadonlyArray<{
  readonly id: CardThemeAccent;
  readonly label: string;
  readonly swatchGradient: string;
}> = [
  {
    id: 'burgundy-gold',
    label: 'Vinho & Ouro',
    swatchGradient: 'linear-gradient(135deg, #7B0918 0%, #D4AF37 100%)',
  },
  {
    id: 'espresso-bronze',
    label: 'Café & Bronze',
    swatchGradient: 'linear-gradient(135deg, #3B1F16 0%, #C88A4B 100%)',
  },
  {
    id: 'royal-crimson',
    label: 'Rubi Imperial',
    swatchGradient: 'linear-gradient(135deg, #990000 0%, #F5C451 100%)',
  },
];

export const CardEditorForm: React.FC<CardEditorFormProps> = ({
  card,
  alignedPhotoDataUrl,
  fileInputRef,
  isUploadingAvatar,
  onUpdateFullName,
  onUpdateCityState,
  onUpdateTransformationGoal,
  onUpdateThemeAccent,
  onUpdatePhotoAlignment,
  onResetPhotoAlignment,
  onAvatarFileSelected,
  onRemoveAvatar,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onAvatarFileSelected(file);
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    onAvatarFileSelected(file);
  };

  return (
    <section className="editor-form-section" aria-label="Personalizar dados do Card">
      <div className="section-title-group">
        <span className="step-kicker">PASSO 1 • PERSONALIZAÇÃO AO VIVO</span>
        <h2 className="section-heading">Preencha seus dados de Membro</h2>
        <p className="section-subtitle">
          À medida que você preenche, sua credencial ao lado é atualizada em tempo real.
        </p>
      </div>

      {/* Upload e Alinhamento de Foto */}
      <div className="form-field-group">
        <label className="form-label" htmlFor="member-photo-input">
          <Camera size={15} />
          <span>Foto do Perfil</span>
        </label>

        <div
          className="photo-upload-dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            id="member-photo-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only-input"
          />

          <div className="photo-upload-preview-row">
            {alignedPhotoDataUrl ? (
              <img
                src={alignedPhotoDataUrl}
                alt="Prévia da foto alinhada"
                className="mini-avatar-thumb"
              />
            ) : (
              <div className="mini-avatar-empty">
                <Camera size={20} />
              </div>
            )}

            <div className="photo-upload-actions">
              <button
                type="button"
                className="btn-upload-trigger"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                <Upload size={15} />
                <span>
                  {isUploadingAvatar
                    ? 'Processando foto...'
                    : card.photoDataUrl
                      ? 'Trocar foto'
                      : 'Escolher ou arrastar foto'}
                </span>
              </button>

              {card.photoDataUrl && (
                <button
                  type="button"
                  className="btn-remove-photo"
                  onClick={onRemoveAvatar}
                  title="Remover foto"
                >
                  <Trash2 size={14} />
                  <span>Remover</span>
                </button>
              )}
            </div>
          </div>

          {/* Controles de Alinhamento da Foto (Evita cortar a cabeça) */}
          {card.photoDataUrl && (
            <div className="photo-alignment-panel">
              <div className="alignment-panel-header">
                <span className="alignment-title">
                  Ajustar enquadramento da foto (ou arraste direto no crachá)
                </span>
                <button
                  type="button"
                  className="btn-reset-alignment"
                  onClick={onResetPhotoAlignment}
                >
                  <RotateCcw size={12} />
                  <span>Centralizar</span>
                </button>
              </div>

              <div className="alignment-sliders-grid">
                <label className="alignment-slider-item">
                  <span className="slider-label">
                    <ArrowUpDown size={13} /> Altura (Vertical)
                  </span>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    step={1}
                    value={card.photoAlignment.offsetY}
                    onChange={(e) =>
                      onUpdatePhotoAlignment({ offsetY: Number(e.target.value) })
                    }
                    className="alignment-range-input"
                  />
                </label>

                <label className="alignment-slider-item">
                  <span className="slider-label">
                    <ArrowLeftRight size={13} /> Posição (Horizontal)
                  </span>
                  <input
                    type="range"
                    min={-100}
                    max={100}
                    step={1}
                    value={card.photoAlignment.offsetX}
                    onChange={(e) =>
                      onUpdatePhotoAlignment({ offsetX: Number(e.target.value) })
                    }
                    className="alignment-range-input"
                  />
                </label>

                <label className="alignment-slider-item">
                  <span className="slider-label">
                    <ZoomIn size={13} /> Zoom ({Math.round(card.photoAlignment.zoom * 100)}%)
                  </span>
                  <input
                    type="range"
                    min={0.85}
                    max={2.4}
                    step={0.05}
                    value={card.photoAlignment.zoom}
                    onChange={(e) =>
                      onUpdatePhotoAlignment({ zoom: Number(e.target.value) })
                    }
                    className="alignment-range-input"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nome e Cidade/Estado em Grid */}
      <div className="form-row-grid">
        <div className="form-field-group">
          <label className="form-label" htmlFor="member-name-input">
            <User size={15} />
            <span>Nome</span>
          </label>
          <input
            id="member-name-input"
            type="text"
            className="form-text-input"
            placeholder="Ex.: Cecília Sasaki"
            maxLength={42}
            value={card.fullName}
            onChange={(e) => onUpdateFullName(e.target.value)}
          />
        </div>

        <div className="form-field-group">
          <label className="form-label" htmlFor="member-location-input">
            <MapPin size={15} />
            <span>Cidade / Estado</span>
          </label>
          <input
            id="member-location-input"
            type="text"
            className="form-text-input"
            placeholder="Ex.: São Paulo / SP"
            maxLength={38}
            value={card.cityState}
            onChange={(e) => onUpdateCityState(e.target.value)}
          />
        </div>
      </div>

      {/* Pergunta de Transformação */}
      <div className="form-field-group">
        <div className="form-label-with-counter">
          <label className="form-label" htmlFor="member-goal-textarea">
            <Sparkles size={15} />
            <span>O que você busca transformar na sua vida através da leitura?</span>
          </label>
          <span className="char-counter">
            {card.readingTransformationGoal.length}/180
          </span>
        </div>

        <textarea
          id="member-goal-textarea"
          className="form-textarea-input"
          rows={3}
          maxLength={180}
          placeholder="Escreva como a leitura vai impulsionar sua mentalidade, carreira ou negócios..."
          value={card.readingTransformationGoal}
          onChange={(e) => onUpdateTransformationGoal(e.target.value)}
        />

        <div className="suggestions-bar">
          <span className="suggestions-label">Ideias rápidas:</span>
          <div className="suggestion-chips">
            {TRANSFORMATION_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-chip"
                onClick={() => onUpdateTransformationGoal(suggestion)}
              >
                Inspiração #{index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seletor de Estilo / Cores */}
      <div className="form-field-group">
        <span className="form-label">
          <Palette size={15} />
          <span>Acabamento do Crachá</span>
        </span>
        <div className="theme-selector-grid">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = card.themeAccent === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-option-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onUpdateThemeAccent(theme.id)}
                aria-pressed={isSelected}
              >
                <span
                  className="theme-swatch"
                  style={{ background: theme.swatchGradient }}
                />
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
