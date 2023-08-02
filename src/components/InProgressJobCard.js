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
  scanSvg as ScanSvg,
} from '../../assets/Icons/Svgs';
import CheckBox from '@react-native-community/checkbox';

const InProgressJobCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      nameContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.5),
        justifyContent: 'space-between',
        flexDirection: 'row',
      },
      titleContainer: {
        justifyContent: 'space-between',
        marginLeft: hp('1'),
        width: hp(25),
      },

      skillsText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        width: hp(25),
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
        flexDirection: 'row',
      },
      bottomTitle: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: hp(2),
      },
      titleName: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        paddingBottom: hp(1),
      },

      priceText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        marginRight: wp(4),
      },

      listItem: {
        flexGrow: 1,
        margin: 10,
        marginBottom: hp(1),
        width: wp(92),
        // height: hp('29'),
        alignSelf: 'center',
        // flexDirection: 'row',
        borderRadius: hp(2),
        borderWidth: hp('0.1'),
        backgroundColor: theme.color.textWhite,
        // borderBottomWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      title: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },

      header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: hp(2),
        // paddingHorizontal: wp(4),
        borderBottomWidth: hp('0.04'),
        borderColor: theme.color.dividerColor,
        marginBottom: hp(0.5),
      },
      checkboxContainer: {
        flexDirection: 'column',
        marginBottom: hp(0.5),
        marginLeft: hp(3),
      },
      checkbox: {
        alignSelf: 'center',
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
        width: wp(10),
        height: hp(3),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: hp(1),
        marginBottom: hp(5),
      },
      profileText: {
        color: 'white',
        paddingLeft: hp(1),
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
      onPress={props.onPressHeader}>
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
            <Text>{props.category}</Text>
            <Text style={styles.skillsText}>{props.skills}</Text>
          </View>
        </View>

        <View style={{justifyContent: 'flex-end'}}>
          <Text style={styles.priceText}>{props.price}</Text>
        </View>
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
        <Text style={styles.jobDescriptionTitle}>Job Description:</Text>
        <Text style={[styles.jobDescriptionText, props.conditionText]}>
          {props.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InProgressJobCard;
