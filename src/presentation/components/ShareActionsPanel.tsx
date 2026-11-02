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
      {/* Botões lado a lado: Compartilhar no WhatsApp + Baixar PNG */}
      <div className="share-buttons-side-by-side">
        <button
          type="button"
          className="btn-whatsapp-hero"
          onClick={onShareWhatsApp}
          disabled={isGeneratingImage}
        >
          <MessageCircle size={18} />
          <span>
            {isGeneratingImage ? 'Gerando Card...' : 'Compartilhar no WhatsApp'}
          </span>
        </button>

        <button
          type="button"
          className="btn-download-png-full"
          onClick={onDownloadPng}
          disabled={isGeneratingImage}
        >
          <Download size={18} />
          <span>{isGeneratingImage ? 'Gerando PNG...' : 'Baixar Imagem PNG'}</span>
        </button>
      </div>

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
          <span>Página oficial Clube do Livro - Livros e negócios</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </section>
  );
};
