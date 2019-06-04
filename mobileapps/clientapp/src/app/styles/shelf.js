import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  shelf: {
    flex: 1,
    margin: 10,
    marginBottom: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  row: {
    flexDirection: 'row',
    height: 240,
    alignItems: 'flex-end',
    padding: 10,
  },
  rowItem: {
    alignItems: 'center',
    flex: 1
  }
});
