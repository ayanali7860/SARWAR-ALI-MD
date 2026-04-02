const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "remini",
  alias: ["enhance", "hd"],
  react: '✨',
  desc: "Enhance photo quality using Edith Remini API (Catbox upload)",
  category: "tools",
  filename: __filename
}, async (client, message, { reply, quoted }) => {
  try {
    const quotedMsg = quoted || message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("📸 Please reply to an image.");
    }

    // Download image
    const mediaBuffer = await quotedMsg.download();
    const extension = mimeType.includes('png') ? '.png' : '.jpg';
    const inputPath = path.join(os.tmpdir(), `input_${Date.now()}${extension}`);
    fs.writeFileSync(inputPath, mediaBuffer);

    // Upload to Catbox
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(inputPath));

    const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(inputPath); // cleanup

    const uploadedImage = catboxRes.data.trim();
    if (!uploadedImage.startsWith('https://')) {
      return reply("❌ Failed to upload image to Catbox.");
    }

    // Call Edith API
    const apiUrl = `https://edith-apis.vercel.app/imagecreator/remini?url=${encodeURIComponent(uploadedImage)}`;
    const apiRes = await axios.get(apiUrl, { timeout: 60000 });

    const data = apiRes.data;

    if (!data || !data.status || !data.result) {
      console.log("API Response:", data);
      return reply("❌ Failed to enhance the image. Try again later.");
    }

    // Send enhanced photo
    await client.sendMessage(message.chat, {
      image: { url: data.result },
      caption: "⚡ REMINI ENHANCEMENT COMPLETED SUCCESSFULLY! 💎\n✨ _Powered by SARWAR-MD_"
    }, { quoted: message });

    // Add ✅ reaction separately
    await client.sendMessage(message.chat, { react: { text: "✅", key: message.key } });

  } catch (err) {
    console.error("Remini Error:", err);
    await reply(`❌ Error: ${err.message || "Failed to enhance the image."}`);
  }
});