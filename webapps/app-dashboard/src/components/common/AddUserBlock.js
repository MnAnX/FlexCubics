import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import NormalTextField from '../common/NormalTextField';
import NormalBigButton from '../common/NormalBigButton';
import ActionButton from '../common/ActionButton';


const style = {
	container: {
		display: 'flex',
		flexFlow: 'column'
	},
	buttons: {
		marginTop: 40,
		display: 'flex',
		flexFlow: 'row',
	}
}

class AddUserBlock extends Component {
	constructor(props) {
    super(props);

    this.state = {
			name: '',
			email: '',
    }
  }

  render() {
    return (
			<div>
				<div style={style.container}>
					<NormalTextField
						floatingLabelText="Name"
						value={this.state.name}
						onChange={(event)=>this.setState({name:event.target.value})}/>
					<NormalTextField
						floatingLabelText="Email Address"
						errorText={_.isEmpty(this.state.email) ? "This field is required" : ""}
						value={this.state.email}
						onChange={(event)=>this.setState({email: event.target.value})}/>
				</div>
				<div style={style.buttons}>
					<NormalBigButton label="Cancel" onClick={()=>this.props.onComplete()} />
					<ActionButton label="Add"
						onClick={()=>{
							this.props.onAdd(this.state.name, this.state.email);
							this.props.onComplete();
						}}
					/>
				</div>
			</div>
    );
	}
}

AddUserBlock.propTypes = {
	onAdd: PropTypes.func,
	onComplete: PropTypes.func,
};

export default AddUserBlock;
