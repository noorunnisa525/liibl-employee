import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    root: {
      alignItems: 'stretch',
      // padding: 12,
      flex: 1,
      backgroundColor: 'white',
    },
    slider: {},
    button: {},
    header: {
      alignItems: 'center',
      backgroundColor: 'black',
      padding: 12,
    },
    horizontalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    text: {
      color: 'white',
      fontSize: 20,
    },
    valueText: {
      color: 'lightgray',
      fontSize: 20,
    },
  });
  return styles;
};
export default createStyles;
