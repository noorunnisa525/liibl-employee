import React, {useRef, useEffect} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomInputField from '../../components/CustomInputField';
import {callSvg as CallSvg} from '../../../assets/Icons/Svgs';
import {forgot_password} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useThemeAwareObject} from '../../theme/index';
import Snackbar from 'react-native-snackbar';
import {wp} from '../../util';

function EmailSent({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [verifyCall, verifyResponse] = usePostApiMutation();
  let emailSent = true;

  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  const loginValidationSchema = yup.object().shape({
    phoneNumber: yup.string().required('Phone number is required'),
  });

  // api forgotPassword
  const forgotPasswordApi = async values => {
    let data = {
      phone: values.phoneNumber,
    };
    let apiData = {
      url: forgot_password,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await verifyCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        navigation.navigate('OtpVerification', {
          data: data,
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
          <Text style={styles.headerInitialText}>Forgot Password</Text>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View>
          <Text style={styles.loginSubText}>
            Enter your phone number to reset your password.
          </Text>
          <View style={styles.optContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{phoneNumber: ''}}
              onSubmit={values => {
                forgotPasswordApi(values);
              }}
              validateOnBlur={false}
              validateOnChange={false}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.textFieldTitle}>Phone Number</Text>
                  <CustomInputField
                    name="phoneNumber"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter your phone number"
                    value={values.phoneNumber}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    keyboardType="phone-pad"
                    leftIcon={<CallSvg />}
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                  )}
                  <Button
                    onPress={handleSubmit}
                    style={[styles.loginButton, styles.text]}
                    title1="Send"
                    loading={verifyResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default EmailSent;
