// Credits ADEEL - ADEEL-MD 💜 
const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const normalizeNumber = (id) => {
    if (!id) return '';
    return id.replace(/[^0-9]/g, '');
};

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363425072775595@newsletter',
        newsletterName: 'SARWAR-𝐌𝐃',
        serverMessageId: 143,
    },
});

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const participants = update.participants || [];

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        const getTime = () => {
            return new Date().toLocaleString('en-PK', {
                timeZone: 'Asia/Karachi',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        };

        for (const p of participants) {
            const rawJid = typeof p === 'string' ? p : (p.id || p.phoneNumber);
            const jid = rawJid.includes('@') ? rawJid : rawJid + '@s.whatsapp.net';
            const userNumber = normalizeNumber(rawJid);
            const timestamp = getTime();

            if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoterNumber = normalizeNumber(update.author || rawJid);

                await conn.sendMessage(update.id, {
                    text: `╔═〔 ⚠️ ADMIN DEMOTION 〕═╗
┃
┃ 👀 @${userNumber} is no longer Admin.
┃ 👤 Removed by: @${demoterNumber}
┃ 🕒 Time: ${timestamp}
┃
╚═══════════════════╝`,
                    mentions: [jid, update.author || jid],
                    contextInfo: getContextInfo({ sender: update.author || jid }),
                });
            }

            if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoterNumber = normalizeNumber(update.author || rawJid);

                await conn.sendMessage(update.id, {
                    text: `╔═〔 👑 ADMIN PROMOTION 〕═╗
┃
┃ 🎉 @${userNumber} is now Admin.
┃ 👤 Promoted by: @${promoterNumber}
┃ 🕒 Time: ${timestamp}
┃
╚═══════════════════╝`,
                    mentions: [jid, update.author || jid],
                    contextInfo: getContextInfo({ sender: update.author || jid }),
                });
            }
        }

    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;