const { cmd } = require("../command");
const axios = require("axios");
const yts = require("yt-search");

const commands = ["mp3url", "ytmp3", "audio"];

commands.forEach(command => {
    cmd({
        pattern: command,
        desc: "Download YouTube audio as MP3",
        category: "downloader",
        react: "🎵",
        filename: __filename
    }, async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return reply("❌ Please provide a YouTube link.\nExample: .ytmp3 https://youtube.com/watch?v=xxx")

            if (!q.startsWith("http")) return reply("❌ Please provide a valid YouTube link.\nExample: .ytmp3 https://youtube.com/watch?v=xxx")

            let cleanUrl = q.split("&")[0]
            cleanUrl = cleanUrl.replace("https://youtu.be/", "https://www.youtube.com/watch?v=")

            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

            const videoId = cleanUrl.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1]

            const [apiRes, search] = await Promise.all([
                axios.get(
                    `https://jawad-tech.vercel.app/download/ytdl?url=${encodeURIComponent(cleanUrl)}`,
                    { timeout: 30000 }
                ),
                yts(cleanUrl).catch(() => null)
            ])

            const result = apiRes.data?.result
            if (!result || !result.mp3) {
                await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
                return reply("❌ Audio fetch failed. Please try again.")
            }

            const vid = search?.videos?.[0] || null
            const views = vid?.views ? vid.views.toLocaleString() : 'N/A'
            const channel = vid?.author?.name || 'N/A'
            const duration = vid?.timestamp || 'N/A'
            const thumbnail = vid?.thumbnail ||
                (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null)

            const caption = `🎶 *${result.title}*

👤 *Channel:* ${channel}
⏳ *Duration:* ${duration}
👁 *Views:* ${views}

> *⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ ⚡*`

            if (thumbnail) {
                await conn.sendMessage(from, {
                    image: { url: thumbnail },
                    caption: caption
                }, { quoted: mek })
            }

            await conn.sendMessage(from, {
                audio: { url: result.mp3 },
                mimetype: "audio/mpeg",
                fileName: `${result.title}.mp3`
            }, { quoted: mek })

            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

        } catch (e) {
            console.error(`${command} error:`, e)
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
            reply("❌ An error occurred. Please try again.")
        }
    });
});