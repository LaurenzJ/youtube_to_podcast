const express = require('express');
const app = express();

const fs = require('fs');

const youtube = require('./youtube.js')


app.get('/api', (req, res) => {
    if(req.query.api_key.trim() === process.env.API_KEY.trim()) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(youtube.run(), null, 3));
    } else {
        res.end('No access!')
    }
})

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`)
})