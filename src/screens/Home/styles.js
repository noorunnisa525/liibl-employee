import {StyleSheet} from 'react-native';
import {hp, wp} from '../../util';

const createStyles = theme => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.color.textWhite,
    },
    subContainer: {
      marginTop: hp(1),
      marginBottom: hp(2),
      height: hp(5),
      width: wp(100),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerInitialText: {
      fontSize: theme.size.extraMedium,
      color: theme.color.textBlack,
      fontFamily: theme.fontFamily.boldFamily,
    },
    emptyMessageStyle: {
      fontSize: theme.size.medium,
      marginTop: hp(1),
      fontFamily: theme.fontFamily.semiBoldFamily,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    headerLastText: {
      fontSize: theme.size.large,
      color: theme.color.backgroundColor,
      textAlign: 'center',
      fontFamily: theme.fontFamily.boldFamily,
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
    headerColor: theme.color.textWhite,
    addMemoryIcon: theme.color.backgroundColor,
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(1),
    },

    profileCardStyle: {
      borderRadius: hp(2),
      width: hp(22),
      height: hp(25),
      flexDirection: 'column',
      margin: hp(1),
      padding: hp(2),
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: hp(0.05),
    },
    homeText: {
      fontSize: theme.size.large,
    },
    newMemoryButton: {
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // padding: hp(2.75),
      width: wp(50),
      height: hp(7.5),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    newMemoryButtonText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
    },
    avatarImage: {marginRight: wp(5)},
    memoryContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: wp(0.5),
      width: wp(75),
      height: hp(20),
      borderRadius: theme.borders.radius3,
      borderColor: theme.color.headerBackgroundColor,
      // padding: hp(2),
      // marginBottom: hp(12),
    },
    profileImage: {
      marginBottom: hp(3),
    },
    firstMemoryText: {
      fontSize: theme.size.medium,
      fontFamily: theme.fontFamily.boldFamily,
      padding: hp(2),
    },
    dialogStyle: {
      backgroundColor: 'white',
      height: hp(45),
      width: wp(60),
      alignSelf: 'center',
    },
    contentStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    profileButton: {
      margin: hp(1),
      alignSelf: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: wp(40),
      height: hp(6),
      borderRadius: hp(5),
      borderWidth: hp(0.1),
      borderColor: theme.color.headerBackgroundColor,
    },
    modalCloseIcon: {justifyContent: 'flex-end', alignSelf: 'flex-end'},
    modalContentContainer: {
      justifyContent: 'space-between',
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationContainer: {padding: hp(1), marginRight: hp(1)},
    iconContainer: {
      flexDirection: 'row',
      height: hp(6),
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyListStyle: {justifyContent: 'center', alignItems: 'center', flex: 1},
    imageStyle: {
      backgroundColor: theme.color.dividerColor,
      width: wp(13),
      height: wp(13),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: hp(1.5),
      flexDirection: 'row',
    },
  });
  return styles;
};
export default createStyles;
