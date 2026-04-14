const Jimp = require('jimp');

async function makeTransparent() {
  try {
    const image = await Jimp.read("./public/icon.png");
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Replace mostly white pixels with full transparency
      if (r > 220 && g > 220 && b > 220) {
        this.bitmap.data[idx + 3] = 0;
      }
    });

    await image.writeAsync("./public/icon_transparent.png");
    console.log("Success: Image background removed");
  } catch (error) {
    console.error("Error modifying image:", error);
  }
}

makeTransparent();
