// Plugin: copyg.js
// Fixed version: Uses groupGetInviteInfo instead of groupInviteInfo
// Works for new WhatsApp group links

const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "copyg",
    desc: "Copy group name, description and DP from an invite link",
    category: "plugin",
    react: "📎",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, reply }) => {
    try {

        // Private chat only
        if (isGroup) {
            return reply("*This command works only in private chat — sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ*");
        }

        // Require link
        if (!q) return reply("Usage: .copyg https://chat.whatsapp.com/XXXXX");

        // Extract invite code
        const match = q.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
        if (!match) return reply("Invalid group invite link.");
        const inviteCode = match[1];

        // FIXED: New Baileys method
        let info;
        try {
            info = await conn.groupGetInviteInfo(inviteCode);
        } catch (err) {
            return reply("Failed to fetch group info. Try refreshing link.");
        }

        const groupName = info.subject || "No Name";
        const groupDesc = info.desc || "No Description";
        const groupId = info.id;

        // Fetch DP
        let groupDP = null;
        try {
            groupDP = await conn.profilePictureUrl(groupId, 'image');
        } catch {}

        const textMsg = `*𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄:* ${groupName}\n\n*𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐓𝐈𝐎𝐍:* ${groupDesc}`;

        if (groupDP) {
            const res = await axios.get(groupDP, { responseType: "arraybuffer" });
            const imgBuffer = Buffer.from(res.data, "binary");

            return await conn.sendMessage(from, {
                image: imgBuffer,
                caption: textMsg
            }, { quoted: m });
        }

        await conn.sendMessage(from, { text: textMsg }, { quoted: m });

    } catch (error) {
        console.log(error);
        reply("*Error occurred — sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ*");
    }
});