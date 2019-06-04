import colors from '../styles/colors';

export default {
  logoWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 18,
    borderColor: colors.primary,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  logo: {
    width: 32,
    height: 32,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 17,
    borderColor: colors.primary,
    overflow: 'hidden',
    marginRight: 8,
  },
  icon: {
    width: 34,
    height: 34,
  },
  groupTitleStyle: {
    color: colors.darkBlue,
    marginLeft: 5,
  },
  listItemAvatar: {
    width: 38,
    height: 38,
  },
  listItemCategoryName: {
    fontSize: 16,
    color: 'dimgrey',
  },
  listItemGroupName: {
    color: colors.darkBlue,
    fontSize: 14,
    marginTop: 1,
  },
  startScreen: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: colors.primary,
    fontSize: 20,
  },
};
