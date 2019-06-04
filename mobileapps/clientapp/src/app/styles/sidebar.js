import { StyleSheet, Dimensions } from 'react-native';

import colors from './colors';

const window = Dimensions.get('window');
const width = window.width * 0.8; // Defined at Drawer.js@openDrawerOffset (1 - value)

export default StyleSheet.create({
  sideBar: {
    flex: 1,
    marginTop: 20
  },
  header: {
    backgroundColor: '#01345f',
    position: 'relative',
    height: 112,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: -10, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 1
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300'
  },
  navContainer: {
    flex: 1
  },
  navItem: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navItemTitle: {
    fontSize: 16,
    color: colors.darkBlue
  },
  logout: {
    width: 180,
    marginVertical: 20
  }
});
