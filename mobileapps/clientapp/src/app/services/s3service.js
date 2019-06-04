import { FetchRequest } from './rns3/FetchRequest'
import { S3Policy } from './rns3/S3Policy'
import Config from '../config';

const AWS_DEFAULT_S3_HOST = 's3.amazonaws.com'

const EXPECTED_RESPONSE_KEY_VALUE_RE = {
    key: /<Key>(.*)<\/Key>/,
    etag: /<ETag>"?([^"]*)"?<\/ETag>/,
    bucket: /<Bucket>(.*)<\/Bucket>/,
    location: /<Location>(.*)<\/Location>/,
}

const entries = o =>
    Object.keys(o).map(k => [k, o[k]])

const extractResponseValues = (responseText) =>
    entries(EXPECTED_RESPONSE_KEY_VALUE_RE).reduce((result, [key, regex]) => {
        const match = responseText.match(regex)
        return { ...result, [key]: match && match[1] }
    }, {})

const setBodyAsParsedXML = (response) =>
    ({
        ...response,
        body: { postResponse: response.text == null ? null : extractResponseValues(response.text) }
    })

export class S3Uploader {
  static uploadCustomAppCoverImage(userId, appId, customAppId, file, resultCallback) {
    let key = `covers/${userId}_${appId}_${customAppId}_${file.name}`;
    this.uploadFile(key, file, resultCallback);
  }

  static uploadUserCategoryVideo(userId, customAppId, file, resultCallback) {
    let key = `videos/${userId}_${customAppId}_${file.name}`;
    this.uploadFile(key, file, resultCallback);
  }

  static uploadUserCategoryImage(userId, customAppId, file, resultCallback) {
    let key = `images/${userId}_${customAppId}_${file.name}`;
    this.uploadFile(key, file, resultCallback);
  }

  static uploadUserVideo(userId, file, resultCallback) {
    let key = `videos/${userId}_000_${file.name}`;
    this.uploadFile(key, file, resultCallback);
  }

  static uploadUserImage(userId, file, resultCallback) {
    let key = `images/${userId}_000_${file.name}`;
    this.uploadFile(key, file, resultCallback);
  }

  static uploadFile(key, file, resultCallback) {
    options = {
        key,
        date: new Date,
        contentType: file.type,
        bucket: Config.s3.userImageBucket,
        region: Config.s3.region,
        accessKey: Config.s3.accessKey,
        secretKey: Config.s3.secretKey,
        successActionStatus: 201,
    }

    this.putWithFetch(file, options, null, resultCallback);
  }

  static putWithFetch(file, options, uploadProgressCallback, resultCallback) {
      const url = `https://${options.bucket}.${options.awsUrl || AWS_DEFAULT_S3_HOST}`
      const method = "POST"
      const policy = S3Policy.generate(options)

      return FetchRequest.create(url, method, policy)
          .set("file", file)
          .send(uploadProgressCallback, resultCallback)
          .then(setBodyAsParsedXML)
  }
}
