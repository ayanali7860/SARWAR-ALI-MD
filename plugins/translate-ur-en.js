const { cmd } = require('../command');
const axios = require('axios');

// 🌐 .utr Command (Urdu ➜ English Translation)
cmd({
    pattern: "utr",
    desc: "Translate Urdu text to English",
    category: "tools",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    try {
        if (!q) return reply("❗ Please provide some Urdu text to translate into English.");

        // MyMemory API
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=ur|en`;
        const { data } = await axios.get(url);

        const translated = data?.responseData?.translatedText || "⚠️ Translation not found.";

        await reply(
`╭━━━🌐 *SARWAR-MD TRANSLATOR* 🌐━━━╮

🔤 *Original:* 
${q}

💬 *Translated:* 
${translated}

🌎 *Language:* Urdu ➜ English
╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
    } catch (error) {
        console.error(error);
        reply("⚠️ Translation failed! Please try again later.");
    }
});