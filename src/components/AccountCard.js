import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  editViewProfileSvg as EditViewProfileSvg,
  ArrowRightSvg,
} from '../../assets/Icons/Svgs';

const AccountCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        justifyContent: 'flex-start',
        // alignItems: 'center',
        padding: hp('2'),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        textAlign: 'left',
      },
      categoryText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        paddingLeft: wp(4),
      },

      listItem: {
        width: wp(92),
        height: hp(8),
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.color.textWhite,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        paddingLeft: hp(1.5),
        borderWidth: hp('0.1'),
        paddingRight: hp(2),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(1.3),
      },
      editIcon: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: hp(12),
      },
      iconContainer: {justifyContent: 'center', alignItems: 'center'},
      listItemIconView: {
        width: wp(9),
        height: wp(9),
        backgroundColor: '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(6),
      },
      arrowRightView: {},
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.listStyle]}
      onPress={props?.onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.listItemIconView}>{props?.leftIcon}</View>
        <Text style={styles.categoryText}>{props?.title}</Text>
      </View>
      <View style={styles.arrowRightView}>
        <Ionicons
          name="chevron-forward-outline"
          size={hp(3)}
          color={'black'}
          onPress={props.onPressIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AccountCard;
