require('dotenv').config()

const fs = require('fs');
const { google } = require('googleapis')
const youtube = google.youtube('v3')

const Downloader = require('./downloader.js')

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
    fs.writeFileSync('./channels/channels.json', JSON.stringify(channels_json, null, 2))
}

function run() {
    channels = getAllChannels().channels
    channels.forEach(async channel => {
        channelId = channel.id
        getPlaylistId(channelId).then(playlistId => {
            getVideosFromPlaylistId(playlistId).then(videos => {
                videos.forEach(video => {
                    videoId = video.snippet.resourceId.videoId
                    console.log("VideoId", videoId , " Channel:", channel.name )
                    if (channel.lastVideoId != videoId){
                        console.log("New VideoId", videoId , " Channel:", channel.name )
                        channel.lastVideoId = videoId
                        updateChannelData(channel)
                        var downloader = new Downloader()                        
                        downloader.download(videoId)
                    }
                })
            })
        })
    })
}

run()