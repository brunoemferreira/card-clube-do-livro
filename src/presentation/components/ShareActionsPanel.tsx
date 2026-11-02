import React from 'react';
import { Download, ExternalLink, MessageCircle } from 'lucide-react';
import { FeedbackBanner } from '../hooks/useMemberCardController';

export interface ShareActionsPanelProps {
  readonly isGeneratingImage: boolean;
  readonly feedback: FeedbackBanner | null;
  readonly onShareWhatsApp: () => Promise<void>;
  readonly onDownloadPng: () => Promise<void>;
}

export const ShareActionsPanel: React.FC<ShareActionsPanelProps> = ({
  isGeneratingImage,
  feedback,
  onShareWhatsApp,
  onDownloadPng,
}) => {
  return (
    <section
      className="share-actions-section"
      aria-label="Compartilhar Clube do Livro ID"
    >
      <div className="section-title-group">
        <span className="step-kicker">PASSO 2 • COMPARTILHAMENTO</span>
        <h2 className="section-heading">Compartilhar Credencial Clube do Livro</h2>
        <p className="section-subtitle">
          Gere a imagem completa da sua credencial e compartilhe diretamente no WhatsApp.
        </p>
      </div>

      {/* Botão Principal: Compartilhar Imagem Completa no WhatsApp */}
      <button
        type="button"
        className="btn-whatsapp-hero"
        onClick={onShareWhatsApp}
        disabled={isGeneratingImage}
      >
        <MessageCircle size={20} />
        <span>
          {isGeneratingImage
            ? 'Gerando Imagem Completa do Card...'
            : 'Compartilhar no WhatsApp'}
        </span>
      </button>

      {/* Botão Baixar Imagem PNG em largura total */}
      <button
        type="button"
        className="btn-download-png-full"
        onClick={onDownloadPng}
        disabled={isGeneratingImage}
      >
        <Download size={18} />
        <span>{isGeneratingImage ? 'Gerando PNG...' : 'Baixar Imagem PNG'}</span>
      </button>

      {/* Feedback de Compartilhamento / Download */}
      {feedback && (
        <div className={`feedback-alert feedback-${feedback.type}`} role="status">
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="clube-official-link-row">
        <a
          href="https://livrosenegocios.com/clubedolivro/"
          target="_blank"
          rel="noopener noreferrer"
          className="clube-official-link"
        >
          <img
            src="./logo-clube.png"
            alt=""
            className="mini-footer-seal"
          />
          <span>Conhecer a página oficial do Clube do Livro — Livros &amp; Negócios</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </section>
  );
};
