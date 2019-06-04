import colors from './colors';
import { Dimensions, StyleSheet } from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  centered: {
    height: 150,
    width: window.width - 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 0
  },
  error: {
    color: 'red',
    backgroundColor: colors.primary
  },
  description: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center'
  },
  title: {
    color: colors.white,
    fontSize: 20
  },
  bold: {
    fontWeight: 'bold'
  },
  padded: {
    paddingVertical: 10
  },
  buttonGroup: {
    flexDirection: 'row',
    marginHorizontal: -10
  },
  inputBox: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10,
    height: 60,
    width: 300,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  inputBoxMultiLines: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    height: 80,
    width: 300,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
});
