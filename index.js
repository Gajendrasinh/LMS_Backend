const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const router = require('./routes/index');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', router);

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
})