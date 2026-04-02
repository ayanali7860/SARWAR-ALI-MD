const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "terabox",
    alias: ["tera", "tbx"],
    desc: "Download Terabox video",
    category: "download",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Terabox link do\nExample: .terabox https://1024terabox.com/s/xxx")

        const url = q.trim()

        const validDomains = [
            'terabox.com', '1024terabox.com', 'terasharefile.com',
            'teraboxapp.com', 'terabox.app', 'freeterabox.com',
            '4funbox.com', 'mirrorbox.com'
        ]

        const isValid = validDomains.some(d => url.includes(d))
        if (!isValid) return reply("❌ Valid Terabox link do")

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        const res = await axios.get(
            `https://jerrycoder.oggyapi.workers.dev/dterabx?url=${encodeURIComponent(url)}`,
            { timeout: 30000 }
        )

        const data = res.data

        if (!data || data.status !== 'success') {
            return reply("❌ Download failed. Try again.")
        }

        // 👉 FAST ko priority do
        let videoUrl = data.download?.fast || data.download?.normal
        if (!videoUrl) return reply("❌ Video URL not found.")

        const thumb = data.thumbnails?.url2 || data.thumbnails?.url1
        const filename = data.filename || 'video.mp4'
        const sizeMB = data.size ? (data.size / 1024 / 1024).toFixed(2) + ' MB' : ''

        const caption = `🎬 *${filename}*

📦 *Size:* ${sizeMB}

> *⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴅᴇᴇʟ-ᴍᴅ ⚡*`

        // 👉 Thumbnail send
        if (thumb) {
            await conn.sendMessage(from, {
                image: { url: thumb },
                caption: caption
            }, { quoted: mek })
        }

        // 👉 Video send with better options
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            fileName: filename,
            caption: caption
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

    } catch (e) {
        console.log("TERABOX ERROR:", e.message)
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
        reply("❌ Error occurred. Try again.")
    }
})