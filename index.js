require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const fetch = require('node-fetch');
const twitterGetUrl = require('twitter-url-direct');
const { exec } = require('child_process');

ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log("QR Code gerado. Escaneie com seu WhatsApp.");
});

client.on('ready', () => {
    console.log('✅ Bot está online!');
});

client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.body === '!ping') {
        msg.reply('🏓 Bot está online!');
    }

    if (msg.hasMedia && msg.body === '!fig') {
        const media = await msg.downloadMedia();
        const ext = media.mimetype.split('/')[1];
        const filePath = `temp.${ext}`;
        const outputWebp = 'sticker.webp';

        fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));

        ffmpeg(filePath)
            .outputOptions([
                "-vcodec", "libwebp",
                "-vf", "scale=320:320:force_original_aspect_ratio=decrease,fps=15",
                "-lossless", "1", "-compression_level", "6", "-qscale", "50", "-preset", "default",
                "-loop", "0", "-an", "-vsync", "0"
            ])
            .toFormat("webp")
            .save(outputWebp)
            .on("end", async () => {
                const stickerMedia = MessageMedia.fromFilePath(outputWebp);
                client.sendMessage(msg.from, stickerMedia, { sendMediaAsSticker: true });
                fs.unlinkSync(filePath);
                fs.unlinkSync(outputWebp);
            });
    }

    if (msg.body.startsWith('!twitter')) {
        const url = msg.body.split(' ')[1];
        if (!url) return msg.reply('❌ Envie um link válido do Twitter/X.');

        try {
            const res = await twitterGetUrl(url);
            if (res.download && res.download[0] && res.download[0].url) {
                const mediaUrl = res.download[0].url;
                const response = await fetch(mediaUrl);
                const buffer = await response.buffer();
                const filename = 'twitter_video.mp4';
                fs.writeFileSync(filename, buffer);
                const media = MessageMedia.fromFilePath(filename);
                await client.sendMessage(msg.from, media);
                fs.unlinkSync(filename);
            } else {
                msg.reply('❌ Não foi possível encontrar mídia no link enviado.');
            }
        } catch (err) {
            console.error(err);
            msg.reply('❌ Ocorreu um erro ao processar o link do Twitter.');
        }
    }
});

client.initialize();