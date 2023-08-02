import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
import {
  calenderSvg as CalenderSvg,
  clockSvg as ClockSvg,
  workSvg as WorkSvg,
  profileSvg as ProfileSvg,
} from '../../assets/Icons/Svgs';
import CheckBox from '@react-native-community/checkbox';

const InvitedJobCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      titleContainer: {
        marginLeft: hp('1'),
        justifyContent: 'space-between',
      },

      skillsText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },
      nameText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        paddingLeft: hp(0.5),
      },
      title: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },

      priceText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
      },

      listItem: {
        flex: 1,
        margin: 10,
        marginBottom: hp(0.1),
        width: wp(92),
        alignSelf: 'center',
        // flexDirection: 'row',
        borderRadius: hp(2),
        borderWidth: hp('0.1'),
        backgroundColor: theme.color.textWhite,
        // borderBottomWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
        // paddingHorizontal: wp(4),
      },
      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: hp(2),
        borderBottomWidth: hp('0.04'),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(0.5),
      },
      checkboxContainer: {
        flexDirection: 'column',
        marginBottom: hp(0.5),
        // marginLeft: hp(3),
      },
      checkbox: {
        alignSelf: 'center',
      },
      checkBoxText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.dividerColor,
        paddingLeft: hp(2),
        marginTop: hp(0.5),
      },
      imgStyle: {
        backgroundColor: theme.color.dividerColor,
        width: wp(13),
        height: wp(13),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1.5),
        flexDirection: 'row',
        marginLeft: wp(3),
      },
      profileContainer: {
        backgroundColor: 'black',
        width: wp(15),
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1),
        marginRight: wp(4),
        alignSelf: 'flex-end',
      },
      profileText: {
        color: 'white',
      },
      descriptionContainer: {
        marginBottom: hp(1.5),
        paddingHorizontal: wp(4),
      },
      jobDescriptionTitle: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
      },
      jobDescriptionText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[styles.listItem, props.subscriptionCard]}
      onPress={props.onPress}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.imgStyle}>
            <Image
              source={props.img}
              resizeMode={'cover'}
              style={props.imgStyle}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, props.titleStyle]}>{props.name}</Text>
            <Text style={styles.priceText}>{props.price}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileContainer}
          onPress={props.onPress}>
          <Text style={styles.profileText}>Accept</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nameContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <CalenderSvg />
          <Text style={styles.nameText}>{props.date}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <ClockSvg />
          <Text style={styles.nameText}>{props.time}</Text>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.jobDescriptionTitle}>Job Decsription:</Text>

        <Text style={[styles.jobDescriptionText, props.conditionText]}>
          {props.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InvitedJobCard;
