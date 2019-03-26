const express = require('express');
const helmet = require('helmet');

const zoosRouter = require('../zoos/zoos-router.js');
const bearsRouter = require('../bears/bears-router.js');

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.use('/api/zoos', zoosRouter);
server.use('/api/bears', bearsRouter); //DO NOT PUT '.' IT'S NOT A FILE!!!

module.exports = server;