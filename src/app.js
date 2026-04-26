const express = require('express');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
