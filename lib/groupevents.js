// Credits ADEEL - ADEEL-MD 💜
const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const normalizeId = (id) => {
if (!id) return '';
return id
.replace(/:[0-9]+/g, '')
.replace(/@(lid|s.whatsapp.net|c.us|g.us)/g, '')
.replace(/[^\d]/g, '');
};

const getContextInfo = (m, mentions = []) => ({
mentionedJid: mentions.length > 0 ? mentions : [m.sender],
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

const metadata = await conn.groupMetadata(update.id);  
    const participants = update.participants || [];  
    const desc = metadata.desc || "No Description";  
    const groupMembersCount = metadata.participants.length;  

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
        const jid = typeof p === 'string' ? p : (p.phoneNumber || p.id || "unknown@s.whatsapp.net");  
        const userName = jid.split("@")[0];  
        const timestamp = getTime();  

        // Welcome
        if (update.action === "add" && config.WELCOME === "true") {  
            await conn.sendMessage(update.id, {  
                image: { url: ppUrl },  
                caption: `Hey @${userName} 👋\nWelcome 👑.\nMember #${groupMembersCount}.\nTime: *${timestamp}*\n${desc}\n*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME}*.`,  
                mentions: [jid],  
                contextInfo: getContextInfo({ sender: jid }, [jid]),  
            });  
        }  

        // Goodbye
        else if (update.action === "remove" && config.WELCOME === "true") {  
            await conn.sendMessage(update.id, {  
                image: { url: ppUrl },  
                caption: `Goodbye @${userName}. 🙂\nAnother member has left.\nTime: *${timestamp}*\nMembers now: ${groupMembersCount}.`,  
                mentions: [jid],  
                contextInfo: getContextInfo({ sender: jid }, [jid]),  
            });  
        }  

        // Admin demote
        else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {  
            const demoterJid = update.author || jid;  
            const demoterName = demoterJid.split("@")[0];  
            await conn.sendMessage(update.id, {  
                text: `*Admin Event*\n\n@${demoterName} demoted @${userName} 👀\nTime: ${timestamp}`,  
                mentions: [demoterJid, jid],  
                contextInfo: getContextInfo({ sender: demoterJid }, [demoterJid, jid]),  
            });  
        }  

        // Admin promote
        else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {  
            const promoterJid = update.author || jid;  
            const promoterName = promoterJid.split("@")[0];  
            await conn.sendMessage(update.id, {  
                text: `*Admin Event*\n\n@${promoterName} promoted @${userName} 🎉\nTime: ${timestamp}`,  
                mentions: [promoterJid, jid],  
                contextInfo: getContextInfo({ sender: promoterJid }, [promoterJid, jid]),  
            });  
        }  
    }  

} catch (err) {  
    console.error('Group event error:', err);  
}
};

module.exports = GroupEvents;
