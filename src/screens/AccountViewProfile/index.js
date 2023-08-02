import React from 'react';
import {View, Image, TouchableOpacity, ScrollView} from 'react-native';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {
  viewProfileCall as ViewProfileCall,
  viewProfileEmail as ViewProfileEmail,
  viewProfileLocation as ViewProfileLocation,
  calenderSvg as CalenderSvg,
} from '../../../assets/Icons/Svgs';
import Button from '../../components/CustomButton';

import {hp, wp} from '../../util';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ViewProfileCard from '../../components/ViewProfileCard';
import {useRoute} from '@react-navigation/native';
import {baseUrl} from '../../constants';
import {useSelector} from 'react-redux';
const AccountViewProfile = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const route = useRoute();
  const employeeData = useSelector(state => state.user.employeeData);
  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        leftComponent={
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </TouchableOpacity>
        }
      />
      {/* <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusbar={styles.statusBar}
      />
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons
            name={'keyboard-arrow-left'}
            size={30}
            color={'black'}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: hp(5),
          }}>
          {employeeData?.image ? (
            <Image
              source={{
                uri: baseUrl.base + employeeData?.image,
              }}
              style={styles.profileImageStyle}
              resizeMode={'contain'}
            />
          ) : (
            <Image
              resizeMode="contain"
              style={styles.imgStyle}
              source={require('../../../assets/images/avatar-placeholder.png')}
            />
          )}
          <Text style={styles.employeeName}>{employeeData.name}</Text>
        </View>
        <View style={{width: '10%'}}></View>
      </View> */}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        {employeeData?.image ? (
          <Image
            source={{
              uri: baseUrl.base + employeeData?.image,
            }}
            style={styles.profileImageStyle}
          />
        ) : (
          <Image
            resizeMode="contain"
            style={styles.imgStyle}
            source={require('../../../assets/images/avatar-placeholder.png')}
          />
        )}
        <Text style={styles.employeeName}>{employeeData.name}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <Text style={styles.nameText}>About Me</Text>
        <Text style={styles.emailText}>{employeeData.about}</Text>
        <ViewProfileCard
          viewProposals
          name={'Email:'}
          category={employeeData.email}
          img={<ViewProfileEmail />}
        />
        <ViewProfileCard
          viewProposals
          name={'Phone Number:'}
          category={employeeData.phone}
          img={<ViewProfileCall />}
        />
        <ViewProfileCard
          viewProposals
          name={'Date of Birth:'}
          category={employeeData.dob}
          img={<CalenderSvg />}
        />
        <ViewProfileCard
          viewProposals
          name={'Location:'}
          category={employeeData.address}
          img={<ViewProfileLocation />}
        />
        <Button
          style={[styles.editProfileButton, styles.editProfileText]}
          title1="Edit Profile"
          onPress={() => {
            navigation.navigate('AccountEditProfile');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default AccountViewProfile;
