const fs = require('fs');
const keep_alive = require('./keep_alive.js');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const token = process.env['DISCORDBOT'];
const logFile = 'log.txt';

client.once('ready', () => {
  console.log('Ready!');
  console.log(client.user.username);
});

client.on('ready', () => {
  console.log('Salut mon chat');
  postDailyMotivation();

  setInterval(postDailyMotivation, 24 * 30 * 60 * 1000); // 24 heures
});

async function postDailyMotivation() {
  console.log('Salut ma biche');
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const motivationsFile = 'motivations.txt';
    const motivationCounterFile = 'motivation_counter.txt';

    if (!fs.existsSync(motivationsFile)) {
      console.error(`Le fichier ${motivationsFile} n'existe pas.`);
      return;
    }

    const motivations = fs.readFileSync(motivationsFile, 'utf8').split('===');

    let counter;
    if (fs.existsSync(motivationCounterFile)) {
      counter = parseInt(fs.readFileSync(motivationCounterFile, 'utf8'));
    } else {
      counter = 0;
    }

    // Vérifier si le compteur est supérieur à la taille de la liste des motivations
    if (counter >= motivations.length) {
      counter = 0;
    }

    const motivation = motivations[counter].trim();
    const guilds = Array.from(client.guilds.cache.values());

    for (const guild of guilds) {
      const channelId = '1092781430251204628'; // Remplacez YOUR_CHANNEL_ID par l'ID du canal
      const channel = client.channels.cache.get(channelId);

      if (channel) {
        console.log(`Found channel: ${channel.name}`);
        await channel.send(motivation);
        logPublication(motivation, channel);
      } else {
        console.log('Channel not found');
      }
    }

    counter++;
    fs.writeFileSync(motivationCounterFile, counter.toString(), 'utf8');
  }
}

function logPublication(motivation, channel) {
  const currentDate = new Date();
  const logMessage = `${currentDate.toLocaleString()} : Publié "${motivation}" sur le canal ${channel.name} (${channel.id})\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture dans le fichier de log :', err);
    }
  });
}

client.login(token);
