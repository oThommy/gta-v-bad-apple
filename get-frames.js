// global variables
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');
const pixels = require('image-pixels');
const FRAMES_DIR = './frames';
const FRAMES_LUA_PATH = './frames.lua';
const frames = fs.readdirSync(FRAMES_DIR)
    .filter(frame => !frame.includes('kopie'));

// config
const resizeFrames = true;
const getBitmaps = true;
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
    
            const frameBitmap = Array.from(Array(height), () => Array(width));
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

        // convert frameBitmaps to a lua table
        console.log(`Converting bitmaps to lua tables...`)

        function convertToLua(literal) {
            if (literal.constructor === Array) {
                let arrayBody = ``;
        
                if (literal.some(el => el.constructor !== Array)) { // rows with objects
                    literal.forEach(el => {
                        arrayBody += `${convertToLua(el)}, `;
                    });
                    
                    return `\t{${arrayBody.substring(0, arrayBody.length - 2)}}`;
                } else {
                    literal.forEach(el => {
                        arrayBody += `${convertToLua(el)},\n\t`;
                    });
                    
                    return `{\n\t${arrayBody.substring(0, arrayBody.length - 2)}\n\t}`;
                }
        
            } else if (typeof(literal) === 'object') {
                let objectBody = ``;
        
                for (const [key, value] of Object.entries(literal)) {
                    objectBody += `['${key}'] = ${convertToLua(value)}, `;
                }
        
                return `{${objectBody.substring(0, objectBody.length - 2)}}`;
            } else {
                return String(literal);
            }
        }
        
        const output = convertToLua(frameBitmaps);
        let framesTable = `frames = ${output.substring(0, output.length - 2)}}`; // very scuffed way to fix closing curly brace
        framesTable += `\n\nprint('frames are loaded!')`
        fs.writeFileSync(FRAMES_LUA_PATH, framesTable);
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