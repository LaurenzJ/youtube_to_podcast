require('dotenv').config()
const { google } = require('googleapis')
const youtube = google.youtube('v3')

// youtube.channels.list({
//     key: process.env.TOKEN,
//     id: 'UCE2hJ9CYR57BYhk3TjGVG6w', // Breaking Lab id
//     part: 'contentDetails',
// }).then(response => {
//     const uploads = (response.data.items[0].contentDetails.relatedPlaylists.uploads)
    
//     youtube.playlistItems.list({
//         key: process.env.TOKEN,
//         playlistId: uploads,
//         part: 'snippet',
//         maxResults: 50,
//     }).then(response => {
//         console.log(response.data.items.map(item => item.snippet.title))
//     })
// }).catch(error => {
//     console.log(error)
// })


function getPlaylistId(channelId) {
    return new Promise((resolve, reject) => {
        youtube.channels.list({
            key: process.env.TOKEN,
            id: channelId,
            part: 'contentDetails',
        }).then(response => {
            const uploads = (response.data.items[0].contentDetails.relatedPlaylists.uploads)
            resolve(uploads)
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}

function getVideosFromPlaylistId(playlistId){
    youtube.playlistItems.list({
        key: process.env.TOKEN,
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 5,
    }).then(response => {
        console.log(response.data.items.map(item => item.snippet.title))
    })
}

getPlaylistId('UCE2hJ9CYR57BYhk3TjGVG6w').then(playlistId => {
    getVideosFromPlaylistId(playlistId)
})

//test