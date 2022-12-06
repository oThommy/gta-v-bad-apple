// var pixels = require('image-pixels');
// const fs = require('fs');
// const path = require('path');
// const FRAMES_DIR = './frames';
// const frames = fs.readdirSync(FRAMES_DIR)
//     .filter(frame => !frame.includes('kopie'));

// const width = 13;
// const height = 10;

// (async function() {
//     console.log(`Getting bitmaps...`)

//     const framePaths = frames.map(frame => path.join(FRAMES_DIR, frame));
//     const frameBitmaps = (await pixels.all(framePaths))
//     .map(source => source.data)
//     .map((frameBitmapData, index) => {
//         console.log(`Getting bitmap of frame ${index + 1}...`);

//         const frameBitmap = new Array(width).fill([]);
//         let x = 0;
//         let y = 0;

//         for (let idx = 0; idx < frameBitmapData.length; idx += 4) {
//             if (x > width - 1) {
//                 x = 0;
//                 y++;
//             }

//             frameBitmap[y][x++] = {
//                 R: frameBitmapData[idx + 0],
//                 G: frameBitmapData[idx + 1],
//                 B: frameBitmapData[idx + 2]
//             };
//         }

//         return frameBitmap;
//     });

//     fs.writeFileSync('./test.json', JSON.stringify(frameBitmaps, null, 4));
// })();

// const ffmpeg = require('fluent-ffmpeg');
// // const extractFrames = require('ffmpeg-extract-frames');

// (async function() {
//     const res = await extractFrames({
//         input: 'C:\\Users\\Thom van den Hil\\Desktop\\GTA V Pedestrians Are On A Whole Other Level.mp4',
//         output: 'C:\\FXServer\\txData\\CFXDefault_841D2E.base\\resources\\[myScripts]\\bad-apple\\test\\screenshot-%d.jpg'
//     });

//     console.log(res);
// })();

const waitTill = new Date(new Date().getTime() + 10 * 1000);
while (waitTill > new Date()){}
console.log('hi');