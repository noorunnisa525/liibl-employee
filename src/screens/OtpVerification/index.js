import React, {useRef, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  forgot_password_verify_otp,
  resend_phone_verification_otp,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';
import CodeVerification from '../../components/CodeVerification';
import Code from '../../components/CodeVerification';
import {wp} from '../../util';

function OtpVerification({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isSelected, setSelection] = useState(false);
  const [verifyCall, verifyResponse] = usePostApiMutation();
  const [resendOtPCall, resendOtpResponse] = usePostApiMutation();
  const [otpValue, setOtpValue] = useState();
  const token = useSelector(state => state.user.token);
  const route = useRoute();
  const {data} = route.params;
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });
  const PhoneVerificationApi = async () => {
    const phoneVerifyData = {
      OTP: otpValue,
      phone: data?.phone,
    };
    let apiData = {
      url: forgot_password_verify_otp,
      data: phoneVerifyData,
      method: 'POST',
      token: token,
    };
    try {
      let apiResponse = await verifyCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        navigation.navigate('ResetPassword', {phone: data.phone});
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
  const resendPhoneOtpApi = async () => {
    let resendApiData = {
      phone: data?.phone,
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
        centerComponent={
          <Text style={styles.headerInitialText}>Otp Verification</Text>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            We have send an OTP code to your phone number. Please enter that
            code below to verify.
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

export default OtpVerification;
