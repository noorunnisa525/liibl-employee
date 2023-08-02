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
import {useRoute} from '@react-navigation/native';
import {wp} from '../../util';

function EmailVerification({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isSelected, setSelection] = useState(false);
  // const route = useRoute();
  // const {emailSent} = route.params;
  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  return (
    <View style={styles.mainContainer}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
      />
      <View style={styles.subContainer}>
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
        <Text style={styles.headerInitialText}>Email Verification</Text>
        <View style={{width: '10%'}}></View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            We have sent an OTP code to your email {'\n'}address. Please enter
            that code below to verify.
          </Text>
          <View style={styles.optContainer}>
            <OTPInputView
              pinCount={6}
              style={styles.otpView}
              autoFocusOnLoad={false}
              ref={otpRef}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              codeInputFieldStyle={styles.underlineStyleBase}
              onCodeFilled={value => {}}
            />
            <View style={styles.termsButton}>
              <Text style={styles.resend}>Haven't receive any code? </Text>
              <Button
                style={[styles.createButton, styles.resendText]}
                title1="Resend"
                onPress={() => navigation.navigate('EmailVerification')}
              />
            </View>

            <Button
              onPress={() => {
                // if (emailSent === true) {
                //   navigation.navigate('ResetPassword');
                // } else {
                //   navigation.navigate('EditProfile');
                // }
              }}
              style={[styles.verifyButton, styles.text]}
              title1="Verify"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default EmailVerification;
