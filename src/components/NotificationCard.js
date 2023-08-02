import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
const NotificationCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        paddingLeft: wp(2),
        width: wp(75),
      },
      nameText: {
        // fontSize: theme.size.small,
        fontSize: hp(1.7),
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
      },

      expText: {
        fontFamily: theme.fontFamily.mediumFamily,
        fontSize: theme.size.xsmall,
        marginTop: hp(1),
      },

      listItem: {
        marginHorizontal: wp(2),
        marginVertical: hp(1),
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        padding: hp(1),
        borderWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      viewProposals: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        paddingRight: hp(2),
        paddingBottom: hp(4),
      },
      imageStyle: {
        width: wp(13),
        height: wp(13),
        borderRadius: hp(5),
        backgroundColor: 'black',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.listStyle]}
      onPress={props.onPressProposal}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {props.img ? (
          <FastImage source={props.img} style={styles.imageStyle} />
        ) : (
          <FastImage
            source={require('../components/ImagePicker/Icons/avatar-placeholder.jpg')}
            style={styles.imageStyle}
          />
        )}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{props.name}</Text>
          <Text style={styles.expText}>{props.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
