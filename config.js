const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "SARWAR-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0pLc2pSM2lEa2hrMzF0TlNxNzYxbGczbEhlQzVOL2ZveGtqWDkra0lGMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiblYvdWZ4bUpoYnRYaWdUMTllRkpzTDNjQjJWV0pFb1g0VmhtY3J4eGlDWT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhSTdXdnRpYkJETUJvMzk5R1BYM1ExSXRLaVQrV0xPRERIVmtNb3ZQdlc4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrR2VaTUYwbFdLSnVvRmpscSs4TEVUNjVGUWl3VWZYdkxKejZLYjRvUGlJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFERk9weVNkTXB1YlNVejAwcGFvTW0vU0g0UXg1Ykp5S2FWeGhLMk5jMkU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImcyL0dTWFF2Nnk3c1ltUWx2ZEpoRzFlUDE5WTVGWDdlVGNyR3FhV3FxbWs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUlId0F5ZWQ2bGk5NXlOcVdIbklKOVNES2t0aGpLUkpEVll5NnhvUzNIWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY2xtNlNQNytsVkhPYm92MThXL3R5S3liT2tGREx6b1NqSTkzTzJkbnVTaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkExeE9nYjhKeHppUDVUM2dtcXpXUFdKZjJRRlJYakFPUFVvaFkxb1grb3huQnc4azdHZHc4RkExMGxUUGVnOTVmUE1ZQU0xRmVnUDVneHZuZ1dvOWlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzIsImFkdlNlY3JldEtleSI6IndmVmkxVWxqSFZzSmNuWFV5aVpWWjhkc0hoK2RnbVBFL3hmRUdjQ29DL3c9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiNTA5MzU2MjUwNTZAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQUM1NDdBNjU5QjM2MDU3QzcwQzQ2NDQxOUE3QjAyQjkiLCJzZW5kZXJMaWQiOiIxMjAxNDM3NDA5NDg1Mzk6MTJAbGlkIiwic2VuZGVyUG4iOiI1MDkzNTYyNTA1NkBzLndoYXRzYXBwLm5ldCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzc2NjE5MTg4fSx7ImtleSI6eyJyZW1vdGVKaWQiOiI1MDkzNTYyNTA1NkBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBQzJFRjI0QkIwMzI2QUQ5NTJFRENCOUU2NzFGQTlDRCIsInNlbmRlckxpZCI6IjEyMDE0Mzc0MDk0ODUzOToxMkBsaWQiLCJzZW5kZXJQbiI6IjUwOTM1NjI1MDU2QHMud2hhdHNhcHAubmV0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NzY2MTkxODl9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IlNNWFhYWFhYIiwibWUiOnsiaWQiOiI1MDkzNTYyNTA1NjoxMkBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjEyMDE0Mzc0MDk0ODUzOToxMkBsaWQiLCJuYW1lIjoiRGlldWxhIEJvbnRlbXBzIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNOdUppK1VDRUtTZGxNOEdHQWtnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJncmdKckFlTUJsQURJcXc4VWtpK3VWQ3cyREtnYXlYQWtHaXpYaG9PWDFVPSIsImFjY291bnRTaWduYXR1cmUiOiIrTXY1ekpnNnNZUStvSjBkWTh4eXg2UkdLYmlCZXErSGVnTFp5aWdUd0lzbWRxM1AwR2xRU0tERmFXNk9ZU0tqMWtkRzI3ZWo1SFJGY3h1SmRqREdDQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiUmFxWW9xdFZ0NmgyN2tuTGZxZ0pJeXJXUHdKc2ZqZmFKWldLUnZZcDNJS0tGNWlJYjRDbWRvckoxc1AycG9RVzg2MkJoaUUySnBFZng4K0R4Nm5xakE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI1MDkzNTYyNTA1NjoxMkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJZSzRDYXdIakFaUUF5S3NQRkpJdnJsUXNOZ3lvR3Nsd0pCb3MxNGFEbDlWIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQklJRFFnRiJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NzY2MTkxODYsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQWErIn0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY SARWAR-MD 🇵🇰*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "false",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "false",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
AUTO_VOICE: process.env.AUTO_VOICE || "false",
// make true or false for auto voice reply
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/zc57w6.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "SARWAR-MD",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "SARWAR-MD",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "923005448162",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "SARWAR-MD",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*©ᴘᴏᴡᴇʀᴇᴅ ʙʏ sᴀʀᴡᴀʀ-ᴀʟɪ-ᴍᴅ*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/zc57w6.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> I'm alive*SARWAR-MD*🇵🇰",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923005448162",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
// make it true for auto recoding 
ANTI_CALL: process.env.ANTI_CALL || "false"
// make it true for auto call reject 
};
