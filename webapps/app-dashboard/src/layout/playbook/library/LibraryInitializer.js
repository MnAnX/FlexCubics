import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle-outline';
import IconRemove from 'material-ui/svg-icons/content/remove-circle-outline';
import IconButton from 'material-ui/IconButton';

import ActionButton from '../../../components/common/ActionButton';
import SelectButton from '../../../components/common/SelectButton';
import Padding from '../../../components/common/Padding';

import colors from '../../../styles/colors'

const style = {
  titleText: {
    textAlign: 'center',
    fontSize: 26,
    color: colors.text,
    marginBottom: 20
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 20,
    color: colors.primary,
    textAlign: 'center'
  },
  userField: {
    width: 400,
    paddingLeft:10,
    paddingRight: 10,
    margin: 10
	},
}

class LibraryInitializer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [],
      userFields: [""],
    }

    this.flipField = this.flipField.bind(this)
    this.renderUserFields = this.renderUserFields.bind(this)
    this.save = this.save.bind(this)
    this.allowNext = this.allowNext.bind(this)
  }

  save() {
    let allFields = _.slice(this.state.fields)
    this.state.userFields.forEach((userField)=>{
      if(!_.isEmpty(userField)) {
        allFields.push(userField)
      }
    })
    this.props.onSubmit(allFields)
  }

  allowNext() {
    // at least one category selected/input
    if(this.state.fields.length > 0) {
      return true;
    } else {
      let hasValue = false;
      this.state.userFields.forEach((userField)=>{
        if(!_.isEmpty(userField)) {
          hasValue = true;
        }
      })
      return hasValue;
    }
  }

  flipField(field) {
    if(_.indexOf(this.state.fields, field) < 0) {
      // add this field
      let fields = _.slice(this.state.fields)
      fields.push(field)
      this.setState({fields})
    } else {
      // remove this field
      let fields = _.slice(this.state.fields)
      _.pull(fields, field)
      this.setState({fields})
    }
  }

  renderUserFields() {
    var updateUserField = (index, value)=>{
      let userFields = _.slice(this.state.userFields)
      userFields[index] = value
      this.setState({userFields})
    }

    var addUserField = ()=>{
      let userFields = _.slice(this.state.userFields)
      userFields.push("")
      this.setState({userFields})
    }

    return (
      <div>
        {this.state.userFields.map((userField, index)=>{
          return (
            <Paper style={style.userField}>
              <TextField fullWidth={true} inputStyle={style.inputText}
                hintText="Other..."
                value={userField}
                onChange={(event)=>{updateUserField(index, event.target.value)}}/>
            </Paper>
          )
        })}
        <br />
        <RaisedButton label='Add More' icon={<IconAdd/>} onClick={()=>addUserField()}/>
      </div>
    )
  }

  render() {
    let optionButton = (field)=>{
      return (
        <SelectButton buttonWidth={400} label={field} isSelected={_.indexOf(this.state.fields, field) > -1} onClick={()=>this.flipField(field)}/>
      )
    }

    return (
      <div>
        <div style={style.titleText}>{"What do you want in your library?"}</div>
        <div style={style.centered}>
          <p>{"Click to add as many as you like"}</p>
          {optionButton("Office Info")}
          {optionButton("Exercises")}
          {optionButton("Surveys")}
          {optionButton("Forms")}
          {optionButton("Products")}
          {optionButton("Apparatus Instructions")}
          {this.renderUserFields()}
          <br />
          <ActionButton label="Next" onClick={()=>this.save()} disabled={!this.allowNext()} />
        </div>
      </div>
    );
	}
}

LibraryInitializer.propTypes = {
	onSubmit: PropTypes.func,
};

export default LibraryInitializer;
