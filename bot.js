const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const config = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let isApiConnected = false;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    try {
        const response = await axios.get(`http://localhost:3000/verify-code`, {
            params: { code: config.code }
        });

        // ตรวจสอบเฉพาะค่าใน message แทน
        if (response.data.message.includes(config.name)) {
            isApiConnected = true;
            console.log('เข้าสู่ระบบ API แล้ว');
        } else {
            console.log('ไม่สามารถเข้าสู่ระบบ API ได้');
        }
    } catch (error) {
        console.error('Error accessing the API:', error);
    }
});

// ดึงคำสั่งจาก API
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.log(`Received command: ${interaction.commandName}`); // เพิ่มบรรทัดนี้เพื่อตรวจสอบการรับคำสั่ง

    if (interaction.commandName === 'ping') {
        if (!isApiConnected) {
            await interaction.reply('บอทยังไม่ได้เชื่อมต่อกับ API กรุณาลองใหม่ภายหลัง');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/ping-command');
            if (response.data.success && interaction.commandName === response.data.command.name) {
                const message = await interaction.deferReply({ fetchReply: true });
                const apiLatency = client.ws.ping;
                const clientPing = Date.now() - message.createdTimestamp;
                const newMessage = `API Latency: ${apiLatency} Ms\nClient Ping: ${clientPing} Ms`;

                await interaction.editReply({ content: newMessage });
            }
        } catch (error) {
            console.error('Error fetching command from API:', error);
            await interaction.reply('มีบางอย่างผิดพลาด ลองใหม่อีกครั้ง');
        }
    }
});


client.login(config.token);
