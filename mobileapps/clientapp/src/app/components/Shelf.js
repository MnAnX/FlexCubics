import React from 'react';
import { ScrollView, View } from 'react-native';

import { chunk } from 'lodash';

import ShelfRow from './ShelfRow';

import colors from '../styles/colors';

export default ({children, columns = 2}) => {
  children = React.Children.toArray(children);

  const rows = chunk(children, columns).map((chunk, idx) => {
    return <ShelfRow key={idx} columns={columns}>{chunk}</ShelfRow>;
  });

  return (
    <ScrollView>
      {rows}
    </ScrollView>
  );
};
