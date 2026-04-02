const axios = require("axios");
const FormData = require('form-data');
const { cmd } = require("../command");

async function uploadToCatbox(buffer, filename) {
    try {
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", buffer, { filename });

        const res = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders(),
            timeout: 30000
        });

        if (!res.data || !res.data.startsWith("http")) {
            throw new Error("Catbox upload failed");
        }

        return res.data;
    } catch (err) {
        throw new Error("Upload failed: " + err.message);
    }
}

cmd({
    pattern: "rmbg",
    alias: ["removebg"],
    react: '📸',
    desc: "Remove background from images automatically",
    category: "editing",
    use: ".rmbg [reply to image]",
    filename: __filename
}, async (conn, message, m, { reply }) => {
    try {
        const quoted = message.quoted || message;
        const mime = quoted.mimetype || quoted.msg?.mimetype || "";

        if (!mime.startsWith("image/")) {
            return reply("❌ Please reply to an image (JPG/PNG)");
        }

        await conn.sendMessage(m.chat, { react: { text: "🔄", key: message.key } });

        const buffer = await quoted.download();
        if (!buffer) throw new Error("Failed to download image");

        const ext = mime.includes("png") ? ".png" : ".jpg";
        const filename = `rmbg_${Date.now()}${ext}`;

        const imageUrl = await uploadToCatbox(buffer, filename);

        const formData = new FormData();
        formData.append("size", "auto");
        formData.append("image_url", imageUrl);

        const removeRes = await axios.post(
            "https://api.remove.bg/v1.0/removebg",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "X-Api-Key": "Cn6itDTyW69HB9z9jHpSb27h"
                },
                responseType: "arraybuffer",
                timeout: 60000
            }
        );

        await conn.sendMessage(m.chat, { react: { text: "✅", key: message.key } });
        await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(removeRes.data),
                caption: "*ʙᴀᴄᴋɢʀᴏᴜɴᴅ ʀᴇᴍᴏᴠᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ*\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ SARWAR-ᴍᴅ*"
            },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: message.key } });
        reply("❌ Failed to remove background. Try again later.");
    }
});