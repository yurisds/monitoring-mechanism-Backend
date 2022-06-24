require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/', route);

app.listen(process.env.PORT || 3003);