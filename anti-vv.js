const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["viewonce", "retrieve"],
  react: "🐳",
  desc: "Owner Only - retrieve view once message",
  category: "owner",
  filename: __filename
}, async (client, m, store, { from, isCreator, reply }) => {
  try {
    if (!isCreator) return reply("*📛 This is an owner command.*");

    if (!m.quoted) {
      return reply("*🍁 Please reply to a view-once image / video / audio!*");
    }

    const quoted = m.quoted;

    // Ensure it's view-once
    if (!quoted.viewOnce) {
      return reply("❌ This message is not a view-once message.");
    }

    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Failed to download message.");

    let content = {};

    if (quoted.mtype === "imageMessage") {
      content = {
        image: buffer,
        caption: quoted.text || "",
        mimetype: quoted.mimetype || "image/jpeg"
      };
    } 
    else if (quoted.mtype === "videoMessage") {
      content = {
        video: buffer,
        caption: quoted.text || "",
        mimetype: quoted.mimetype || "video/mp4"
      };
    } 
    else if (quoted.mtype === "audioMessage") {
      content = {
        audio: buffer,
        mimetype: "audio/mp4",
        ptt: quoted.ptt || false
      };
    } 
    else {
      return reply("❌ Only image, video, and audio messages are supported.");
    }

    await client.sendMessage(from, content, { quoted: m });

  } catch (error) {
    console.error("vv Error:", error);
    reply("❌ Error fetching view-once message.");
  }
});