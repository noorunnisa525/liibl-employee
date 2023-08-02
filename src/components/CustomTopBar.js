import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import FastImage from 'react-native-fast-image';
import Text from './CustomText';
import Button from './CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedTab} from '../redux/slices/userSlice';
const CustomTopBar = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      taskCard: {
        alignSelf: 'center',
        height: hp(5),
        width: wp(90),
        flexDirection: 'row', // row
        alignItems: 'center',
        justifyContent: 'space-between', // center, space-around
        // paddingLeft: hp(5),
        borderWidth: hp(0.1),
        borderRadius: hp(5),
        borderColor: theme.color.dividerColor,
        overflow: 'hidden',
      },
      selectedText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textWhite,
        alignSelf: 'center',
      },
      UnSelectedText: {
        fontSize: theme.size.xsmall,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        alignSelf: 'center',
      },
      selectedTab: {
        backgroundColor: theme.color.textBlack,
        width: wp(24),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: hp(5),
        borderTopLeftRadius: hp(5),
      },
      selectedRightTab: {
        backgroundColor: theme.color.textBlack,
        width: wp(22),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderTopRightRadius: hp(5),
        borderBottomRightRadius: hp(5),
      },
      selectedMiddleTab: {
        backgroundColor: theme.color.textBlack,
        width: wp(20),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
      },
      selectedInProgress: {
        backgroundColor: theme.color.textBlack,
        width: wp(27),
        height: hp(5),
        paddingLeft: hp(1),
        paddingRight: hp(1),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
      },
      UnSelectedMiddleTab: {
        backgroundColor: theme.color.textWhite,
        width: wp(20),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: hp(5),
        borderTopLeftRadius: hp(5),
        borderColor: theme.color.dividerColor,
        borderTopWidth: hp(0.1),
        borderBottomWidth: hp(0.1),
      },
      UnselectedInProgress: {
        backgroundColor: theme.color.textWhite,
        width: wp(27),
        height: hp(5),
        paddingLeft: hp(1),
        paddingRight: hp(1),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: hp(5),
        borderTopLeftRadius: hp(5),
        borderColor: theme.color.dividerColor,
        borderTopWidth: hp(0.1),
        borderBottomWidth: hp(0.1),
      },
      UnSelectedTab: {
        backgroundColor: theme.color.textWhite,
        width: wp(24),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderBottomLeftRadius: hp(5),
        borderTopLeftRadius: hp(5),
        borderColor: theme.color.dividerColor,
        borderTopWidth: hp(0.1),
        borderBottomWidth: hp(0.1),
      },
      UnSelectedRightTab: {
        backgroundColor: theme.color.textWhite,
        width: wp(22),
        height: hp(5),
        // alignSelf: 'flex-start',
        justifyContent: 'center',
        borderBottomRightRadius: hp(5),
        borderTopRightRadius: hp(5),
        borderColor: theme.color.dividerColor,
        borderTopWidth: hp(0.1),
        borderBottomWidth: hp(0.1),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  const dispatch = useDispatch();
  const selectedTab = useSelector(state => state.user.selectedTab);
  return (
    <View style={[styles.taskCard, props.taskCardStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(setSelectedTab('Invited'))}
        style={
          selectedTab == 'Invited' ? styles.selectedTab : styles.UnSelectedTab
        }>
        <Text
          style={
            selectedTab == 'Invited'
              ? styles.selectedText
              : styles.UnSelectedText
          }>
          Invited
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(setSelectedTab('Active'))}
        style={
          selectedTab == 'Active'
            ? styles.selectedMiddleTab
            : styles.UnSelectedMiddleTab
        }>
        <Text
          style={
            selectedTab == 'Active'
              ? styles.selectedText
              : styles.UnSelectedText
          }>
          Active
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(setSelectedTab('InProgress'))}
        style={
          selectedTab == 'InProgress'
            ? styles.selectedInProgress
            : styles.UnselectedInProgress
        }>
        <Text
          style={
            selectedTab == 'InProgress'
              ? styles.selectedText
              : styles.UnSelectedText
          }>
          In progress
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => dispatch(setSelectedTab('completed'))}
        style={
          selectedTab == 'completed'
            ? styles.selectedRightTab
            : styles.UnSelectedRightTab
        }>
        <Text
          style={[
            {paddingRight: wp(2)},
            selectedTab == 'completed'
              ? styles.selectedText
              : styles.UnSelectedText,
          ]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomTopBar;
