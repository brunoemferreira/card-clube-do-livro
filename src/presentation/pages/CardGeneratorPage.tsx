import React, { useRef } from 'react';
import { BadgeCardPreview } from '../components/BadgeCardPreview';
import { CardEditorForm } from '../components/CardEditorForm';
import { ShareActionsPanel } from '../components/ShareActionsPanel';
import { useMemberCardController } from '../hooks/useMemberCardController';

export const CardGeneratorPage: React.FC = () => {
  const {
    card,
    exportableCardRef,
    isGeneratingImage,
    isUploadingAvatar,
    feedback,
    copiedTarget,
    shareableUrl,
    embedCode,
    whatsappMessagePreview,
    updateFullName,
    updateCityState,
    updateTransformationGoal,
    updateThemeAccent,
    handleAvatarFileSelected,
    removeAvatar,
    handleDownloadPng,
    handleShareWhatsApp,
    handleCopyLink,
    handleCopyEmbedOrText,
  } = useMemberCardController();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerPhotoSelection = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="app-split-layout">
      {/* Coluna Esquerda: Visualização em Tempo Real do Crachá (ID Card) */}
      <aside className="left-preview-column" aria-label="Pré-visualização do Card">
        <div className="preview-sticky-wrapper">
          <div className="live-indicator-badge">
            <span className="live-pulse-dot" />
            <span>PRÉVIA EM TEMPO REAL</span>
          </div>

          <BadgeCardPreview
            card={card}
            exportRef={exportableCardRef}
            onTriggerPhotoUpload={triggerPhotoSelection}
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
            fileInputRef={fileInputRef}
            isUploadingAvatar={isUploadingAvatar}
            onUpdateFullName={updateFullName}
            onUpdateCityState={updateCityState}
            onUpdateTransformationGoal={updateTransformationGoal}
            onUpdateThemeAccent={updateThemeAccent}
            onAvatarFileSelected={handleAvatarFileSelected}
            onRemoveAvatar={removeAvatar}
          />

          <hr className="section-divider" />

          {/* Painel de Compartilhamento (WhatsApp, PNG, Link, Embed) */}
          <ShareActionsPanel
            isGeneratingImage={isGeneratingImage}
            feedback={feedback}
            copiedTarget={copiedTarget}
            shareableUrl={shareableUrl}
            embedCode={embedCode}
            whatsappMessagePreview={whatsappMessagePreview}
            onShareWhatsApp={handleShareWhatsApp}
            onDownloadPng={handleDownloadPng}
            onCopyLink={handleCopyLink}
            onCopyEmbedOrText={handleCopyEmbedOrText}
          />
        </div>
      </main>
    </div>
  );
};
