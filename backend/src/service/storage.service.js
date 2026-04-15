var ImageKit = require("imagekit");
const { nanoid } = require("nanoid");

var imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_API_KEY,
  privateKey: process.env.PRIVATE_API_KEY,
  urlEndpoint: process.env.URL_END_POINT,
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: file.buffer,
        fileName: nanoid() + file.originalname, 
        folder: "moody-player"
      },
      (error, result) => {
        if(error){
            reject(error)
        }else{
            resolve(result)
        }
      }
    );
  });
}

module.exports = uploadFile