
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = '[enter discord authentication token]';

const wordLibrary = [
  { word: 'example', definition: 'a representative form or pattern' },
  { word: 'serendipity', definition: 'the occurrence and development of events by chance in a happy or beneficial way' },
  { word: 'adept', definition: 'very skilled or expert' },
  { word: 'articulate', definition: 'a person who can speak clearly and effectively' },
  { word: 'candor', definition: 'honesty, being truthful and sincere' },
  { word: 'deference', definition: 'respectful submission to or courteous regard for another person' },
  { word: 'entail', definition: 'involve something necessary or require' },
  { word: 'novel', definition: 'new and innovative' },
  { word: 'paramount', definition: 'more important than anything else' },
  { word: 'obsolete', definition: 'something that is no longer produced or used' },
  // Add more words and definitions as needed
];

// Map to store the last word each user received
const userWordMap = new Map();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  try {
    // Check if the message has content
    if (message.content) {
      console.log('Message received:', message.content);

      // Trim the content and convert to lowercase for case-insensitive comparison
      const lowerCaseContent = message.content.trim().toLowerCase();

      // Check if the user is requesting a new word
      if (lowerCaseContent === '$newword') {
        // Get the user's ID
        const userId = message.author.id;

        // Get the last word the user received (default to null if not found)
        const lastWord = userWordMap.get(userId);

        // Get a random word from the library that the user hasn't received recently
        let filteredWords = wordLibrary.filter(word => word !== lastWord);
        
        // If the user has received all words, reset the cycle
        if (filteredWords.length === 0) {
          filteredWords = wordLibrary;
        }

        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        const randomWord = filteredWords[randomIndex];

        // Update the user's last received word
        userWordMap.set(userId, randomWord);

        // Reply with the word and its definition
        message.reply(`Here's a word for you: **${randomWord.word}** - ${randomWord.definition}`);
      }
      if (lowerCaseContent === '$dailyinfo') {
        const websiteLink = 'https://theweek.com/tag/daily-briefing';
        const responseMessage = `Here's a daily fact from [The Week](${websiteLink})`;
        // Reply with the fact and the link
        message.reply(responseMessage);
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

client.on('error', (error) => {
  console.error('Client error:', error);
});

client.login(token);
