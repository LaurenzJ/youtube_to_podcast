require('dotenv').config()
const utils = require('./utils.js')
const Downloader = require('./downloader.js')

function run() {
    channels = utils.getAllChannels().channels
    channels.forEach(channel => {
        channelId = channel.id
        utils.getPlaylistId(channelId).then(playlistId => {
            utils.getVideosFromPlaylistId(playlistId).then(videos => {
                videos.forEach(video => {
                    videoId = video.snippet.resourceId.videoId
                    console.log("VideoId", videoId , " Channel:", channel.name )
                    if (channel.lastVideoId != videoId){
                        utils.deleteLastVideoFrom(channelId)
                        console.log("New VideoId", videoId , " Channel:", channel.name )
                        channel.lastVideoId = videoId
                        utils.getVideoName(videoId).then((videoName) => {
                            channel.url = "./podcasts/"+videoName + '.mp3'
                            channel.downloaded = false
                            utils.updateChannelData(channel)
                            
                            console.log("CHANNEL", channel)
                        })
                    }
                })
            })
        })
    })
    
    channels.forEach(channel => {   
        if(!channel.downloaded) {
            var downloader = new Downloader()                        
            downloader.download(channel.lastVideoId, channel.id)
            channel.url = "https://dev.laurentbrand.com:8282/api/podcast/"+channel.lastVideoId+"?api_key="+process.env.API_KEY
            utils.updateChannelData(channel)
        }
    })

    return channels;
}

module.exports = {
    run
}