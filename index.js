const fs = require('fs');
const { token } = require('./config.json');

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('ready', () => {
    console.log('Salut mon chat');
    postDailyMotivation();

    setInterval(postDailyMotivation, 24 * 60 * 60 * 1000); // 24 heures
});

async function postDailyMotivation() {
    console.log('Salut ma biche');
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const motivations = fs.readFileSync('motivations.txt', 'utf8').split('===');
        const motivationCounterFile = 'motivation_counter.txt';

        let counter;
        if (fs.existsSync(motivationCounterFile)) {
            counter = parseInt(fs.readFileSync(motivationCounterFile, 'utf8'));
        } else {
            counter = 0;
        }

        const motivation = motivations[counter % motivations.length].trim();
        const guilds = Array.from(client.guilds.cache.values());

        for (const guild of guilds) {
            const channelId = '1092781430251204628'; // Remplacez YOUR_CHANNEL_ID par l'ID du canal
            const channel = client.channels.cache.get(channelId);

            if (channel) {
                console.log(`Found channel: ${channel.name}`);
                await channel.send(motivation);
            } else {
                console.log('Channel not found');
            }
        }

        counter++;
        fs.writeFileSync(motivationCounterFile, counter.toString(), 'utf8');
    }
}

client.login(process.env.TOKEN);
