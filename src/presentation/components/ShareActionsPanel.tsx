import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Link2,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { FeedbackBanner } from '../hooks/useMemberCardController';

export interface ShareActionsPanelProps {
  readonly isGeneratingImage: boolean;
  readonly feedback: FeedbackBanner | null;
  readonly copiedTarget: 'link' | 'embed' | 'whatsapp-text' | null;
  readonly shareableUrl: string;
  readonly embedCode: string;
  readonly whatsappMessagePreview: string;
  readonly onShareWhatsApp: () => Promise<void>;
  readonly onDownloadPng: () => Promise<void>;
  readonly onCopyLink: () => Promise<void>;
  readonly onCopyEmbedOrText: (
    text: string,
    target: 'embed' | 'whatsapp-text',
  ) => Promise<void>;
}

export const ShareActionsPanel: React.FC<ShareActionsPanelProps> = ({
  isGeneratingImage,
  feedback,
  copiedTarget,
  shareableUrl,
  embedCode,
  whatsappMessagePreview,
  onShareWhatsApp,
  onDownloadPng,
  onCopyLink,
  onCopyEmbedOrText,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'whatsapp-text' | 'embed'>(
    'whatsapp-text',
  );

  const displayedCodeContent =
    activeCodeTab === 'whatsapp-text' ? whatsappMessagePreview : embedCode;

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareableUrl,
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = `Embarquei no Clube do Livro — Comunidade Livros & Negócios! 📚✨ Veja meu Card Oficial:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(shareableUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareableUrl,
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      className="share-actions-section"
      aria-label="Compartilhar Clube do Livro ID"
    >
      <div className="section-title-group">
        <span className="step-kicker">PASSO 2 • COMPARTILHAMENTO</span>
        <h2 className="section-heading">Compartilhar Clube do Livro ID</h2>
        <p className="section-subtitle">
          Mostre para a sua rede e para o grupo do Clube do Livro que você embarcou nessa jornada.
        </p>
      </div>

      {/* Botão Principal Destacado de WhatsApp */}
      <button
        type="button"
        className="btn-whatsapp-hero"
        onClick={onShareWhatsApp}
        disabled={isGeneratingImage}
      >
        <MessageCircle size={20} />
        <span>
          {isGeneratingImage
            ? 'Gerando seu Card em Alta Definição...'
            : 'Compartilhar Card no WhatsApp'}
        </span>
      </button>

      {/* Grade de Redes Sociais (Inspirado na imagem de referência) */}
      <div className="social-tiles-grid">
        <button
          type="button"
          className="social-tile-btn tile-whatsapp"
          onClick={onShareWhatsApp}
          disabled={isGeneratingImage}
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          className="social-tile-btn"
          onClick={handleShareLinkedIn}
        >
          <Share2 size={18} />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          className="social-tile-btn"
          onClick={handleShareTwitter}
        >
          <ExternalLink size={18} />
          <span>X (Twitter)</span>
        </button>

        <button
          type="button"
          className="social-tile-btn"
          onClick={handleShareFacebook}
        >
          <Share2 size={18} />
          <span>Facebook</span>
        </button>
      </div>

      {/* Dupla de Ações: Baixar PNG + Copiar Link (Exatamente como no layout de referência) */}
      <div className="primary-actions-row">
        <button
          type="button"
          className="btn-download-png"
          onClick={onDownloadPng}
          disabled={isGeneratingImage}
        >
          <Download size={17} />
          <span>{isGeneratingImage ? 'Gerando PNG...' : 'Baixar PNG'}</span>
        </button>

        <button
          type="button"
          className="btn-copy-link"
          onClick={onCopyLink}
        >
          {copiedTarget === 'link' ? <Check size={17} /> : <Link2 size={17} />}
          <span>{copiedTarget === 'link' ? 'Link Copiado!' : 'Copiar link'}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`feedback-alert feedback-${feedback.type}`} role="status">
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Caixa de Mensagem WhatsApp / Embed Code (como no destaque da referência) */}
      <div className="embed-box-container">
        <div className="embed-box-header">
          <div className="embed-tabs">
            <button
              type="button"
              className={`embed-tab-btn ${activeCodeTab === 'whatsapp-text' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('whatsapp-text')}
            >
              <MessageCircle size={13} />
              <span>Mensagem WhatsApp</span>
            </button>
            <button
              type="button"
              className={`embed-tab-btn ${activeCodeTab === 'embed' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('embed')}
            >
              <Code2 size={13} />
              <span>Embed code</span>
            </button>
          </div>
        </div>

        <div className="embed-code-block">
          <pre className="embed-code-pre">{displayedCodeContent}</pre>
          <button
            type="button"
            className="btn-copy-code-icon"
            onClick={() => onCopyEmbedOrText(displayedCodeContent, activeCodeTab)}
            title="Copiar conteúdo"
            aria-label="Copiar conteúdo"
          >
            {copiedTarget === activeCodeTab ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

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
      </div>
    </section>
  );
};
