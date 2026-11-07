import React from 'react';
import {
  ArrowLeftRight,
  ArrowUpDown,
  BookOpen,
  Camera,
  Check,
  IdCard,
  Library,
  MapPin,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  User,
  ZoomIn,
} from 'lucide-react';
import {
  CardModelType,
  CardThemeAccent,
  MemberCard,
  PhotoAlignment,
} from '@domain/entities/MemberCard';

export interface CardEditorFormProps {
  readonly card: MemberCard;
  readonly alignedPhotoDataUrl: string | null;
  readonly fileInputRef: React.RefObject<HTMLInputElement | null>;
  readonly isUploadingAvatar: boolean;
  readonly onUpdateModel: (value: CardModelType) => void;
  readonly onUpdateFullName: (value: string) => void;
  readonly onUpdateCity: (value: string) => void;
  readonly onUpdateState: (value: string) => void;
  readonly onUpdateTransformationGoal: (value: string) => void;
  readonly onUpdateThemeAccent: (value: CardThemeAccent) => void;
  readonly onUpdatePhotoAlignment: (partial: Partial<PhotoAlignment>) => void;
  readonly onResetPhotoAlignment: () => void;
  readonly onAvatarFileSelected: (file: File | null) => void;
  readonly onRemoveAvatar: () => void;
}

const BRAZILIAN_UFS: readonly string[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const TRANSFORMATION_SUGGESTIONS: readonly string[] = [
  'Desenvolver inteligência emocional, liderança e transformar leitura em resultados reais nos negócios.',
  'Criar o hábito diário da leitura para expandir minha visão estratégica e conquistar liberdade financeira.',
  'Conectar com mentes empreendedoras e aplicar cada livro na evolução da minha carreira e vida pessoal.',
];

const THEME_OPTIONS: ReadonlyArray<{
  readonly id: CardThemeAccent;
  readonly label: string;
  readonly primaryColor: string;
  readonly secondaryColor: string;
  readonly activeBorderColor: string;
}> = [
  {
    id: 'triade-do-tempo',
    label: 'Tríade do Tempo',
    primaryColor: '#F97316',
    secondaryColor: '#FFFFFF',
    activeBorderColor: '#F97316',
  },
  {
    id: 'mais-esperto-que-o-diabo',
    label: 'Mais Esperto que o Diabo',
    primaryColor: '#DC2626',
    secondaryColor: '#FACC15',
    activeBorderColor: '#EF4444',
  },
  {
    id: 'a-montanha',
    label: 'A Montanha',
    primaryColor: '#121214',
    secondaryColor: '#EAB308',
    activeBorderColor: '#EAB308',
  },
  {
    id: 'habitos-atomicos',
    label: 'Hábitos Atômicos',
    primaryColor: '#F5EFE6',
    secondaryColor: '#A66E24',
    activeBorderColor: '#C88A36',
  },
];

export const CardEditorForm: React.FC<CardEditorFormProps> = ({
  card,
  alignedPhotoDataUrl,
  fileInputRef,
  isUploadingAvatar,
  onUpdateModel,
  onUpdateFullName,
  onUpdateCity,
  onUpdateState,
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
        <span className="step-kicker">PERSONALIZAÇÃO AO VIVO</span>
        <h2 className="section-heading">Preencha seus dados de Membro</h2>
        <p className="section-subtitle">
          Escolha o modelo, selecione o livro e veja sua credencial pronta para o WhatsApp.
        </p>
      </div>

      {/* 0. Seletor de Modelo: Crachá Credencial vs Cartão de Biblioteca */}
      <div className="form-field-group">
        <span className="form-label">
          <IdCard size={15} />
          <span>Escolha o Modelo da sua Credencial</span>
        </span>
        <div className="model-selector-grid" role="radiogroup" aria-label="Modelo da credencial">
          <button
            type="button"
            className={`model-option-btn ${card.model === 'badge' ? 'active' : ''}`}
            onClick={() => onUpdateModel('badge')}
            aria-pressed={card.model === 'badge'}
          >
            <span className="model-option-icon">
              <IdCard size={17} />
            </span>
            <span className="model-option-texts">
              <strong className="model-option-title">Crachá Credencial</strong>
              <span className="model-option-desc">Com fita e foto central</span>
            </span>
            {card.model === 'badge' && (
              <Check size={14} strokeWidth={3} className="model-active-check" />
            )}
          </button>

          <button
            type="button"
            className={`model-option-btn ${card.model === 'library-card' ? 'active' : ''}`}
            onClick={() => onUpdateModel('library-card')}
            aria-pressed={card.model === 'library-card'}
          >
            <span className="model-option-icon">
              <Library size={17} />
            </span>
            <span className="model-option-texts">
              <strong className="model-option-title">Cartão de Biblioteca</strong>
              <span className="model-option-desc">Ficha catalográfica literária</span>
            </span>
            {card.model === 'library-card' && (
              <Check size={14} strokeWidth={3} className="model-active-check" />
            )}
          </button>
        </div>
      </div>

      {/* 1. Seletor de Tema por Livro do Clube (Acima da Foto do Perfil) */}
      <div className="form-field-group">
        <span className="form-label">
          <BookOpen size={15} />
          <span>
            {card.model === 'library-card'
              ? 'Tema do Cartão de Biblioteca (Livro do Clube)'
              : 'Tema do Crachá (Livro do Clube)'}
          </span>
        </span>
        <div className="theme-selector-grid">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = card.themeAccent === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-option-btn theme-btn-${theme.id} ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() => onUpdateThemeAccent(theme.id)}
                aria-pressed={isSelected}
                style={
                  isSelected
                    ? { borderColor: theme.activeBorderColor }
                    : undefined
                }
              >
                <span
                  className="theme-swatch-split"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor} 52%, ${theme.secondaryColor} 52%, ${theme.secondaryColor} 100%)`,
                  }}
                >
                  {isSelected && <Check size={11} strokeWidth={3} className="swatch-check-icon" />}
                </span>
                <span className="theme-option-label">{theme.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Upload e Alinhamento de Foto do Perfil */}
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
                  Ajustar enquadramento (ou arraste a foto na prévia)
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

      {/* 3. Nome, Cidade e Estado Separados */}
      <div className="form-row-three-cols">
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
          <label className="form-label" htmlFor="member-city-input">
            <MapPin size={15} />
            <span>Cidade</span>
          </label>
          <input
            id="member-city-input"
            type="text"
            className="form-text-input"
            placeholder="Ex.: São Paulo"
            maxLength={32}
            value={card.city}
            onChange={(e) => onUpdateCity(e.target.value)}
          />
        </div>

        <div className="form-field-group">
          <label className="form-label" htmlFor="member-state-input">
            <MapPin size={15} />
            <span>Estado</span>
          </label>
          <input
            id="member-state-input"
            type="text"
            list="brazilian-uf-datalist"
            className="form-text-input"
            placeholder="Ex.: SP"
            maxLength={20}
            value={card.state}
            onChange={(e) => onUpdateState(e.target.value)}
          />
          <datalist id="brazilian-uf-datalist">
            {BRAZILIAN_UFS.map((uf) => (
              <option key={uf} value={uf} />
            ))}
          </datalist>
        </div>
      </div>

      {/* 4. Pergunta de Transformação */}
      <div className="form-field-group">
        <div className="form-label-with-counter">
          <label className="form-label" htmlFor="member-goal-textarea">
            <Sparkles size={15} />
            <span>{card.getTransformationPromptQuestion()}</span>
          </label>
          <span className="char-counter">
            {card.readingTransformationGoal.length}/180
          </span>
        </div>

        <textarea
          id="member-goal-textarea"
          className="form-textarea-input"
          rows={2}
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
    </section>
  );
};
