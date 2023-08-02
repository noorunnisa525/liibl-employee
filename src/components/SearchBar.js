import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {SearchSvg} from '../../assets/Icons/Svgs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useThemeAwareObject} from '../theme';

const SearchBar = props => {
  const [query, setQuery] = useState('');

  const onChangeText = text => {
    setQuery(text);
    // const list = playList?.filter(val => {
    //   return val.name.toLowerCase().includes(text.toLowerCase());
    // });
    // props.setUpdatedPlaylist(list);
  };
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      container: {
        height: hp(6),
        width: wp(76),
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: hp(1.3),
        backgroundColor: '#e6e6e6',
        borderColor: theme.color.textWhite,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 3},
            shadowOpacity: 0.2,
          },
          android: {
            elevation: 0.5,
          },
        }),
      },
      label: {
        fontSize: hp('3%'),
        // fontWeight: 'bold',
      },

      container2: {
        backgroundColor: theme.color.background,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: wp(2),
      },
      txt: {
        // padding: 5,
        color: theme.color.dividerColor,
        fontSize: hp(1.75),
        fontFamily: theme.fontFamily.mediumFamily,
      },
      Searchtxt: {
        // padding: 5,
        color: theme.color.textBlack,
        fontSize: hp(1.75),
        width: wp(65),
        height: hp(6),
        fontFamily: theme.fontFamily.mediumFamily,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.container, props.container]}>
      <TouchableOpacity style={styles.container2}>
        <SearchSvg />
      </TouchableOpacity>

      <View style={{justifyContent: 'center'}}>
        <TextInput
          style={styles.Searchtxt}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={'gray'}
        />
      </View>
    </View>
  );
};

export default SearchBar;
