import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ViewProfileCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        justifyContent: 'space-between',
        height: hp(5),
        // alignItems: 'center',
        paddingLeft: hp('2'),
        // paddingTop: hp('0.5'),
        // paddingBottom: hp('0.5'),
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
        width: '90%',
        height: hp(8),
        alignSelf: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.color.textWhite,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        paddingRight: hp(2),
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
      iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: hp(5),
        height: hp(5),
        backgroundColor: theme.color.dividerColor,
        borderRadius: hp(5),
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.listItem, props.listStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.iconContainer}>{props.img}</View>

        <View style={styles.nameContainer}>
          <Text style={styles.categoryText}>{props.name}</Text>
          <Text style={styles.nameText}>{props.category}</Text>
        </View>
      </View>
    </View>
  );
};

export default ViewProfileCard;
