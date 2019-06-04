import { StyleSheet } from 'react-native';

import colors from './colors';

const dayTextColor = colors.darkBlue,
  daySelectedCircleColor = colors.orange;

// See https://github.com/christopherdro/react-native-calendar/blob/master/components/styles.js
export default StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'transparent'
  },
  calendarControls: {
    justifyContent: 'center'
  },
  title: {
    flex: 0
  },
  calendarHeading: {
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  dayHeading: {
    color: colors.primary,
    margin: 0
  },
  weekendHeading: {
    color: colors.primary
  },
  dayButton: {
    borderTopWidth: 0
  },

  currentDayCircle: { backgroundColor: daySelectedCircleColor },
  selectedDayCircle: { backgroundColor: daySelectedCircleColor },

  day: { color: dayTextColor },
  currentDayText: { color: dayTextColor },
  weekendDayText: { color: dayTextColor },
  selectedDayText: {
    color: dayTextColor,
    fontWeight: 'normal'
  },

  hasEventCircle: {
    backgroundColor: colors.transparentOrange
  }
});
