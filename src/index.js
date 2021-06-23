const GalaxaClient = require('./Structures/GalaxaClient');
require('dotenv').config();

// eslint-disable-next-line no-process-env
const client = new GalaxaClient({ token: process.env.TOKEN, prefix: '.' });

client.start();
