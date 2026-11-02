# 📚 Card Clube do Livro — Comunidade Livros & Negócios

Gerador interativo de **Passaporte / Card Oficial de Membro** do [Clube do Livro — Livros & Negócios](https://livrosenegocios.com/clubedolivro/), desenvolvido com **React**, **TypeScript**, **Clean Code**, **Clean Architecture**, versionado com **Conventional Commits** e pronto para **GitHub Pages**.

---

## ✨ Funcionalidades

- **Visualização em Tempo Real (Live Preview)**: O crachá estilo ID é atualizado instantaneamente enquanto a pessoa informa:
  - **Foto** (Upload ou Drag-and-Drop com recorte automático centralizado em alta definição)
  - **Nome**
  - **Cidade / Estado**
  - **O que você busca transformar na sua vida através da leitura?**
- **Identidade Visual Oficial**: Utiliza o selo dourado oficial do Clube do Livro (`logo-clube.png`) e a paleta de cores da comunidade (`#290000`, `#5B0000`, `#990000`, `#D4AF37`, `#F3F0EC`).
- **Compartilhamento Inteligente no WhatsApp**:
  - Em dispositivos móveis compatíveis com a **Web Share API (`navigator.share` com arquivos)**, envia **a própria imagem PNG gerada + mensagem formatada + link** diretamente para o WhatsApp.
  - No Desktop (onde navegadores não permitem anexo direto via URL), **baixa automaticamente o PNG em alta resolução (3x)** e abre o WhatsApp Web com o texto formatado e link compartilhável prontos.
- **Link Compartilhável Sem Backend**: Os dados preenchidos são sincronizados via parâmetros de URL (`?nome=...&cidade=...&transformacao=...`), funcionando 100% de forma estática no **GitHub Pages**.

---

## 🏛️ Arquitetura (Clean Architecture)

O código-fonte está organizado em 4 camadas desacopladas, respeitando a **Regra da Dependência** (as dependências apontam sempre para o domínio interno):

```text
src/
├── domain/                   # Regras de negócio puras e Contratos (Ports)
│   ├── entities/
│   │   └── MemberCard.ts     # Entidade imutável, validações e formatação
│   └── ports/                # Interfaces (Inversão de Dependência)
│       ├── CardImageGeneratorPort.ts
│       ├── CardSharePort.ts
│       ├── CardUrlStatePort.ts
│       └── ImageReaderPort.ts
├── application/              # Casos de Uso da Aplicação (Orquestração)
│   └── useCases/
│       ├── DownloadCardImageUseCase.ts
│       ├── ShareCardViaWhatsAppUseCase.ts
│       ├── SyncCardUrlStateUseCase.ts
│       └── UploadCardAvatarUseCase.ts
├── infrastructure/           # Adaptadores concretos (Browser APIs, DOM, Canvas)
│   ├── adapters/
│   │   ├── BrowserCardShareAdapter.ts
│   │   ├── BrowserUrlCardStateAdapter.ts
│   │   ├── CanvasImageReaderAdapter.ts
│   │   └── HtmlToImageCardGeneratorAdapter.ts
│   └── di/
│       └── container.ts      # Injeção de Dependências
└── presentation/             # Interface React (Componentes, Hooks e Estilos)
    ├── components/
    │   ├── BadgeCardPreview.tsx
    │   ├── CardEditorForm.tsx
    │   └── ShareActionsPanel.tsx
    ├── hooks/
    │   └── useMemberCardController.ts
    ├── pages/
    │   └── CardGeneratorPage.tsx
    └── styles/
        └── global.css
```

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção e validar tipagem TypeScript
npm run build
```

---

## 🌐 Deploy no GitHub Pages

O projeto está configurado com `base: './'` no [`vite.config.ts`](./vite.config.ts), garantindo que todos os caminhos de imagens e bundles funcionem em qualquer subdiretório do GitHub Pages (`https://seu-usuario.github.io/card-clube-do-livro/`).

### Opção 1 — Automático via GitHub Actions (Recomendado)
1. Suba o repositório para o GitHub na branch `main`.
2. No GitHub, acesse **Settings → Pages → Build and deployment** e em **Source** selecione **GitHub Actions**.
3. O workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) fará o build e a publicação automaticamente a cada `push`.

### Opção 2 — Manual via CLI (`gh-pages`)
```bash
npm run deploy
```

