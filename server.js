require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const cheerio = require('cheerio');
const cors = require('./middleware/cors');
const { keepDefinedValues } = require('./utils');

const app = express();

function isJsonString(data) {
  try {
    JSON.parse(data);

    return true;
  } catch (_) {}
}

function autoParse(body, response, resolveWithFullResponse) {
  const contentType = response.headers['content-type'];

  // FIXME: The content type string could contain additional values like the charset.
  // Consider using the `content-type` library for a robust comparison.
  if (contentType.includes('application/json')) {
    return (isJsonString(body) && JSON.parse(body)) || body;
  } else if (contentType.includes('text/html')) {
    return cheerio.load(body);
  }

  return body;
}

app.use(bodyParser.json({ limit: '5mb' }));

// Cors
app.use(cors);

app.get('/', (req, res) =>
  res.send({ status: 200, message: 'Proxy Server. Use the POST method!' }),
);

app.post('/', async (req, res) => {
  const headers = req.headers;
  const params = req.params;
  const {
    json = true,
    uri,
    method = 'POST',
    authType,
    authUser,
    authToken,
    ...query
  } = req.query;
  const body = (method || '').toLowerCase() === 'get' ? null : req.body;

  const filteredHeaders = Object.keys(headers).reduce((_acc, key) => {
    if (key.startsWith('xp-')) {
      _acc[key.replace('xp-', '')] = headers[key];
    }
    return _acc;
  }, {});

  let auth = null;

  if (authType === 'bearer') {
    filteredHeaders.authorization =
      authType === 'bearer'
        ? `Bearer ${authToken || process.env.AUTH_TOKEN}`.trim()
        : '';
  } else if (authType === 'basic') {
    auth = {
      user: authUser,
      pass: authToken || process.env.AUTH_TOKEN,
    };
  }

  const options = {
    qs: query,
    uri,
    json,
    body,
    auth,
    method,
    headers: filteredHeaders,
    transform: autoParse,
  };

  try {
    const response = await rp(keepDefinedValues(options));

    res.send(response);
  } catch (error) {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).send(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
