var YoutubeMp3Downloader = require("youtube-mp3-downloader");



// // //Configure YoutubeMp3Downloader with your settings
// var YD = new YoutubeMp3Downloader({
//     "ffmpegPath": "C:/Users/laure/ffmpeg/bin/ffmpeg.exe",        // FFmpeg binary location
//     "outputPath": "./podcasts",    // Output file location (default: the home directory)
//     "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
//     "queueParallelism": 2,                  // Download parallelism (default: 1)
//     "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
//     "allowWebm": false                      // Enable download from WebM sources (default: false)
// });

// //Download video and save as MP3 file
// YD.download("iI34LYmJ1Fs");



// function download(videoId) {
//     YD.download(videoId);
// }


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

    download(videoId) {
        this.YD.download(videoId);
        this.YD.on("finished", function(err, data) {
            console.log(JSON.stringify(data));
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