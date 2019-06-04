import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

import colors from '../../styles/colors'


const style = {
	container: {
		marginTop: 20,
	},
	searchBar: {
		width: '100%',
		height: 20,
		borderRadius:16,
    borderWidth: 1,
    borderColor: colors.text,
		padding: 4,
		fontSize: 14,
		color: colors.text,
	},
  userList: {
    marginTop: 20,
    display: 'flex',
    flexWrap: 'wrap',
  },
	chip: {
    margin: 6,
  },
}

class UsersList extends Component {
	constructor(props) {
    super(props);

    this.state = {
			users: props.users,
			searchTerm: ''
    }

		this.searchBar = this.searchBar.bind(this);
		this.userChip = this.userChip.bind(this);
		this.userList = this.userList.bind(this);
  }

	componentWillReceiveProps(nextProps) {
		this.setState({
			users: nextProps.users,
			searchTerm: '',
		})
	}

	searchBar() {
		return (
			<div>
				<input
					style={style.searchBar}
					type="text"
					placeholder=" Search user..."
					value={this.state.searchTerm}
					onChange={(event)=>{this.setState({searchTerm: event.target.value})}}
				/>
			</div>
		)
	}

	userChip(user) {
		let userName = user.userInfo.lastName ? `${user.userInfo.firstName} ${user.userInfo.lastName}` : user.userInfo.email;
		let deleteUser = this.props.allowRemove ? ()=>{this.props.onDelete(user, userName)} : null;
		return (
			<Chip
				onRequestDelete={deleteUser}
				onClick={()=>{this.props.onClick(user)}}
				style={style.chip}
				labelColor='dimgrey'
			>
				<Avatar size={32} src={user.userInfo.profilePhotoUrl} />
				{userName}
			</Chip>
		)
	}

	userList() {
		let users = [];
		_.values(this.state.users).forEach((user)=>{
			if(this.state.searchTerm === '') {
				users.push(this.userChip(user));
			} else {
				let userName = user.userInfo.lastName ? `${user.userInfo.firstName} ${user.userInfo.lastName}` : user.userInfo.email;
				if (userName.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) === -1) {
					return;
				}
				users.push(this.userChip(user));
			}
		})
		return (
			<div style={style.userList}>
				{users}
			</div>
		)
	}

  render() {
    return (
			<div style={style.container}>
				<div>{"* Click on user bubble to see more details (sorted by user start date)"}</div>
				<br />
				{this.searchBar()}
				{this.userList()}
			</div>
    );
	}
}

UsersList.propTypes = {
	users: PropTypes.array.isRequired,
	onClick: PropTypes.func,
	allowRemove: PropTypes.bool,
	onDelete: PropTypes.func,
};

export default UsersList;
