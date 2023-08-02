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
  noFeatured as NoFeatured,
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
      appliedSkillsText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textWhite,
        width: hp(25),
      },
      nameText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        paddingLeft: hp(0.5),
      },
      appliedTime: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textWhite,
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
      appliedStyle: {
        backgroundColor: theme.color.dividerColor,
        borderColor: theme.color.avatarColor,
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
      appliedHeader: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: hp(2),
        // paddingHorizontal: wp(4),
        borderBottomWidth: hp('0.04'),
        borderColor: theme.color.textBlack,
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
        marginTop: hp(0.5),
      },
      appliedDescriptionText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textWhite,
        marginTop: hp(0.5),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.listItem,
        props.applied && styles.appliedStyle,
        props.subscriptionCard,
      ]}
      onPress={props.onPressHeader}>
      <View style={props.applied ? styles.appliedHeader : styles.header}>
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
            <Text
              style={
                props.applied ? styles.appliedSkillsText : styles.skillsText
              }>
              {props.skills}
            </Text>
          </View>
        </View>

        <View
          style={
            props?.featured
              ? {
                  justifyContent: 'space-between',
                }
              : {
                  justifyContent: 'flex-end',
                }
          }>
          {props?.featured && (
            <Image
              source={require('../../assets/images/Fire.png')}
              style={{height: hp(2.5), width: hp(2.5)}}
            />
          )}

          <Text style={styles.priceText}>{props.price}</Text>
        </View>
      </View>

      <View style={styles.nameContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CalenderSvg />
          <Text style={props.applied ? styles.appliedTime : styles.nameText}>
            {props.date}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ClockSvg />
          <Text style={props.applied ? styles.appliedTime : styles.nameText}>
            {props.time}
          </Text>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.jobDescriptionTitle}>Job Description:</Text>
        <Text
          numberOfLines={4}
          style={[
            props.applied
              ? styles.appliedDescriptionText
              : styles.jobDescriptionText,
            props.conditionText,
          ]}>
          {props.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default InProgressJobCard;
