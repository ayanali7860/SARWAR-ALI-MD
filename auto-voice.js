const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const converter = require('../data/converter');
const config = require('../config');

cmd({
    on: "body"
},
async (conn, mek, m, { from, body }) => {
    try {
        
        const isEnabled = config.AUTO_VOICE === "true" || global.autoVoiceStatus === "true";
        if (!isEnabled || !body) return;
        
        const filePath = path.join(__dirname, '../assets/autovoice.json');
        if (!fs.existsSync(filePath)) return;

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const input = body.trim().toLowerCase();
        
        const matchText = Object.keys(data).find(trigger => trigger.toLowerCase() === input);
        if (!matchText) return;

        const audioFileName = data[matchText];
        const audioPath = path.join(__dirname, '../assets', audioFileName);
        
        if (!fs.existsSync(audioPath)) return;

        const buffer = fs.readFileSync(audioPath);
        const ext = audioFileName.split('.').pop();
        
        const ptt = await converter.toPTT(buffer, ext);

        await conn.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("AutoVoice Listener Error:", error);
    }
});
