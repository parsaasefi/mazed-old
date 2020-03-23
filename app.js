const express = require('express');

const app = express();

app.length('/', (req, res) => {
  res.send('Hello from Mazed');
});

module.exports = app;
