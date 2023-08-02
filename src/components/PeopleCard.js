import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Text from './CustomText';
import FastImage from 'react-native-fast-image';
const PeopleCard = props => {
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      namecontainer: {
        justifyContent: 'flex-start',
        padding: hp('2'),
      },
      nameText: {
        fontSize: theme.size.small,
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
      },

      expText: {
        fontFamily: theme.fontFamily.mediumFamily,
        color: theme.color.textGray,
        textAlign: 'right',
      },

      listItem: {
        margin: 10,
        width: '95%',
        height: hp(10),
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: hp(2.5),
        paddingLeft: hp(1.5),
        borderWidth: hp('0.1'),
        borderColor: theme.color.dividerColor,
      },
      viewProposals: {
        textDecorationLine: 'underline',
        fontFamily: theme.fontFamily.boldFamily,
        color: theme.color.textBlack,
        paddingRight: hp(2),
        paddingBottom: hp(4),
      },
      AwaitingResponse: {
        fontFamily: theme.fontFamily.semiBoldFamily,
        color: theme.color.textBlack,
        paddingRight: hp(2),
        paddingBottom: hp(4),
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.listItem, props.listStyle]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {props.img ? (
          <FastImage
            source={props.img}
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              backgroundColor: 'black',
            }}
          />
        ) : (
          <FastImage
            source={require('../components/ImagePicker/Icons/avatar-placeholder.jpg')}
            style={{
              width: 50,
              height: 50,
              borderRadius: 30,
              backgroundColor: 'black',
            }}
          />
        )}
        <View style={styles.namecontainer}>
          <Text style={styles.nameText}>{props.name}</Text>
          <Text>{props.category}</Text>
          <Text style={styles.expText}>{props.experience}</Text>
        </View>
      </View>
      {props.viewProposals && (
        <TouchableOpacity
          onPress={props.onPressProposal}
          disabled={props.JobInvite ? true : false}>
          {props.JobInvite ? (
            <Text style={styles.AwaitingResponse}>Awaiting Response</Text>
          ) : (
            <Text style={styles.viewProposals}>View Proposal</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PeopleCard;
