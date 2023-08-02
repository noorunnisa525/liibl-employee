import {LogBox} from 'react-native';

const ignoreWarns = [
  'EventEmitter.removeListener',
  'Setting a timer for a long period of time',
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
  "exported from 'deprecated-react-native-prop-types'.",
  'Non-serializable values were found in the navigation state.',
  'Failed prop type: Invalid prop `source` supplied to `Image`, expected one of type',
  'Each child in a list should have a unique `key` prop.',
  'VirtualizedLists should never be nested inside plain ScrollViews',
];
const warn = console.warn;
console.warn = (...arg) => {
  for (let i = 0; i < ignoreWarns.length; i++) {
    if (arg[0].startsWith(ignoreWarns[i])) return;
  }
  warn(...arg);
};
LogBox.ignoreLogs(ignoreWarns);
