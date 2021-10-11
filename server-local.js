'use strict';

const app = require('./express/server');

process.env.PROJECT_ID = '37c18c01-6a77-4f04-bbfb-2a262469b629';
process.env.PREVIEW_API_KEY = '';

app.listen(3000, () => console.log('Local app listening on port 3000!'));
