const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  // publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  // urlEndpoint: process.env.IMAGEKIT_URL,
});

module.exports = client;
