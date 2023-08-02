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
    slider: {
      backgroundColor: 'red',
    },
    headerContainerStyle: {
      borderBottomColor: theme.color.textWhite,
      backgroundColor: theme.color.textWhite,
      height: hp(15),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    loginInputText: {
      fontSize: theme.size.xsmall,
      fontFamily: theme.fontFamily.mediumFamily,
    },
    subscriptionCard: {
      flex: 1,
      margin: 10,
      width: '95%',
      height: hp('32'),
      alignSelf: 'center',
      // flexDirection: 'row',
      borderRadius: hp(2),
      borderWidth: hp('0.1'),
      backgroundColor: theme.color.textWhite,
      // borderBottomWidth: hp('0.1'),
      borderColor: theme.color.dividerColor,
    },
    title: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      color: theme.color.textBlack,
    },
    textFieldTitle: {
      fontSize: theme.size.medium,
      textAlign: 'left',
      paddingLeft: hp(1.5),
      fontFamily: theme.fontFamily.boldFamily,
    },
    headerInitialText: {
      alignSelf: 'center',
      fontSize: hp(3),
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    subContainer: {
      height: hp(12),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: hp(2),
      alignItems: 'center',
      paddingBottom: hp(2),
    },
    headerColor: theme.color.textWhite,
    container: {
      flexGrow: 1,
      paddingHorizontal: hp(2),
      paddingRight: hp(3.5),
      paddingBottom: hp(5),
      backgroundColor: theme.color.textWhite,
      justifyContent: 'space-between',
    },

    dashStyle: {
      fontSize: theme.size.medium,
      color: theme.color.dividerColor,
      alignSelf: 'center',
      marginTop: hp(2),
      marginBottom: hp(2),
    },

    iconContainer: {
      width: hp(4),
      height: hp(4),
      borderColor: theme.color.dividerColor,
      borderWidth: hp(0.1),
      justifyContent: 'center',
      borderRadius: hp(1),
      alignItems: 'center',
      marginTop: hp(1),
      marginLeft: hp(1),
    },
    loginSubText: {
      fontSize: theme.size.small,
      alignSelf: 'center',
      textAlign: 'center',
    },
    checkBoxText: {
      fontSize: theme.size.xsmall,
      fontFamily: theme.fontFamily.mediumFamily,
      color: '#748B9B',
      paddingLeft: hp(1),
      marginTop: hp(0.5),
    },
    otpView: {
      width: '80%',
      height: hp(20),
      color: theme.color.textBlack,
    },

    optContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    filterButton: {
      width: hp(40),
      height: hp(6.5),
      borderRadius: hp(1),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: hp(0.01),
      borderColor: theme.color.textWhite,
      backgroundColor: theme.color.textBlack,
      marginTop: hp(10),
    },
    filterButtonText: {
      fontSize: theme.size.small,
      fontFamily: theme.fontFamily.semiBoldFamily,
      color: theme.color.textWhite,

      // marginHorizontal: wp(2),
    },
  });
  return styles;
};
export default createStyles;
