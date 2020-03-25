const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const processRouter = require('./routes/process');

const Redis = require('./redis');
const Blacklist = require('./blacklist');

const app = express();
const redis = new Redis();
const blacklist = new Blacklist();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('redis', redis);
app.set('blacklist', blacklist);

app.use(morgan('tiny'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/process', processRouter);

module.exports = app;
