import colors from './colors'

export default {
  common: {
    page: {
      display: 'flex',
      flexFlow: 'column',
      justifyContent: 'center',
      padding: 40
    },
    mainContainer: {
      marginLeft: '5%',
      marginRight: '5%'
    },
    detailsContainer: {
      marginLeft: '5%',
      marginRight: '5%'
    },
    buttonsContainer: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    row: {
      display: 'flex',
      flexFlow: 'row',
    },
    buttonAlign: {
      marginLeft: -16
    },
    paperContainer: {
      padding: 20,
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
      borderStyle: 'solid',
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.lightGrey
    },
  },
};
