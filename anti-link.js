const { cmd } = require('../command');
const config = require('../config');

const normalizeId = (id) => {
if (!id) return '';
return id
.replace(/:[0-9]+/g, '')
.replace(/@(lid|s.whatsapp.net|c.us|g.us)/g, '')
.replace(/[^\d]/g, '');
};

async function isUserAdmin(conn, chatId, userId) {
const metadata = await conn.groupMetadata(chatId);
const participants = metadata.participants || [];
const user = normalizeId(userId);

return participants.some(p => {  
    const ids = [p.id, p.lid, p.jid, p.phoneNumber].filter(Boolean);  
    return ids.some(id => normalizeId(id) === user) &&  
        (p.admin === "admin" || p.admin === "superadmin");  
});

}

async function isBotAdmin(conn, chatId) {
const metadata = await conn.groupMetadata(chatId);
const participants = metadata.participants || [];

const botId = normalizeId(conn.user?.id || '');  
const botLid = normalizeId(conn.user?.lid || '');  

return participants.some(p => {  
    if (!(p.admin === "admin" || p.admin === "superadmin")) return false;  

    const ids = [p.id, p.lid, p.phoneNumber].filter(Boolean);  
    return ids.some(id => {  
        const n = normalizeId(id);  
        return n === botId || n === botLid;  
    });  
});

}

cmd({
on: "body"
}, async (conn, m, store, {
from,
body,
sender,
isGroup
}) => {

try {  

    if (!isGroup) return;  
    if (!body) return;  
    if (!config.ANTI_LINK || config.ANTI_LINK === 'false') return;  

    const senderIsAdmin = await isUserAdmin(conn, from, sender);  
    if (senderIsAdmin) return;  

    const botIsAdmin = await isBotAdmin(conn, from);  
    if (!botIsAdmin) return;  

    const text = body  
        .replace(/[\s\u200b-\u200d\uFEFF]/g, '')  
        .toLowerCase();  

    const linkRegex = /(https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|whatsapp\.com\/channel\/)[^\s]+/gi;  

    if (!linkRegex.test(text)) return;  

    const deleteEnabled =  
        config.DELETE_LINKS === true ||  
        config.DELETE_LINKS === 'true';  

    const kickEnabled =  
        config.ANTI_LINK_KICK === true ||  
        config.ANTI_LINK_KICK === 'true';  

    if (deleteEnabled || kickEnabled) {  
        try {  
            await conn.sendMessage(from, { delete: m.key });  
        } catch (e) {  
            console.log("Delete error:", e);  
        }  
    }  

    if (kickEnabled) {  
        try {  
            await conn.groupParticipantsUpdate(  
                from,  
                [sender],  
                "remove"  
            );  

            const senderNumber = sender.split('@')[0];  
            const kickMessage = `⚠️ Member @${senderNumber} has been removed for sending a link.`;  
            await conn.sendMessage(from, {   
                text: kickMessage,   
                mentions: [sender]   
            });  

        } catch (e) {  
            console.log("Kick error:", e);  
        }  
    }  

} catch (err) {  
    console.error("Anti-link error:", err);  
}

});