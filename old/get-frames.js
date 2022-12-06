// global variables
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pixels = require('image-pixels');
const FRAMES_DIR = './test';
const FRAMES_LUA_PATH = './frames.lua';
const frames = fs.readdirSync(FRAMES_DIR)
    .filter(frame => !frame.includes('kopie'));

// config
const resizeFrames = true;
const getBitmaps = false;
const width = 13;
const height = 10;

// initialise script
init();

async function init() {
    // start the timer
    const startTime = new Date().getTime();

    // resize frames
    if (resizeFrames) {
        await resizeFramesFun();
    }

    // get bitmaps
    if (getBitmaps) {
        await getBitmapsFun();
    }

    // end the timer
    const endTime = new Date().getTime();
    console.log(`Done! ${endTime - startTime} ms`);
}

async function resizeFramesFun() {
    console.log(`Resizing frames...`);    
    for (const frame of frames) {
        try {
            const framePath = path.join(FRAMES_DIR, frame);
            const frameImg = await Jimp.read(framePath);
            console.log(`Resizing frame ${frame.split('.')[0]}...`);
            frameImg
                .resize(width, height)
                .write(framePath);
        } catch (err) {
            console.error(err);
        }
    }
}

async function getBitmapsFun() {
    console.log(`Getting bitmaps...`)

    const framePaths = frames.map(frame => path.join(FRAMES_DIR, frame));
    let frameBitmaps = await pixels.all(framePaths);
    frameBitmaps = frameBitmaps
        .map(source => source.data)
        .map((frameBitmapData, index) => {
            console.log(`Getting bitmap of frame ${index + 1}...`);
    
            const frameBitmap = new Array(width).fill([]);
            let x = 0;
            let y = 0;
    
            for (let idx = 0; idx < frameBitmapData.length; idx += 4) {
                if (x > width - 1) {
                    x = 0;
                    y++;
                }
    
                frameBitmap[y][x++] = {
                    R: frameBitmapData[idx + 0],
                    G: frameBitmapData[idx + 1],
                    B: frameBitmapData[idx + 2]
                };
            }
    
            return frameBitmap;
        });

    fs.writeFileSync('./test.json', JSON.stringify(frameBitmaps, null, 4));
}






// // get bitmaps
// console.log(`Getting bitmaps...`);

// frameBitmaps = [];
// frames.forEach(frame => {
//     console.log(`Getting bitmap of frame ${frame.split('.')[0]}...`);

//     let frameBitmap = new Array(13).fill([]);
//     const framePath = path.join(FRAMES_DIR, frame);
//     Jimp.read(framePath)
//         .then(frameImg => {
//             const bitmapData = frameImg.bitmap.data;
//             frameImg.scan(0, 0, width, height, (x, y, idx) => {
//                 frameBitmap[y][x] = {
//                     R: bitmapData[idx + 0],
//                     G: bitmapData[idx + 1],
//                     B: bitmapData[idx + 2]
//                 };
//             });
//         })
//         .catch(err => console.error(err));
//     frameBitmaps.push(frameBitmap);
// });

// // convert frames bitmaps to lua table
// const framesTable = '';
// // fs.writeFileSync(FRAMES_LUA_PATH, framesTable);

// // TESTING
// fs.writeFileSync('./test.json', JSON.stringify(frameBitmaps, null, 4));





// (async function() {
//     // get bitmaps
//     console.log(`Getting bitmaps...`);

//     frameBitmaps = [];
//     frames.forEach(frame => {
//         console.log(`Getting bitmap of frame ${frame.split('.')[0]}...`);

//         let frameBitmap = new Array(13).fill([]);
//         const framePath = path.join(FRAMES_DIR, frame);
//         const frameImg = Jimp.read(framePath);
//         try {
//             const bitmapData = frameImg.bitmap.data;
//             frameImg.scan(0, 0, width, height, (x, y, idx) => {
//                 frameBitmap[y][x] = {
//                     R: bitmapData[idx + 0],
//                     G: bitmapData[idx + 1],
//                     B: bitmapData[idx + 2]
//                 };
//             });
//         } catch (err) {
//             console.error(err);
//         }
//         frameBitmaps.push(frameBitmap);
//     });

//     // convert frames bitmaps to lua table
//     const framesTable = '';
//     // fs.writeFileSync(FRAMES_LUA_PATH, framesTable);

//     // TESTING
//     fs.writeFileSync('./test.json', JSON.stringify(frameBitmaps, null, 4));
// })();