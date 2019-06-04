import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NormalTextField from '../../components/common/NormalTextField';
import VideoPicker from '../../components/common/VideoPicker';
import ImagePicker from '../../components/common/ImagePicker';
import NormalBigButton from '../../components/common/NormalBigButton'

import colors from '../../styles/colors'


const style = {
	container: {
		display: 'flex',
		flexFlow: 'column'
	},
	label: {
    color: colors.primary,
    fontSize: 14,
  },
	video: {
    height: 100
  },
	image: {
    height: 100
  },
	buttons: {
		display: 'flex',
		flexFlow: 'row'
	}
}

class CustomCategoryEditor extends Component {
	constructor(props) {
    super(props);

    this.state = {
      category: props.category,
			readOnly: false,
    };

		if (props.readOnly === true){
			this.state.readOnly = true;
		}

		this.updateCategoryData=this.updateCategoryData.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.templateSpecificFields=this.templateSpecificFields.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		if(nextProps.category) {
			this.setState({category: nextProps.category})
		}
	}

	updateCategoryData(name, value) {
		let category = {
			...this.state.category,
			[name]: value,
		}
    this.setState({
      category,
    });
  }

  handleChange(event) {
    this.updateCategoryData(event.target.name, event.target.value);
  }

	templateSpecificFields() {
		const showExerciseFields = (this.props.templateId === 103)

		return (
			<div>
				{showExerciseFields &&
					<div style={style.container}>
						{!(this.state.readOnly) && <div style={style.label}><br />Exercise</div>}
						{(!this.state.readOnly || !_.isEmpty(this.state.category.numRepetitions)) && <NormalTextField
							floatingLabelText="Number of Repetitions"
							name="numRepetitions"
							value={this.state.category.numRepetitions}
							onChange={this.handleChange}
							readOnly={this.state.readOnly}
						/>}
						{(!this.state.readOnly || !_.isEmpty(this.state.category.numSets)) && <NormalTextField
							floatingLabelText="Number of Sets"
							name="numSets"
							value={this.state.category.numSets}
							onChange={this.handleChange}
							readOnly={this.state.readOnly}
						/>}
						{(!this.state.readOnly || !_.isEmpty(this.state.category.intensity)) && <NormalTextField
							floatingLabelText="Intensity"
							name="intensity"
							value={this.state.category.intensity}
							onChange={this.handleChange}
							readOnly={this.state.readOnly}
						/>}
						{(!this.state.readOnly || !_.isEmpty(this.state.category.frequency)) && <NormalTextField
							floatingLabelText="Frequency"
							name="frequency"
							value={this.state.category.frequency}
							onChange={this.handleChange}
							readOnly={this.state.readOnly}
						/>}
					</div>
				}
			</div>
		)
	}

  render() {
    return (
			<div>
	      <div style={style.container}>
					<NormalTextField
						floatingLabelText="Name"
						hintText="Category Name"
						errorText={_.isEmpty(this.state.category.categoryName) ? "This field is required" : ""}
						name="categoryName"
						value={this.state.category.categoryName}
						readOnly={this.state.readOnly}
						onChange={this.handleChange}
					/>
					<NormalTextField
						floatingLabelText="Description (optional)"
						hintText="Category Description"
						name="categoryDesc"
						fullWidth={true}
						value={this.state.category.categoryDesc}
						readOnly={this.state.readOnly}
						onChange={this.handleChange}
					/>
					<div>
						{!(this.state.readOnly) && <div style={style.label}><br />Video</div>}
						<VideoPicker
							videoUrl={this.state.category.videoUrl}
							userId={this.props.userId}
							appId={this.props.appId}
							previewStyle={style.video}
							readOnly={this.state.readOnly}
							handleSubmit={(videoUrl)=>{
								this.updateCategoryData('videoUrl', videoUrl);
							}}
						/>
					</div>
					<div>
						{!(this.state.readOnly) && <div style={style.label}><br />Image</div>}
						<ImagePicker
							imageUrl={this.state.category.imageUrl}
							userId={this.props.userId}
							previewStyle={style.image}
							readOnly={this.state.readOnly}
							handleSubmit={(imageUrl)=>{
								this.updateCategoryData('imageUrl', imageUrl);
							}}
						/>
					</div>
					{this.templateSpecificFields()}
				</div>
				<br />
				{!(this.state.readOnly) && <div style={style.buttons}>
					<NormalBigButton label="Cancel" onClick={()=>this.props.onCancel()} />
					<NormalBigButton label="Save" onClick={()=>this.props.onSave(this.state.category)} />
				</div>}
			</div>
    );
	}
}

CustomCategoryEditor.propTypes = {
	category: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	userId: PropTypes.number.isRequired,
	appId: PropTypes.string.isRequired,
	templateId: PropTypes.string.isRequired,
	readOnly: PropTypes.bool,
};

export default CustomCategoryEditor;
