const { cmd } = require('../command');

// Reusable function to get JID
const getJid = (m, q) => {
    if (m.quoted) return m.quoted.sender; // Reply se
    if (m.mentionedJid && m.mentionedJid[0]) return m.mentionedJid[0]; // Mention se
    if (q && q.includes('@')) return q.replace(/[@\s]/g, '') + "@s.whatsapp.net"; // Number se
    if (!m.isGroup) return m.chat; // Personal Chat (DM) mein direct
    return null;
};

// --- BLOCK COMMAND ---
cmd({
    pattern: "block",
    desc: "Blocks a user",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, isCreator }) => {
    if (!isCreator) return reply("❌ Only Owner can use this.");

    const jid = getJid(m, q);
    if (!jid) return reply("Tag someone or use in DM.");

    try {
        await conn.updateBlockStatus(jid, "block");
        reply(`✅ Blocked successfully.`);
    } catch (e) {
        reply("❌ Error blocking user.");
    }
});

// --- UNBLOCK COMMAND ---
cmd({
    pattern: "unblock",
    desc: "Unblocks a user",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, q, isCreator }) => {
    if (!isCreator) return reply("❌ Only Owner can use this.");

    const jid = getJid(m, q);
    if (!jid) return reply("Tag someone or use in DM.");

    try {
        await conn.updateBlockStatus(jid, "unblock");
        reply(`✅ Unblocked successfully.`);
    } catch (e) {
        reply("❌ Error unblocking user.");
    }
});
