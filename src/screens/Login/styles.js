import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
      flexGrow: 1,
    },
    inputContainer: {
      flexGrow: 1,
      marginTop: hp(3),
    },
    headerText: {
      fontSize: theme.size.xLarge,
      color: theme.color.textWhite,
      fontFamily: theme.fontFamily.boldFamily,
      textAlign: 'center',
      marginVertical: hp(8),
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textWhite,
      backgroundColor: theme.color.textWhite,
    },
    headerColor: theme.color.textWhite,
    container: {
      flexGrow: 1,
      paddingHorizontal: hp(2),
      paddingBottom: hp(10),
      backgroundColor: theme.color.textWhite,
      justifyContent: 'space-between',
    },
    loginText: {
      fontSize: hp(3.5),
      fontFamily: theme.fontFamily.boldFamily,
      // marginTop: hp(5),
      paddingVertical: hp(2),
      alignSelf: 'center',
    },
    termsButton: {
      width: hp(100),
      height: hp(5),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      // backgroundColor: theme.color.dividerColor,
      backgroundColor: '#E5E5E5',
    },
    createButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: hp(2),
    },
    loggingText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.mediumFamily,
      alignSelf: 'center',
    },
    textFieldTitle: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.5),
      marginTop: hp(1),
      fontFamily: theme.fontFamily.boldFamily,
    },
    loginInputText: {
      fontSize: theme.size.xsmall,
      fontFamily: theme.fontFamily.mediumFamily,
    },
    loginSubText: {
      fontSize: theme.size.xsmall,
      alignSelf: 'center',
      marginTop: -hp(1.5),
    },
    socialText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(3),
      alignSelf: 'center',
    },
    socialTextFacebook: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(2),
      color: theme.color.textWhite,
      alignSelf: 'center',
    },
    termsText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textBlack,
      textDecorationLine: 'underline',
    },
    socialButton: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: wp(3),
      width: wp(40),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      borderColor: theme.color.dividerColor,
    },
    socialButtonFacebook: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: wp(3),
      width: wp(40),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      backgroundColor: '#1877F2',
      borderColor: '#1877F2',
    },
    headerImage: {
      width: hp(12),
      height: hp(10),
      alignSelf: 'center',
    },
    loginButton: {
      width: wp(88),
      height: hp(6.5),
      borderRadius: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: hp(0.01),
      borderColor: theme.color.textWhite,
      backgroundColor: theme.color.textBlack,
    },
    text: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
      color: theme.color.textWhite,
    },
    errorText: {
      fontSize: theme.size.xsmall,
      color: theme.color.textRed,
      marginHorizontal: wp(3),
      marginTop: hp(0.5),
    },
    forgotButton: {
      alignSelf: 'flex-end',
      marginTop: hp(1),
      marginBottom: hp(3.5),
      marginRight: hp(1),
    },
    forgotPasswordText: {
      fontSize: theme.size.medium,
      alignSelf: 'flex-end',
      fontFamily: theme.fontFamily.boldFamily,
      textDecorationLine: 'underline',
    },
    dashStyle: {
      fontSize: theme.size.medium,
      color: theme.color.dividerColor,
      alignSelf: 'center',
      marginTop: hp(2),
      marginBottom: hp(2),
    },
    optionText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
    },
    appleBtn: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(80),
      height: hp(6.5),
      borderRadius: hp(2),
      borderWidth: hp(0.1),
      backgroundColor: '#000',
      borderColor: '#000',
    },
    appleBtnText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.boldFamily,
      marginHorizontal: wp(2),
      color: theme.color.textWhite,
      alignSelf: 'center',
    },
    dividerView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginVertical: hp(2),
    },
    dividerStyle: {
      width: wp(28),
      alignSelf: 'center',
      borderWidth: wp(0.22),
      borderStyle: 'dashed',
      borderColor: theme.color.avatarColor,
    },
    iconSize: wp(6),
  });
  return styles;
};
export default createStyles;
