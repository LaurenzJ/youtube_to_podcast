const fs = require('fs');
const { google } = require('googleapis')
const youtube = google.youtube('v3')

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
    return new Promise((resolve, reject) => {
        youtube.playlistItems.list({
            key: process.env.TOKEN,
            playlistId: playlistId,
            part: 'snippet',
            maxResults: 1,
        }).then(response => {
            const videos = response.data.items
            resolve(response.data.items)
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}

function getDurationFromVideoId(videoId) {
    return new Promise((resolve, reject) => {
        youtube.videos.list({
            key: process.env.TOKEN,
            id: videoId,
            part: 'contentDetails',
        }).then(response => {
            const duration = response.data.items[0].contentDetails.duration
            resolve(duration)
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}

function getAllChannels() {
    return JSON.parse(fs.readFileSync('./channels/channels.json', 'utf8'));

}

function getChannel(channelId) {
    channels = getAllChannels().channels

    for(i = 0; i < channels.length; i++){
        if(channels[i].id == channelId){
            return channels[i]
        }
    }
}

function getLastVideoIdFrom(channelId) {
    channel = getChannel(channelId)
    return channel.lastVideoId
}

function updateChannelData(channel) {
    channels_json = getAllChannels()
    for(i = 0; i < channels_json.channels.length; i++){
        if(channels_json.channels[i].id == channel.id){
            channels_json.channels[i] = channel
        }
    }
    fs.writeFileSync('channels/channels.json', JSON.stringify(channels_json, null, 2))
}

function getVideoName(videoId) {
    return new Promise((resolve, reject) => {
        youtube.videos.list({
            key: process.env.TOKEN,
            part: 'snippet',
            id: videoId,
        }).then(response => {
            console.log("TITEL", response.data.items[0].snippet.title)
            const title = response.data.items[0].snippet.title
            resolve(title)
        }).catch(error => {
            console.log(error)
            reject(error)
        })
    })
}

function deleteLastVideoFrom(channelId) {
    channel = getChannel(channelId)
    console.log("Channel" , channel)
    videoName = getVideoName(channel.lastVideoId).then(videoName => {
        console.log(videoName)
        var filePath = './podcasts/'+videoName + '.mp3'; 
        fs.unlinkSync(filePath);
        channel.downloaded = false
        updateChannelData(channel)
    })
    
    
}
module.exports = {
    getChannel,
    getAllChannels,
    getLastVideoIdFrom,
    getVideoName,
    deleteLastVideoFrom,
    getPlaylistId,
    getVideosFromPlaylistId,
    updateChannelData,
    getDurationFromVideoId,
}