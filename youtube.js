require('dotenv').config()

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

async function isVideoIdNew(channelId, videoId) {
    channel = await getChannel(channelId)
    return new Promise((resolve, reject) => {
        getPlaylistId(channelId).then(async playlistId => {
            videos = await getVideosFromPlaylistId(playlistId).then(videos => {
                lastVideoId = getLastVideoIdFrom(channelId)
                if (lastVideoId === videoId) {
                    resolve(false) 
                } else {
                    resolve(true)
                }
            })
        })
    })
}

channels = getAllChannels().channels

async function run() {

    for(i = 0; i < channels.length; i++) {
        console.log("i", i)
        channelId = channels[i].id
        await getPlaylistId(channelId).then(async playlistId => {
            await getVideosFromPlaylistId(playlistId).then(async videos => {
                for(j = 0; j < videos.length; j++){
                    
                    videoId = videos[j].snippet.resourceId.videoId
                    console.log("VideoId", videoId)
                    await isVideoIdNew(channelId, videoId).then(isNew => {
                        if(isNew){
                            console.log("ChannelId in isNew : ", channelId)
                            setLastVideoIdOf(channelId, videoId)
                        }
                    })
                }
            })
        })
    }
}

run()

// temp = isVideoIdNew('UCesjlAoEgN_Sz_cKTvKEmmw', 'jimmy').then(async isNew => {
//     if (isNew) {
//         console.log("New Video")
//         setLastVideoIdOf('UCesjlAoEgN_Sz_cKTvKEmmw', 'jimmy')
//     } else {
//         console.log("Video already found")
//     }
// })

function setLastVideoIdOf(channelId, videoId){
    channel = getChannel(channelId)
    channel.lastVideoId = videoId

    channels_json = getAllChannels()

    for(i = 0; i < channels_json.channels.length; i++){
        console.log(channels_json.channels[i].name , " channelId", channelId , " channelId:json", channels_json.channels[i].id)
        if(channels_json.channels[i].id == channelId){
            
            channels_json.channels[i].lastVideoId = videoId
        }
    }

    fs.writeFileSync('./channels/channels.json', JSON.stringify(channels_json, null, 2))
}