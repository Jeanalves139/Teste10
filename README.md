# WhatsApp Bot - Stickers & Twitter Downloader

Este bot de WhatsApp foi desenvolvido usando a biblioteca `whatsapp-web.js`. Ele possui duas funcionalidades principais:

1. Criar figurinhas (stickers) a partir de fotos, vídeos ou GIFs enviados no WhatsApp.
2. Baixar vídeos e imagens de links do Twitter (X).

## Como instalar

```bash
git clone <repo-url>
cd whatsapp-bot-sticker-twitter
npm install
node index.js
```

Escaneie o QR code com o WhatsApp para iniciar.

## Comandos

- `!fig`: Gera uma figurinha a partir de imagem, vídeo ou GIF enviado.
- `!twitter <url>`: Baixa o vídeo ou imagem de uma postagem do Twitter/X.
- `!ping`: Testa se o bot está online.