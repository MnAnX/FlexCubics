import React, { PureComponent } from 'react';
import { View, Text, WebView } from 'react-native';
import PropTypes from 'prop-types';

export default class WistiaPlayer extends PureComponent {
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
          baseUrl: 'https://wistia.com',
        }}
      />
    );
  }

  getHtml(videoId) {
    let html = `<!DOCTYPE html>
                <html style="height: 100%; width: 100%; padding: 0; margin:0;">
                  <body>
                    <script src="https://fast.wistia.com/embed/medias/${videoId}.jsonp" async></script>
                    <script src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
                    <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;">
                      <div class="wistia_responsive_wrapper" style="height:100%;width:100%;left:0;position:absolute;top:0;">
                        <div class="wistia_embed wistia_async_${videoId} videoFoam=true" style="height:100%;width:100%;position:relative">
                          <div class="wistia_swatch" style="height:100%;width:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;">
                            <img src="https://fast.wistia.com/embed/medias/${videoId}/swatch" style="filter:blur(5px);height:100%;width:100%;object-fit:contain;" alt="" onload="this.parentNode.style.opacity=1;" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </body>
                </html>`
    return html;
  }
}
