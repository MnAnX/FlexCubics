import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';

import colors from '../../styles/colors'


class CategorySelector extends Component {
  render() {
		let size = _.size(this.props.categories);
    return (
      <List>
				{size<1 && <div>No more categories</div>}
        {size>0 &&
					_.values(this.props.categories).map((category)=>{
          return(
            <ListItem
              primaryText={category.groupName}
              secondaryText={category.categoryName}
              onClick={()=>{this.props.onClick ? this.props.onClick(category) : null}}
              rightIcon={this.props.onDelete ?
                <IconButton onClick={(e)=>{this.props.onDelete(category); e.stopPropagation();}}><IconDelete /></IconButton>
                : null
              }
            />
          )
        })}
      </List>
    );
	}
}

CategorySelector.propTypes = {
	categories: PropTypes.array.isRequired,
	onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CategorySelector;
