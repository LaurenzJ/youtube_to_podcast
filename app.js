const express = require('express');
const app = express();

const fs = require('fs');

const youtube = require('./youtube.js')

const utils = require('./utils.js')


app.get('/api/podcasts', (req, res) => {
    if(req.query.api_key.trim() === process.env.API_KEY.trim()) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(youtube.run(), null, 3));
    } else {
        res.end('No access!')
    }
})

app.get('/api/podcast/:id', (req, res) => {
    console.log(req.query)
    if(req.query != {}) {
        if(req.query.api_key.trim() === process.env.API_KEY.trim()) {
            videoId = req.params.id
            path = './podcasts/'+ videoId + '.mp3'
            console.log("PATH", path)
            res.writeHead(200, {
                'Content-Type': 'audio/mp3',
            });
        
            var rs = fs.createReadStream(path);
            rs.pipe(res);
        } else {
            res.end('No access!')
        }
    }
    
}) 


app.listen(8282, () => {
    console.log(`Server is running at http://localhost:8282`)
})