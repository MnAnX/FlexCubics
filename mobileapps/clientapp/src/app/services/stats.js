import Config from '../config';


export class Stats {
  static activeUserApp(userId, appId) {
    this.collectionTrigger(userId, appId, 'active_user_app')
  }

  static collectionTrigger(userId, appId, collectionName) {
    let data = JSON.stringify({
      userId,
      appId,
    });
    this.report(collectionName, data);
  }

  static report(collection, body) {
    let url = `https://api.keen.io/3.0/projects/${Config.keen.projectId}/events/${collection}?api_key=${Config.keen.key}`;
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
