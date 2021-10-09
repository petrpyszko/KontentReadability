'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const textAnalyzer = require('../src/textAnalyzer.js');
const RichTextClient = require('../src/textFetcher.js');
const router = express.Router();

router.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, '../public/customElement.html'));
});

router.get('/count-score', async (req, res) => {
  const projectId = process.env.PROJECT_ID || '37c18c01-6a77-4f04-bbfb-2a262469b629';
  const apiKey = process.env.PREVIEW_API_KEY;
  const itemId = req.query.itemId || "39296026-6cfd-4543-bf4f-c402aa7b4749";
  const elementId = req.query.element || "rt";

  try {
    const client = new RichTextClient(projectId, apiKey);
    const text = await client.getRichTextValue(itemId, elementId);
    const score = textAnalyzer.getScoring(text);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(score, null, 2));
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', (req, res) => res. json({ postBody: req.body }));

app.use('/public/', express.static('public'));
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));




module.exports = app;
module.exports.handler = serverless(app);
