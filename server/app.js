const express = require('express');
const cors = require('cors');

const app = express();
const port = 7000;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
