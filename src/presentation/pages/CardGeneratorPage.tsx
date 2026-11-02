import React, { useRef } from 'react';
import { BadgeCardPreview } from '../components/BadgeCardPreview';
import { CardEditorForm } from '../components/CardEditorForm';
import { ShareActionsPanel } from '../components/ShareActionsPanel';
import { useMemberCardController } from '../hooks/useMemberCardController';

export const CardGeneratorPage: React.FC = () => {
  const {
    card,
    alignedPhotoDataUrl,
    exportableCardRef,
    isGeneratingImage,
    isUploadingAvatar,
    feedback,
    updateFullName,
    updateCityState,
    updateTransformationGoal,
    updateThemeAccent,
    updatePhotoAlignment,
    resetPhotoAlignment,
    handleAvatarFileSelected,
    removeAvatar,
    handleDownloadPng,
    handleShareWhatsApp,
  } = useMemberCardController();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerPhotoSelection = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="app-split-layout">
      {/* Coluna Esquerda Fixa: O Crachá fica sempre centralizado na tela mesmo ao rolar */}
      <aside className="left-preview-column" aria-label="Pré-visualização do Card">
        <div className="preview-sticky-wrapper">
          <div className="live-indicator-badge">
            <span className="live-pulse-dot" />
            <span>PRÉVIA EM TEMPO REAL</span>
          </div>

          <BadgeCardPreview
            card={card}
            alignedPhotoDataUrl={alignedPhotoDataUrl}
            exportRef={exportableCardRef}
            onTriggerPhotoUpload={triggerPhotoSelection}
            onUpdatePhotoAlignment={updatePhotoAlignment}
          />
        </div>
      </aside>

      {/* Coluna Direita: Formulário + Compartilhamento */}
      <main className="right-control-column">
        <div className="control-column-inner">
          {/* Cabeçalho Institucional Clube do Livro */}
          <header className="brand-top-header">
            <a
              href="https://livrosenegocios.com/clubedolivro/"
              target="_blank"
              rel="noopener noreferrer"
              className="brand-logo-link"
            >
              <img
                src="./logo-clube.png"
                alt="Logo Clube do Livro - Livros & Negócios"
                className="brand-header-logo"
              />
              <div className="brand-header-titles">
                <span className="brand-eyebrow">COMUNIDADE LIVROS &amp; NEGÓCIOS</span>
                <h1 className="brand-main-title">Passaporte Clube do Livro</h1>
              </div>
            </a>
          </header>

          {/* Formulário Interativo */}
          <CardEditorForm
            card={card}
            alignedPhotoDataUrl={alignedPhotoDataUrl}
            fileInputRef={fileInputRef}
            isUploadingAvatar={isUploadingAvatar}
            onUpdateFullName={updateFullName}
            onUpdateCityState={updateCityState}
            onUpdateTransformationGoal={updateTransformationGoal}
            onUpdateThemeAccent={updateThemeAccent}
            onUpdatePhotoAlignment={updatePhotoAlignment}
            onResetPhotoAlignment={resetPhotoAlignment}
            onAvatarFileSelected={handleAvatarFileSelected}
            onRemoveAvatar={removeAvatar}
          />

          {/* Painel de Compartilhamento (WhatsApp e Download PNG lado a lado) */}
          <ShareActionsPanel
            isGeneratingImage={isGeneratingImage}
            feedback={feedback}
            onShareWhatsApp={handleShareWhatsApp}
            onDownloadPng={handleDownloadPng}
          />
        </div>
      </main>
    </div>
  );
};
