const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: 'ephoto',
    desc: 'Generate 1917-style text image using Ephoto API',
    category: 'ephoto',
    react: '🎨',
    filename: __filename,

    async handler(conn, m, { text }) {
        try {
            if (!text) {
                return m.reply("Example: .ephoto ADEEL");
            }

            // API URL
            const url = `https://api.nekolabs.web.id/ephoto/1917-style-text?text=${encodeURIComponent(text)}`;

            // Fetch binary image
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            const buffer = Buffer.from(res.data);

            // Send final image to user
            await conn.sendMessage(m.chat, {
                image: buffer,
                caption: `EPHOTO IMAGE GENERATED FOR: ${text}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ-ᴀʟɪ-ᴍᴅ`
            }, { quoted: m });

        } catch (err) {
            console.error(err);
            m.reply("Error: Unable to generate Ephoto image.");
        }
    }
});