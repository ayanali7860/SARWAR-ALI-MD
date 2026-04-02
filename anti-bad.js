const { cmd } = require("../command");
const config = require("../config");

// Function to check if user is admin (with LID support)
async function isUserAdmin(conn, chatId, userId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const normalizeId = (id) => {
            if (!id) return '';
            return id
                .replace(/:[0-9]+/g, '')
                .replace(/@(lid|s\.whatsapp\.net|c\.us|g\.us)/g, '')
                .replace(/[^\d]/g, '');
        };

        const normalizedUserId = normalizeId(userId);

        for (let p of participants) {
            const participantIds = [
                p.id,
                p.lid,
                p.phoneNumber,
                p.jid
            ].filter(Boolean);

            for (let pid of participantIds) {
                if (normalizeId(pid) === normalizedUserId) {
                    return p.admin === "admin" || p.admin === "superadmin";
                }
            }
        }

        return false;
    } catch (err) {
        console.error('Error checking admin status:', err);
        return false;
    }
}

// Function to check if bot is admin (with LID support)
async function isBotAdmin(conn, chatId) {
    try {
        const metadata = await conn.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const botId = conn.user?.id || '';
        const botLid = conn.user?.lid || '';

        const normalizeId = (id) => {
            if (!id) return '';
            return id
                .replace(/:[0-9]+/g, '')
                .replace(/@(lid|s\.whatsapp\.net|c\.us|g\.us)/g, '')
                .replace(/[^\d]/g, '');
        };

        const normalizedBotId = normalizeId(botId);
        const normalizedBotLid = normalizeId(botLid);

        for (let p of participants) {
            if (p.admin === "admin" || p.admin === "superadmin") {
                const participantIds = [
                    p.id,
                    p.lid,
                    p.phoneNumber
                ].filter(Boolean);

                for (let pid of participantIds) {
                    const normalizedPid = normalizeId(pid);
                    if (normalizedPid === normalizedBotId || normalizedPid === normalizedBotLid) {
                        return true;
                    }
                }
            }
        }

        return false;
    } catch (err) {
        console.error('Error checking bot admin status:', err);
        return false;
    }
}

cmd({
    on: "body"
}, async (conn, mek, m, {
    from,
    body,
    sender,
    isGroup,
    reply
}) => {
    try {
        // Basic conditions
        if (!isGroup || !body) return;
        if (config.ANTI_BAD !== "true") return;

        const senderIsAdmin = await isUserAdmin(conn, from, sender);
        if (senderIsAdmin) return;

        const botIsAdmin = await isBotAdmin(conn, from);
        if (!botIsAdmin) return;

        // Bad words list
        const badWords = [
            "sexy", "sex", "xxx", "fuck",
            "kiss", "lips", "lun",
            "chutiya", "gando",
            "pakaya", "huththa", "mia"
        ];

        const text = body.toLowerCase();
        const detected = badWords.some(word => text.includes(word));

        if (!detected) return;

        // Delete message
        try {
            await conn.sendMessage(from, { delete: m.key });
        } catch (e) {
            console.error("Failed to delete message:", e);
        }

        // Warning message
        const userNumber = sender.split('@')[0];
        const warnMsg =
            `〔 🚫 BAD WORD DETECTED 〕\n\n` +
            `@${userNumber} Warning! Bad language is not allowed.`;

        try {
            await conn.sendMessage(from, {
                text: warnMsg,
                mentions: [sender]
            });
        } catch (e) {
            console.error("Failed to send warning:", e);
        }

    } catch (err) {
        console.error("ANTI_BAD ERROR:", err);
    }
});