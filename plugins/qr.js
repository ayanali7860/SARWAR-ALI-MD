const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "qr",
    alias: ["getqr", "botqr"],
    react: "🔰",
    desc: "Fetch and send QR code from ADEEL-MD bot",
    category: "download",
    use: ".qr",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const url = "https://adeel-md-pair-1-0726379855c3.herokuapp.com/server";

        const res = await axios.get(url, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(res.data, "binary");

        await conn.sendMessage(from, {
            image: imageBuffer,
            caption: `🔰 *SARWAR-MD QR CODE*\n\n> *𝚂𝙲𝙰𝙽 𝚃𝚑𝚒𝚜 𝚚𝚛 𝙲𝚘𝚍𝚎 𝚃𝙾 𝙲𝚘𝚗𝚗𝚎𝚌𝚝*\n> *𝚚𝚛 𝚎𝚡𝚙𝚒𝚛𝚎𝚜 𝚒𝚗 30 𝚜𝚎𝚌𝚘𝚗𝚍𝚜*\n\n> *⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ-ᴀʟɪ-ᴍᴅ⚡*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (err) {
        console.error("QR error:", err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("❌ Failed to load QR code. Please try again.");
    }
});