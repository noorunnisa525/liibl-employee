import React, {useRef, useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRoute} from '@react-navigation/native';
import {
  resend_phone_verification_otp,
  verify_phone,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import Code from '../../components/CodeVerification';

import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import {wp} from '../../util';
function PhoneVerification({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [verifyCall, verifyResponse] = usePostApiMutation();
  const [resendOtPCall, resendOtpResponse] = usePostApiMutation();
  const [otpValue, setOtpValue] = useState();
  const token = useSelector(state => state.user.token);
  const route = useRoute();

  const {phoneNumber} = route.params;
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  const PhoneVerificationApi = async () => {
    let data = {
      OTP: otpValue,
      phone: phoneNumber,
    };
    let apiData = {
      url: verify_phone,
      data: data,
      method: 'POST',
      token: token,
    };
    try {
      let apiResponse = await verifyCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.reset({
          index: 1,
          routes: [{name: 'Login'}],
        });
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const resendPhoneOtpApi = async () => {
    let resendApiData = {
      phone: phoneNumber,
    };
    let apiData = {
      url: resend_phone_verification_otp,
      data: resendApiData,
      method: 'POST',
    };
    try {
      let apiResponse = await resendOtPCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  function verifyCode(value) {
    setOtpValue(value);
  }
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
              navigation.navigate('Login');
            }}>
            <MaterialIcons
              name={'keyboard-arrow-left'}
              size={wp(7)}
              color={'black'}
              onPress={() => {
                navigation.navigate('Login');
              }}
            />
          </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Phone Verification</Text>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            We have send an OTP code to your phone {'\n'}address. Please enter
            that code below to verify.
          </Text>
          <View style={styles.otpView}>
            <Code verifyCode={value => verifyCode(value)} />
          </View>
          <View style={styles.termsButton}>
            <Text style={styles.resend}>Haven't receive any code? </Text>
            <Button
              style={[styles.createButton, styles.resendText]}
              title1="Resend"
              onPress={() => resendPhoneOtpApi()}
              loading={resendOtpResponse.isLoading}
              loaderBlack
            />
          </View>
          <Button
            onPress={() => PhoneVerificationApi()}
            style={[styles.verifyButton, styles.text]}
            title1="Verify"
            loading={verifyResponse.isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default PhoneVerification;
