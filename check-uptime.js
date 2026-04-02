const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

function getPakistanTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + 5 * 60 * 60000);
}

let lastUsedDesignIndex = 0;

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, sender }) => {
    try {
        const uptime = runtime(process.uptime());
        const pakistanTime = getPakistanTime();
        const date = pakistanTime.toLocaleDateString('en-GB');
        const time = pakistanTime.toLocaleTimeString('en-US', { hour12: true });

        const design1 = `*╔══════════════════╗*
*║  👑  sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ  👑  ║*
*╠══════════════════╣*
*║     ⏱️ UPTIME       ║*
*║  ✦ ${uptime} ✦   ║*
*║     📅 DATE         ║*
*║  ✦ ${date} ✦    ║*
*║     ⏰ TIME         ║*
*║  ✦ ${time} ✦      ║*
*║     ⚡ STATUS       ║*
*║     ✦ 🟢 ONLINE    ║*
*╚══════════════════╝*`;

        const design2 = `*╔══════ sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ ══════╗*
*║  ⏱️ UPTIME: ${uptime}  ║*
*║  📅 DATE: ${date}  ║*
*║  ⏰ TIME: ${time}     ║*
*║  ⚡ STATUS: 🟢 ONLINE  ║*
*╚═══════════════════╝*`;

        const styles = [design1, design2];

        const selectedStyle = styles[lastUsedDesignIndex];
        lastUsedDesignIndex = (lastUsedDesignIndex + 1) % styles.length;

        const imageUrl = 'https://files.catbox.moe/zc57w6.jpg';

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363425072775595@newsletter',
                    newsletterName: 'sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});