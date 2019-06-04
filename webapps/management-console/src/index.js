import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import Router from './router'
import runtime from 'offline-plugin/runtime';

class Root extends Component {
	render() {
		return (
			<Provider store={configureStore}>
				<Router />
			</Provider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));

runtime.install({
  onUpdating: () => {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    runtime.applyUpdate();
  },
  onUpdated: () => {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },
  onUpdateFailed: () => {
    console.log('SW Event:', 'onUpdateFailed');
  }
});
