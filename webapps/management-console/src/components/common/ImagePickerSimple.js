import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NormalSmallButton from './NormalSmallButton';


const style = {
	container: {
		margin: 10,
		padding: 10,
	},
	preview: {
		margin: 10,
		padding: 10,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'lightgrey',
	},
	input: {
		margin: 10,
		padding: 10,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'lightgrey',
	},
	button: {
		margin: 10,
		padding: 10,
		color: 'white',
		background: 'deepskyblue',
		borderStyle: 'solid',
		borderWidth: 1,
		borderRadius: 6,
		borderColor: 'lightgrey',
  	fontWeight: 500,
  	fontSize: 14,
	},
	previewText: {
		fontSize: 14,
	}
}

class ImagePickerSimple extends Component {
	constructor(props) {
    super(props);

    this.state = {
			imageUrl: !_.isEmpty(props.imageUrl) ? props.imageUrl : '',
			isLoading: false,
			isUploaded: false,
    }

    this._handleImageChange = this._handleImageChange.bind(this);
		this._handleSubmit = this._handleSubmit.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({
			isLoading: nextProps.isLoading,
			isUploaded: nextProps.isUploaded,
		})
	}

  _handleImageChange(e) {
		e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imageUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

	_handleSubmit(e) {
    e.preventDefault();

		this.props.handleSubmit(this.state.imageUrl);
  }

  render() {
		let {imageUrl} = this.state;
    let $imagePreview = null;
    if (!_.isEmpty(imageUrl)) {
      $imagePreview = (<img style={this.props.previewStyle} src={imageUrl} />);
    } else {
      $imagePreview = (<div style={style.previewText}>Preview</div>);
    }

		let uploadButtonText = this.state.isUploaded ? 'Uploaded' : 'Upload';

    return (
			<div style={style.container}>
	      <form onSubmit={(e)=>this._handleSubmit(e)}>
	        <input style={style.input}
	          type="file"
	          onChange={(e)=>this._handleImageChange(e)} />
	        <NormalSmallButton
						label={uploadButtonText}
						disabled={this.state.isUploaded}
	          onClick={(e)=>this._handleSubmit(e)} />
	      </form>
	      <div style={style.preview}>
	        {$imagePreview}
	      </div>
	    </div>
    );
  }
}

ImagePickerSimple.propTypes = {
	imageUrl: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
	previewStyle: PropTypes.object,
	isLoading: PropTypes.bool,
	isUploaded: PropTypes. bool,
};

export default ImagePickerSimple;
