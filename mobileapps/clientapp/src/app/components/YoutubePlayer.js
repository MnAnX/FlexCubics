import React, { PureComponent } from 'react';
import { View, Text, WebView } from 'react-native';
import PropTypes from 'prop-types';

export default class YoutubePlayer extends PureComponent {
  static propTypes = {
    videoId: PropTypes.any,
  }

  render() {
    return (
      <WebView
        style={this.props.style}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        builtInZoomControls={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        scrollEnabled={false}
        bounces={false}
        onMessage={this.props.onMessage}
        source={{
          html: this.getHtml(this.props.videoId),
          baseUrl: 'https://www.youtube.com',
        }}
      />
    );
  }

  getHtml(videoId, videoHeight) {
    let html = `<!DOCTYPE html>
                <html style="height: 100%; width: 100%; padding: 0; margin:0;">
                  <body>
                    <iframe src="https://www.youtube.com/embed/${videoId}" style="position:fixed;height:100%;width:98%" height="100%" width="100%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </body>
                </html>`
    return html;
  }
}
