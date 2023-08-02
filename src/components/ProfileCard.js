import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import FastImage from 'react-native-fast-image';
import Text from './CustomText';
import Button from './CustomButton';
const ProfileCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      avatarImage: {
        marginRight: wp(5),
      },

      options: {
        backgroundColor: theme.color.textWhite,
        flexDirection: 'row',
      },
      option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        height: hp(7),
        width: hp(7),
        borderRadius: hp(7),
        alignSelf: 'center',
        backgroundColor: theme.color.textBlack,
        // padding: 20,
      },
      TextContainer: {
        justifyContent: 'space-between',
        margin: hp(0.75),
        padding: hp(0.75),
        backgroundColor: 'trasnparent',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        // top: 0,
      },
      taskCard: {
        borderRadius: hp(2),
        width: wp(36),
        height: hp(25),
        flexDirection: 'column',
        margin: hp(1),
        padding: hp(2),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: hp(0.05),
      },
      container: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colors.accent,
        marginBottom: 2,
      },
      memoryText: {
        // fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
        // color: 'red',
      },
      nameText: {
        fontSize: theme.size.medium,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        textAlign: 'center',
        // color: 'red',
      },
      categoryText: {
        fontSize: theme.size.small,
        color: theme.color.textBlack,
        // marginBottom: hp(2),
        textAlign: 'center',

        // color: 'red',
      },
      experienceText: {
        fontSize: theme.size.small,
        color: theme.color.dividerColor,
        textAlign: 'center',
        fontFamily: theme.fontFamily.mediumFamily,
        // color: 'red',
      },
      overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: hp(2),
        backgroundColor: 'lightgray',
        opacity: 0.3,
      },
      socialButtonFacebook: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: wp(3),
        width: wp(30),
        height: hp(4),
        borderRadius: hp(2),
        borderWidth: hp(0.1),
        backgroundColor: theme.color.dividerColor,
        borderColor: theme.color.dividerColor,
      },
      socialTextFacebook: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        alignSelf: 'center',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.taskCard, props.taskCardStyle]}>
      <FastImage
        resizeMode="contain"
        style={[styles.avatar, props.imgStyle]}
        // imageStyle={{borderRadius: 50}}
        {...props}
        source={props.img}
      />
      <View>
        <Text style={[styles.nameText, props.name]}>{props.name}</Text>
        <Text style={[styles.categoryText, props.category]}>
          {props.category}
        </Text>
        <Text style={[styles.experienceText, props.experience]}>
          {props.experience}
        </Text>
      </View>
      <Button
        style={[styles.socialButtonFacebook, styles.socialTextFacebook]}
        title1="View Details "
        onPress={props.onPressButton}
      />
    </View>
  );
};

export default ProfileCard;
