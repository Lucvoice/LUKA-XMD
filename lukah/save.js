const { gmd } = require("../luka");
const {
    downloadContentFromMessage,
    normalizeMessageContent
} = require("gifted-baileys");

const streamToBuffer = async (stream) => {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(chunk);
    }

    return Buffer.concat(chunks);
};

gmd({
    pattern: "save",
    aliases: [
        "statussave",
        "savestatus",
        "sv",
        "keep"
    ],
    category: "media",
    react: "💾",
    description: "Save WhatsApp Status media"
}, async (conText) => {

    const {
        reply,
        msg,
        client,
        chat,
        botName = "LUKA-XMD",
        botFooter = "LUKA-XMD"
    } = conText;

    try {
        const quoted = msg?.quoted;

        if (!quoted) {
            return reply(
`╭━━━〔 *${botName}* 〕━━━╮
│
│ 💾 *STATUS SAVER*
│
│ Reply to any WhatsApp
│ Status and send:
│
│     *.save*
│
│ Supports:
│ • 🖼️ Images
│ • 🎥 Videos
│ • 🎵 Audio
│ • 📄 Documents
│ • 🎭 Stickers
│ • 🎞️ GIFs
│
╰━━━━━━━━━━━━━━━━━━━━╯
> ${botFooter}`
            );
        }

        const message = normalizeMessageContent(
            quoted.message || quoted.msg || quoted
        );

        if (!message) {
            return reply("❌ Unable to detect the Status media.");
        }

        let mediaType = null;
        let media = null;

        if (message.imageMessage) {
            mediaType = "image";
            media = message.imageMessage;
        } else if (message.videoMessage) {
            mediaType = "video";
            media = message.videoMessage;
        } else if (message.audioMessage) {
            mediaType = "audio";
            media = message.audioMessage;
        } else if (message.documentMessage) {
            mediaType = "document";
            media = message.documentMessage;
        } else if (message.stickerMessage) {
            mediaType = "sticker";
            media = message.stickerMessage;
        }

        if (!media || !mediaType) {
            return reply(
`╭━━━〔 *${botName}* 〕━━━╮
│ ❌ *Unsupported Media*
│
│ I couldn't detect a
│ supported Status media.
╰━━━━━━━━━━━━━━━━━━━━╯`
            );
        }

        await reply("⏳ Saving Status media...");

        const stream = await downloadContentFromMessage(
            media,
            mediaType
        );

        const buffer = await streamToBuffer(stream);

        if (!buffer || !buffer.length) {
            return reply("❌ Failed to download the Status media.");
        }

        const caption =
`╭━━━〔 *${botName}* 〕━━━╮
│
│ 💾 *STATUS SAVED*
│
│ ✅ Successfully saved
│
╰━━━━━━━━━━━━━━━━━━━━╯
> ${botFooter}`;

        const target = chat || msg?.chat;

        if (!client || !target) {
            return reply(
                "❌ WhatsApp client or chat information is unavailable."
            );
        }

        if (mediaType === "image") {
            return await client.sendMessage(
                target,
                {
                    image: buffer,
                    caption
                },
                {
                    quoted: msg
                }
            );
        }

        if (mediaType === "video") {
            return await client.sendMessage(
                target,
                {
                    video: buffer,
                    caption
                },
                {
                    quoted: msg
                }
            );
        }

        if (mediaType === "audio") {
            return await client.sendMessage(
                target,
                {
                    audio: buffer,
                    mimetype: media.mimetype || "audio/mpeg",
                    ptt: false
                },
                {
                    quoted: msg
                }
            );
        }

        if (mediaType === "document") {
            return await client.sendMessage(
                target,
                {
                    document: buffer,
                    mimetype:
                        media.mimetype ||
                        "application/octet-stream",
                    fileName:
                        media.fileName ||
                        "LUKA-XMD-Status"
                },
                {
                    quoted: msg
                }
            );
        }

        if (mediaType === "sticker") {
            return await client.sendMessage(
                target,
                {
                    sticker: buffer
                },
                {
                    quoted: msg
                }
            );
        }

    } catch (error) {

        console.error("SAVE STATUS ERROR:", error);

        return reply(
`╭━━━〔 *LUKA-XMD* 〕━━━╮
│
│ ❌ *SAVE FAILED*
│
│ Something went wrong
│ while saving the Status.
│
│ Please try again.
│
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }
});
