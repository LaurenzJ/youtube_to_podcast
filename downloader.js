var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const utils = require('./utils.js')

class Downloader {
    constructor() {
        this.YD = new YoutubeMp3Downloader({
            "ffmpegPath": "C:/Users/laure/ffmpeg/bin/ffmpeg.exe",        // FFmpeg binary location
            "outputPath": "./podcasts",    // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });
    }

    download(videoId, channelId) { // get channelId from the url
        this.YD.download(videoId);
        this.YD.on("finished", function(err, data) {
            console.log("CHANNELID:", channelId)
            var channel = utils.getChannel(channelId);

            utils.getVideoName(videoId).then((name) => {
                utils.getDurationFromVideoId(videoId).then((duration) => {
                    channel.videoTitle = name;
                    channel.downloaded = true;
                    channel.videoDuration = duration;
                    utils.updateChannelData(channel);
                })
            }).catch((err) => {
                console.log(err);
            });
            
        });
        
        this.YD.on("error", function(error) {
            console.log(error);
        });
        
        this.YD.on("progress", function(progress) {
            console.log(JSON.stringify(progress));
        });
    }

    
    
}

module.exports = Downloader;