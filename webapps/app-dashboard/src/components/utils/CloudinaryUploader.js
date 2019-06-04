import Config from '../../config';

var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: Config.cloudinary.cloudName,
  api_key: Config.cloudinary.apiKey,
  api_secret: Config.cloudinary.apiSecret,
});

export class CloudinaryUploader {
  static uploadImage(file, type, width, resultCallback) {
    cloudinary.uploader.upload(
      file,
      {"tags":type,"width":width,"crop":"fit"} ,
      function(err,image){
        console.log("Cloudinary image uploaded. URL: "+image.url);
        resultCallback(image);
      });
  }

  static uploadVideo(file, type, width, resultCallback) {
    cloudinary.uploader.upload(
      file,
      {"tags":type} ,
      function(err,image){
        console.log("Cloudinary video uploaded. URL: "+image.url);
        resultCallback(image);
      });
  }
}
