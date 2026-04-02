const { cmd } = require('../command')
const fs = require("fs")

const normalizeNumber = (id) => {
    if (!id) return '';
    return id
        .split('@')[0]
        .replace(/[^0-9]/g, '');
};

const loadSudo = () => {
    try {
        return JSON.parse(fs.readFileSync("./lib/sudo.json"));
    } catch {
        return [];
    }
};

const isAuthorized = (sender, isCreator) => {
    if (isCreator) return true;
    const sudo = loadSudo().map(n => normalizeNumber(n));
    const user = normalizeNumber(sender);
    return sudo.includes(user);
};

cmd({
    pattern: "out",
    desc: "Remove members by country code (strict start match)",
    category: "group",
    react: "⚪",
    filename: __filename
}, async (conn, mek, m, { from, args, isGroup, reply, isCreator, sender }) => {
    try {
        if (!isGroup) return;

        const authorized = isAuthorized(sender, isCreator)
        if (!authorized) {
            return reply("Only the bot owner can use this command!")
        }

        const arg = args[0] ? args[0].toString().trim() : null
        if (!arg || !/^\d{1,4}$/.test(arg)) return reply("Example: .out 92")

        const metadata = await conn.groupMetadata(from)
        const participants = metadata.participants || []

        const botNumber = normalizeNumber(conn.user?.id || '')

        const toRemove = participants.filter(p => {
            const allIds = [p.id, p.lid, p.jid, p.phoneNumber].filter(Boolean)
            const numbers = allIds.map(id => normalizeNumber(id)).filter(n => n.length > 0)

            if (numbers.some(n => n === botNumber)) return false
            if (p.admin === 'admin' || p.admin === 'superadmin') return false

            return numbers.some(n => n.startsWith(arg))
        })

        if (toRemove.length === 0) return

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } })

        for (const user of toRemove) {
            const tryIds = [user.jid, user.id, user.lid].filter(Boolean)
            for (const jid of tryIds) {
                try {
                    await conn.groupParticipantsUpdate(from, [jid], "remove")
                    break
                } catch (e) {
                    continue
                }
            }
            await new Promise(r => setTimeout(r, 1000))
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } })

    } catch (e) {
        console.log("OUT ERROR:", e)
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } })
    }
})