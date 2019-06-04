import colors from './colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.transparentPrimary,
  },
  image: {
    height: 150,
    width: '100%',
  },
  titleOnlyContainer: {
    width: '100%',
    backgroundColor: colors.transparentPrimary,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.transparentPrimary,
  },
  title: {
    padding: 8,
    paddingLeft: 16,
    backgroundColor: 'transparent',
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    padding: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.transparentPrimary,
  },
  menuText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    shadowOpacity: .5,
  },
  infoText: {
    color: 'white',
    fontSize: 20,
  }
});
