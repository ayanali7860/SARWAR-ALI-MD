const axios = require('axios');
const { cmd } = require('../command'); // Ensure this path matches your project

// Country to currency mapping with short/funny names
const countryMap = {
    'USA': 'USD',
    'United States': 'USD',
    'America': 'USD',
    'Pakistan': 'PKR',
    'Pak': 'PKR',
    'UK': 'GBP',
    'Britain': 'GBP',
    'England': 'GBP',
    'India': 'INR',
    'Ina': 'INR',
    'China': 'CNY',
    'Japan': 'JPY',
    'Jan': 'JPY',
    'Germany': 'EUR',
    'Dey': 'EUR',
    'France': 'EUR',
    'Canada': 'CAD',
    'Australia': 'AUD',
    'Russia': 'RUB',
    'Saudi Arabia': 'SAR',
    'UAE': 'AED',
    'Qatar': 'QAR'
    // Add more countries if needed
};

// Box style reply
const boxStyleReply = (from, to, amount, rate) => `
💱 *Currency Converter* 💱
────────────────────────────
📌 From: ${from.toUpperCase()}
📌 To: ${to.toUpperCase()}
📌 Amount: ${amount}
📌 Rate: ${amount} ${from.toUpperCase()} = *${(rate * amount).toFixed(2)}* ${to.toUpperCase()}
────────────────────────────
🪷ᴘᴏᴡᴇʀᴅ ʙʏ sᴀʀᴡᴀʀ ᴀʟɪ ᴍᴅ🪷
`;

cmd({
    pattern: 'currency|crancy|price|payment|pay',
    desc: 'Check currency rate and convert amounts. Example: .pay 1 Pak to USA',
    category: 'utility',
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    if (!text) return reply('Usage: .pay 1 Pak to USA');

    let parts = text.split(' ');
    if (parts.length < 3) return reply('Please provide amount and countries. Example: .pay 100 Pak to USA');

    let amount = parseFloat(parts[0]);
    if (isNaN(amount)) return reply('Invalid amount.');

    let from = parts[1];
    let to = parts[2];

    // Handle "to" keyword
    if (parts[2].toLowerCase() === 'to' && parts.length >= 4) {
        from = parts[1];
        to = parts[3];
    }

    // Map country names and short names to currency codes
    from = countryMap[from] || from.toUpperCase();
    to = countryMap[to] || to.toUpperCase();

    try {
        const res = await axios.get(`https://open.er-api.com/v6/latest/${from}`);
        const rate = res.data.rates[to];
        if (!rate) return reply('❌ Invalid target country or currency.');

        reply(boxStyleReply(from, to, amount, rate));
    } catch (err) {
        reply('❌ Error fetching currency rate. Try again later.');
    }
});