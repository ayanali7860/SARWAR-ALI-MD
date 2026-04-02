const fetch = require('node-fetch'); 
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');
const converter = require('../data/converter');

const quranImages = [
    "https://files.catbox.moe/ruen82.jpg",
    "https://files.catbox.moe/hlt5oh.jpg",
    "https://files.catbox.moe/srr18l.jpg"
];

async function googleTranslate(text, lang) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json && json[0]) {
            return json[0].map(item => item[0]).join('');
        }
        return text;
    } catch (e) {
        return text; 
    }
}

cmd({
  pattern: "quran",
  alias: ["surah"],
  react: "🤍",
  desc: "Get Quran Surah details and explanation.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {

    let surahInput = args[0];

    if (!surahInput) {
      return reply('*𝙏𝙮𝙥𝙚 𝙎𝙪𝙧𝙖𝙝 𝙉𝙪𝙢𝙗𝙚𝙧 𝙤𝙧 𝙏𝙮𝙥𝙚 *.𝙎𝙪𝙧𝙖𝙝𝙢𝙚𝙣𝙪* 𝙛𝙤𝙧 𝙜𝙚𝙩𝙩𝙞𝙣𝙜 𝙎𝙪𝙧𝙖𝙝 𝙣𝒖𝙢𝙗𝙚𝙧𝙨*');
    }

    let surahListRes = await fetchJson('https://quran-endpoint.vercel.app/quran');
    let surahList = surahListRes.data;

    let surahData = surahList.find(surah => 
        surah.number === Number(surahInput) || 
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() || 
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      return reply(`*❌ 𝘾𝙤𝙪𝙡𝙙𝙣'𝙩 𝙛𝙞𝙣𝙙 𝙨𝙪𝙧𝙖𝙝 "${surahInput}"*`);
    }

    let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    if (!res.ok) {
      return reply(`*❌ 𝘼𝙋𝙄 𝙀𝙧𝙧𝙤𝙧: Data fetch failed.*`);
    }
    let json = await res.json();

    let arabicText = '';
    try {
      const arabicRes = await axios.get(
        `https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${surahData.number}`
      );
      const verses = arabicRes.data.verses;
      arabicText = verses.map(v => `${v.text_uthmani}`).join('\n\n');
    } catch (e) {
      arabicText = `${surahData.asma.ar.long}`;
    }

    // Direct Web Translation to ensure Urdu is Urdu and English is English
    let urduTafsir = await googleTranslate(json.data.tafsir.id, 'ur');
    let engTafsir = await googleTranslate(json.data.tafsir.id, 'en');

    const selectedImage = quranImages[Math.floor(Math.random() * quranImages.length)];

    let quranSurah = `*🕋 Quran: The Holy Book ♥️🌹 قرآن مجید 🌹♥️*

*📖 سورۃ ${json.data.number}: ${json.data.asma.ar.long}*
*✦ ${json.data.asma.en.long}*

*💫 𝑻𝒚𝒑𝒆:* ${json.data.type.en}
*✅ 𝑵𝒖𝒎𝒃𝒆𝒓 𝒐𝒇 𝑽𝒆𝒓𝒔𝒆𝒔:* ${json.data.ayahCount}

*◈─────────────────◈*
*🌙 آیات — عربی (𝑨𝒓𝒂𝒃𝒊𝒄):*
*◈─────────────────◈*

${arabicText}

*◈─────────────────◈*
*☪️ ترجمہ — اردو (𝑼𝒓𝒅𝒖):*
*◈─────────────────◈*

*${urduTafsir}*

*◈─────────────────◈*
*📜 𝑸𝒖𝒓𝒂𝒏 𝑴𝒂𝒋𝒆𝒆𝒅 — 𝑬𝒏𝒈𝒍𝒊𝒔𝒉:*
*◈─────────────────◈*

*${engTafsir}*

*◈─────────────────◈*
> ⚡ *ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ-ᴀʟɪ-ᴍᴅ* ⚡`;

    await conn.sendMessage(from, {
        image: { url: selectedImage },
        caption: quranSurah,
        contextInfo: {
          mentionedJid: [m.sender], 
          forwardingScore: 999, isForwarded: true,   
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363425072775595@newsletter', 
            newsletterName: '𝐒𝐀𝐑𝐖𝐀𝐑-𝐀𝐋𝐈-𝐌𝐃', serverMessageId: 143
          }
        }
      }, { quoted: mek });

    if (json.data.recitation.full) {
      try {
        const audioRes = await axios.get(json.data.recitation.full, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(audioRes.data);
        const ptt = await converter.toPTT(buffer, 'mp3');
        await conn.sendMessage(from, { audio: ptt, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: mek });
      } catch (audioErr) {
        await conn.sendMessage(from, { audio: { url: json.data.recitation.full }, mimetype: 'audio/mpeg' }, { quoted: mek });
      }
    }

  } catch (error) {
    console.error(error);
  }
});

cmd({
    pattern: "quranmenu",
    alias: ["surahmenu", "surahlist"],
    desc: "Show all Surah list",
    category: "menu",
    react: "❤️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `*🕋 Quran: The Holy Book ♥️🌹 قرآن مجید 🌹♥️*

*💫 𝘈𝘭𝘭 𝘚𝘶𝘳𝘢𝘩 𝘓𝘪𝘴𝘵*
*🌸 𝘛𝘺𝘱𝘦 .𝘴𝘶𝘳𝘢𝘩 36* 𝘵𝘰 𝘨𝘦𝘵 𝘚𝘶𝘳𝘢𝘩 🌸

*◈─────────────────◈*

1. *🕌 Al-Fatiha - الفاتحہ*
2. *🐄 Al-Baqarah - البقرہ*
3. *🏠 Aali Imran - آل عمران*
4. *👩 An-Nisa - النساء*
5. *🍽️ Al-Maidah - المائدہ*
6. *🐪 Al-Anam - الانعام*
7. *⛰️ Al-Araf - الأعراف*
8. *⚔️ Al-Anfal - الانفال*
9. *🙏 At-Tawbah - التوبہ*
10. *🐟 Yunus - یونس*
11. *🌩️ Hud - ہود*
12. *👶 Yusuf - یوسف*
13. *⚡ Ar-Rad - الرعد*
14. *🕊️ Ibrahim - ابراہیم*
15. *🪨 Al-Hijr - الحجر*
16. *🐝 An-Nahl - النحل*
17. *🌙 Al-Isra - الإسراء*
18. *🕳️ Al-Kahf - الکہف*
19. *🧕 Maryam - مریم*
20. *📜 Ta-Ha - طٰہٰ*
21. *📖 Al-Anbiya - الانبیاء*
22. *🕋 Al-Hajj - الحج*
23. *🙌 Al-Muminun - المؤمنون*
24. *💡 An-Nur - النور*
25. *⚖️ Al-Furqan - الفرقان*
26. *🎤 Ash-Shuara - الشعراء*
27. *🐜 An-Naml - النمل*
28. *📚 Al-Qasas - القصص*
29. *🕷️ Al-Ankabut - العنکبوت*
30. *🏛️ Ar-Rum - الروم*
31. *📖 Luqman - لقمان*
32. *🙇 As-Sajda - السجدہ*
33. *⚔️ Al-Ahzab - الاحزاب*
34. *🌸 Saba - سبا*
35. *🛠️ Fatir - فاطر*
36. *📖 Ya-Sin - یس*
37. *🛡️ As-Saffat - الصافات*
38. *🅱️ Sad - صاد*
39. *🪖 Az-Zumar - الزمر*
40. *🤲 Ghafir - غافر*
41. *📜 Fussilat - فصلت*
42. *🗣️ Ash-Shura - الشوری*
43. *💰 Az-Zukhruf - الزخرف*
44. *💨 Ad-Dukhan - الدخان*
45. *🐊 Al-Jathiyah - الجاثیہ*
46. *🌪️ Al-Ahqaf - الأحقاف*
47. *🕋 Muhammad - محمد*
48. *🏆 Al-Fath - الفتح*
49. *🏠 Al-Hujurat - الحجرات*
50. *🔤 Qaf - قاف*
51. *🌬️ Adh-Dhariyat - الذاریات*
52. *⛰️ At-Tur - الطور*
53. *🌟 An-Najm - النجم*
54. *🌙 Al-Qamar - القمر*
55. *💖 Ar-Rahman - الرحمن*
56. *🌌 Al-Waqiah - الواقعہ*
57. *🔩 Al-Hadid - الحدید*
58. *👩‍⚖️ Al-Mujadila - المجادلہ*
59. *🏴 Al-Hashr - الحشر*
60. *🔍 Al-Mumtahanah - الممتحنہ*
61. *📊 As-Saff - الصف*
62. *🕌 Al-Jumuah - الجمعة*
63. *🤥 Al-Munafiqun - المنافقون*
64. *🌪️ At-Taghabun - التغابن*
65. *💔 At-Talaq - الطلاق*
66. *🚫 At-Tahrim - التحریم*
67. *👑 Al-Mulk - المُلك*
68. *🖋️ Al-Qalam - القلم*
69. *🔍 Al-Haqqah - الحقہ*
70. *⬆️ Al-Maarij - المعارج*
71. *🌊 Nuh - نوح*
72. *👻 Al-Jinn - الجن*
73. *🕵️ Al-Muzzammil - المزمل*
74. *🧕 Al-Muddathir - المُدثر*
75. *🌅 Al-Qiyamah - القیامہ*
76. *🧑 Al-Insan - الانسان*
77. *✉️ Al-Mursalat - المُرسلات*
78. *📣 An-Naba - النبأ*
79. *🪤 An-Naziat - النازعات*
80. *😠 Abasa - عبس*
81. *💥 At-Takwir - التکوير*
82. *💔 Al-Infitar - الانفطار*
83. *⚖️ Al-Mutaffifin - المطففين*
84. *🌀 Al-Inshiqaq - الانشقاق*
85. *🌌 Al-Buruj - البروج*
86. *🌠 At-Tariq - الطارق*
87. *🌍 Al-Ala - الأعلى*
88. *🌊 Al-Ghashiyah - الغاشیہ*
89. *🌅 Al-Fajr - الفجر*
90. *🏙️ Al-Balad - البلد*
91. *☀️ Ash-Shams - الشمس*
92. *🌜 Al-Lail - اللیل*
93. *🌅 Ad-Duha - الضحی*
94. *📖 As-Sharh - الشرح*
95. *🍈 At-Tin - التین*
96. *💧 Al-Alaq - العلق*
97. *⚡ Al-Qadr - القدر*
98. *📜 Al-Bayyinah - البینة*
99. *🌍 Az-Zalzalah - الزلزلة*
100. *🐎 Al-Adiyat - العادیات*
101. *⚡ Al-Qariah - القارعة*
102. *💰 At-Takathur - التکاثر*
103. *⏳ Al-Asr - العصر*
104. *😠 Al-Humazah - الہمزہ*
105. *🐘 Al-Fil - الفیل*
106. *🕌 Quraysh - قریش*
107. *🤲 Al-Maun - الماعون*
108. *🍇 Al-Kawthar - الکوثر*
109. *❌ Al-Kafirun - الکافرون*
110. *🛡️ An-Nasr - النصر*
111. *🔥 Al-Lahab - اللہب*
112. *❤️ Al-Ikhlas - الإخلاص*
113. *🌅 Al-Falaq - الفلق*
114. *🌐 An-Nas - الناس*

*◈─────────────────◈*
*> ⚡ ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ-ᴀʟɪ-ᴍᴅ ⚡*`;

        await conn.sendMessage(from, {
                image: { url: `https://files.catbox.moe/ruen82.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999, isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363425072775595@newsletter',
                        newsletterName: '𝐒𝐀𝐑𝐖𝐀𝐑-𝐀𝐋𝐈-𝐌𝐃', serverMessageId: 143
                    }
                }
            }, { quoted: mek });
    } catch (e) {
        console.log(e);
    }
});
