const express = require('express');
const app = express();

const fs = require('fs');

const youtube = require('./youtube.js')


app.get('/', (req, res) => {
    youtube.run()
    fs.readFile('./channels/channels.json', 'utf8', (err, data) => {
        if (err) {
            res.send(err);
        } else {
            obj = JSON.parse(data);
            console.log(obj)
            res.header("Content-Type",'application/json');
            res.send(JSON.stringify(obj, null, 4))
        }
    })
   
    
})

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`)

})