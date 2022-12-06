const frameBitmaps = require('./output.json');
const FRAMES_LUA_PATH = './frames.lua';
const fs = require('fs');
const pixels = require('image-pixels');

const width = 13;
const height = 10;

(async function() {
    let frameBitmaps = [await pixels('./frames/Bad Apple 0309.jpg')];
    console.log(frameBitmaps);
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
})();