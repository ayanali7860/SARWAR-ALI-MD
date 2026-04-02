const { cmd } = require('../command');

cmd({
    pattern: "cid",
    alias: ["channelid"],  
    desc: "Get channel ID from WhatsApp channel link",
    react: "📢",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { 
    from, reply
}) => {
    try {
  
        if (!m.text || !m.text.includes('whatsapp.com/channel/')) {
            return reply("⚠️ *Please provide a WhatsApp channel link.*\n\nExample:\n.cid https://whatsapp.com/channel/xxxxxxxxx");
        }

        const match = m.text.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match) {
            return reply("⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx");
        }

        const inviteId = match[1];
       
        let metadata;
        try {
            metadata = await conn.newsletterMetadata("invite", inviteId);
        } catch (e) {
            return reply("❌ Failed to fetch channel metadata. Make sure the link is correct and the channel exists.");
        }

        if (!metadata || !metadata.id) {
            return reply("❌ Channel not found or inaccessible.");
        }

        return reply(`📢 *Channel ID:*\n\`${metadata.id}\``);

    } catch (e) {
        console.error("Channel ID Command Error:", e);
        return reply(`⚠️ Error: ${e.message}`);
    }
});