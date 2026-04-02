const { cmd } = require('../command');
const { getBuffer, fetchJson, sleep } = require('../lib/functions');

cmd({
    pattern: "person",
    alias: ["userinfo", "profile"],
    react: "👤",
    desc: "Get complete user profile information",
    category: "utility",
    use: ".person [@tag, reply, or number]",
    filename: __filename
}, async (conn, mek, m, { from, sender, args, isGroup, reply, quoted, participants }) => {
    try {
        // 1. IDENTIFY TARGET USER
        let userJid;
        if (quoted) {
            userJid = quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            userJid = m.mentionedJid[0];
        } else if (args[0]) {
            let rawNumber = args[0].replace(/[^0-9]/g, '');
            if (rawNumber.length >= 10) {
                userJid = `${rawNumber}@s.whatsapp.net`;
            } else {
                userJid = sender;
            }
        } else {
            userJid = sender;
        }

        // 2. FETCH PROFILE PICTURE
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(userJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // 3. ENHANCED NAME FETCHING (PRIORITIZING PUSHNAME)
        let userName = "";
        try {
            // Priority 1: Check if the name is in the internal store/contacts
            const contact = conn.contacts ? conn.contacts[userJid] : null;
            userName = contact?.notify || contact?.name || contact?.verifiedName;

            // Priority 2: Use getName (Fetches pushname if available)
            if (!userName || userName.includes('@')) {
                userName = await conn.getName(userJid);
            }

            // Priority 3: Check group metadata for the specific user
            if ((!userName || userName.includes('@')) && isGroup) {
                const p = participants.find(v => v.id === userJid);
                userName = p?.notify || p?.name || p?.verifiedName;
            }
        } catch (e) {
            userName = userJid.split('@')[0];
        }

        // Final cleanup for Name
        if (!userName || userName === userJid.split('@')[0]) userName = "User Not Found";

        // 4. FETCH ABOUT/BIO (MODIFIED)
        let bioText = "No bio available";
        try {
            const statusObj = await conn.fetchStatus(userJid);
            if (statusObj && statusObj.status) {
                bioText = statusObj.status;
            }
        } catch {
            // Fallback for Business Accounts or Restricted Profiles
            try {
                const business = await conn.getBusinessProfile(userJid);
                if (business && business.description) bioText = business.description;
            } catch {
                bioText = "Privacy Restricted 🔒";
            }
        }

        // 5. GROUP ROLE (IF IN GROUP)
        let groupRole = "";
        if (isGroup) {
            const p = participants.find(a => a.id === userJid);
            if (p) {
                const isAdmin = p.admin === "admin" || p.admin === "superadmin";
                groupRole = isAdmin ? "👑 Admin" : "👥 Member";
            }
        }

        // 6. FORMAT ENGLISH OUTPUT
        const userInfo = `
*╭───〔 USER INFORMATION 〕───⊷*
│
│ 👤 *Name:* ${userName}
│ 🔢 *Number:* ${userJid.split('@')[0]}
│ 📝 *About:* ${bioText}
${isGroup ? `│ 🏅 *Role:* ${groupRole}\n` : ''}│ 🔗 *Link:* wa.me/${userJid.split('@')[0]}
│
*╰──────────────────────────⊷*
`.trim();

        // 7. SEND RESULT
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: userInfo,
            mentions: [userJid]
        }, { quoted: mek });

    } catch (e) {
        console.error("Profile Command Error:", e);
        reply(`❌ *Error:* ${e.message || "Failed to fetch profile information."}`);
    }
});
