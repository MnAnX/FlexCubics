import Config from '../config';


export class Stats {
  static watchTutorial(userId, videoId) {
    let collection = 'watch_tutorial';
    let data = JSON.stringify({
      userId,
      videoId,
    });
    this.report(collection, data);
  }

  static report(collection, body) {
    let url = `https://api.keen.io/3.0/projects/${Config.keen.projectId}/events/${collection}?api_key=${Config.keen.writeKey}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })
  }
}
