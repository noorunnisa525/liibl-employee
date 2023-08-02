import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {editViewProfileSvg as EditViewProfileSvg} from '../../assets/Icons/Svgs';
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
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        textAlign: 'left',
      },

      listItem: {
        margin: 10,
        width: '90%',
        // height: hp(7),
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
      },
      viewProposals: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.dividerColor,
        paddingRight: hp(2),
        paddingBottom: hp(4),
      },
      editIcon: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: hp(12),
      },
      iconContainer: {justifyContent: 'center', alignItems: 'center'},
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.listItem, props.listStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {props.img}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{props.name}</Text>
          <Text style={styles.categoryText}>{props.category}</Text>
        </View>
      </View>
      {props?.viewProfile ? (
        <View style={styles.iconContainer}>
          <Ionicons
            name="chevron-forward-outline"
            size={hp(3)}
            color={'black'}
            onPress={props.onPressIcon}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AccountCard;
