const express = require('express');
const { addMulterEndpoint } = require("./multerEndpoint");
const { addFormidableEndpoint } = require("./formidableEndpoint");
const { addBusboyEndpoint } = require("./busboyEndpoint");
const { addNativeEndpoint } = require("./nativeEndpoint");

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

addMulterEndpoint(app);
addFormidableEndpoint(app);
addBusboyEndpoint(app);
addNativeEndpoint(app);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = { playground: app };
