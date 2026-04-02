const { cmd } = require('../command');
const axios = require('axios');

// 🌐 .tr Command (English ➜ Urdu Translation)
cmd({
    pattern: "tr",
    desc: "Translate English text to Urdu",
    category: "tools",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    try {
        if (!q) return reply("❗ Please provide some English text to translate into Urdu.");

        // MyMemory API
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=en|ur`;
        const { data } = await axios.get(url);

        const translated = data?.responseData?.translatedText || "⚠️ Translation not found.";

        await reply(
`╭━━━🌐 *SARWAR-MD TRANSLATOR* 🌐━━━╮

🔤 *Original:* 
${q}

💬 *Translated:* 
${translated}

🌎 *Language:* English ➜ Urdu
╰━━━━━━━━━━━━━━━━━━━━━╯`
        );
    } catch (error) {
        console.error(error);
        reply("⚠️ Translation failed! Please try again later.");
    }
});