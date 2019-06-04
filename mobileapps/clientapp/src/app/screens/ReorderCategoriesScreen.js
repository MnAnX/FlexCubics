import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StaticRenderer, TouchableHighlight, View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import SortableList from 'react-native-sortable-listview';
import LoadingIndicator from 'react-native-loading-spinner-overlay';

import Container from '../components/Container';
import AccentButton from '../components/AccentButton';

import _ from 'lodash';

const window = Dimensions.get('window');

import colors from '../styles/colors'
import textStyle from '../styles/text'


const style = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: window.width,
    justifyContent: 'flex-start'
  },
  row: {
    flex: 0,
    height: 50,
    margin: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOpacity: 1,
    shadowOffset: {
      height: 2,
      width: 2
    },
    shadowRadius: 2,
  },
  rowHandle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: colors.primaryText,
    fontSize: 28,
    fontWeight: 'bold'
  },
  textWrapper: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  categoryText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  groupText: {
    color: colors.lightGrey,
    fontSize: 14,
    marginTop: 1,
  },
});

class ReorderCategoriesScreen extends Component {
  state = {
    categoryOrder: [],
    selectedCategories: {},
    sortingEnabled: false,
  };

  constructor(props) {
    super(props);

    this.saveCustomApp = this.saveCustomApp.bind(this);
  }

  componentDidMount() {
    let categories = this.props.categories;

    let keyedSelectedCategories = _.keyBy(categories, 'categoryId');
    let categoryOrder = _.keys(keyedSelectedCategories);
    this.setState({
      selectedCategories: keyedSelectedCategories,
      categoryOrder,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  setOrder({to, from}) {
    let order = this.state.categoryOrder.slice();
    order.splice(to, 0, order.splice(from, 1)[0]);
    this.setState({categoryOrder: order});
  }

  saveCustomApp() {
    if (this.props.customAppId && this.props.customAppId > 0){
      // Update custom app with re-ordered categories
      this.props.reorderCustomAppCategories(this.props.customAppId, this.state.categoryOrder);
      this.setState({isLoading: true})
      this.timeoutId = setTimeout(()=>{this.setState({isLoading: false})}, 3000)
      // Go back to playbook
      this.props.navigation.goBack();
    }
  }

  renderRow({data, sortHandlers}) {
    return (
      <View style={style.row}>
        <View style={style.textWrapper}>
          <Text style={style.groupText}>{data.groupName}</Text>
          <Text style={style.categoryText}>{data.categoryName}</Text>
        </View>
        <TouchableHighlight {...sortHandlers} delayLongPress={200} underlayColor='rgba(0,0,0,.2)'>
          <Text style={style.rowHandle} >&#9776;</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <LoadingIndicator visible={this.state.isLoading && this.props.customApps.isLoading} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
        <Text style={textStyle.normal}>Drag and drop the cards to re-order</Text>
        <SortableList
          initialListSize={12}
          removeClippedSubviews={false}
          order={this.state.categoryOrder}
          data={this.state.selectedCategories}
          onRowMoved={this.setOrder.bind(this)}
          renderRow={row => <this.renderRow data={row} />}
        />
        <AccentButton title={'Save'} onPress={() => this.saveCustomApp()}/>
      </Container>
    );
  }
}

ReorderCategoriesScreen.propTypes = {
  appId: PropTypes.number.isRequired,
  categories: PropTypes.array.isRequired
};

import { fetchCustomApp, reorderCustomAppCategories } from '../actions/customApps';

const mapStateToProps = ({customApps, user}, props) => ({
  ...props.navigation.state.params,
  customApps,
  user,
});

const mapDispatchToProps = dispatch => ({
  fetchCustomApp: (customAppId) => {
    dispatch(fetchCustomApp(customAppId));
  },
  reorderCustomAppCategories: (customAppId, categoryIDs) => {
    dispatch(reorderCustomAppCategories(customAppId, categoryIDs));
  },
});

import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(ReorderCategoriesScreen);
