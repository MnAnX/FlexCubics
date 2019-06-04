import Config from '../config';


export class Stats {
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
