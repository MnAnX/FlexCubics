import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 60,
    paddingHorizontal: 25
  },
  centered: {
    alignItems: 'center'
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  header: {
    fontSize: 24,
    letterSpacing: 1
    // fontSize: 26,
    // letterSpacing: 2
  },
  image: {
    width: 196,
    height: 196,
    marginTop: 20
  },
  skip: {
    padding: 20,
    position: 'absolute',
    top: 0,
    right: 10
  },
  bold: {
    fontWeight: 'bold'
  },
  skinny: {
    fontWeight: '100'
  },
  paragraph: {
    fontSize: 20,
    textAlign: 'center'
  },
  imagePlaceholder: {
    height: 200
  }
});
