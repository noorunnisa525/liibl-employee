import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import createStyles from './styles';
// import {usePostApiMutation} from '../../services/service';
// import Dash from 'react-native-dash';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomInputField from '../../components/CustomInputField';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import {WebView} from 'react-native-webview';
import ReactNativeModal from 'react-native-modal';
import {
  lockSvg as LockSvg,
  messageSvg as MessageSvg,
  eye as EyeOff,
  eyeOff as Eye,
  googleSvg as GoogleSvg,
} from '../../../assets/Icons/Svgs';
import {usePostApiMutation} from '../../services/service';
import {create_account, google_login} from '../../services/api-confog';
import {
  onLogin,
  setAccessToken,
  setEmployee,
  setToken,
} from '../../redux/slices/userSlice';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  AccessToken,
  GraphRequest,
  LoginManager,
  GraphRequestManager,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import OneSignal from 'react-native-onesignal';
import appleAuth from '@invertase/react-native-apple-authentication';

function CreateAccount({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const [isSelected, setSelection] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [webUri, setWebUri] = useState('');
  const [createAccountCall, createAccountResponse] = usePostApiMutation();
  const [googleLoginCall, googleLoginResponse] = usePostApiMutation();
  const [facebookLoginCall, facebookLoginResponse] = usePostApiMutation();
  const [appleLoginCall, appleLoginResponse] = usePostApiMutation();
  const dispatch = useDispatch();
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email address is required'),
    password: yup
      .string()
      .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
      .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
      .matches(/\d/, 'Password must have a number')
      .matches(
        /[!@#$%^&*()\-_"=+{}; :,<.>]/,
        'Password must have a special character',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password')], 'Password does not match'),
  });

  //SocialLogin
  const googleLoginApi = async userInfo => {
    let data = {
      email: userInfo?.user?.email.toLowerCase(),
      name: userInfo?.user?.name,
      type: 'employee',
    };
    let apiData = {
      url: google_login,
      data: data,
      method: 'POST',
    };

    try {
      let apiResponse = await googleLoginCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setToken(apiResponse.data.access_token));
        if (apiResponse.data.user?.type == 'employee') {
          if (apiResponse.data.user.phone == null) {
            navigation.navigate('EditProfile', {
              name: apiResponse.data.user.name,
              profileImage: apiResponse.data.user.image,
            });
          } else if (apiResponse.data?.user?.phone_verified_at == null) {
            navigation.navigate('PhoneVerification', {
              phoneNumber: apiResponse.data.user.phone,
            });
          } else {
            if (apiResponse.data.user.admin_verify == 'active') {
              dispatch(setAccessToken(apiResponse.data.access_token));
              dispatch(setEmployee(apiResponse.data.user));
              dispatch(onLogin(true));
              let externalUserId = apiResponse.data.user.email.toLowerCase(); // You will supply the external user id to the OneSignal SDK
              let oneSignalHash = apiResponse.data.oneSignalHash;
              OneSignal.setExternalUserId(externalUserId, oneSignalHash);
            } else {
              Snackbar.show({
                text: 'Please wait for your account to be approved from admin',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        } else {
          Snackbar.show({
            text: apiResponse?.message,
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      } else {
        Snackbar.show({
          text: 'This email is associated with Business Account',
          duration: Snackbar.LENGTH_LONG,
        });
      }
    } catch (e) {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  const GoogleSignIn = async () => {
    GoogleSignin.signOut();
    GoogleSignin.configure({
      androidClientId:
        '620431580762-14plc7prdqr760gjkgaggrrl410gqj0n.apps.googleusercontent.com',
      webClientId:
        '620431580762-ouabh1v8et4r4qpsi2luh57u9r3qp1us.apps.googleusercontent.com',
      iosClientId:
        '620431580762-kf8n20gf3ihl4glcg9desrtq7mijikc3.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      googleLoginApi(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
      GoogleSignin.signOut();
    }
  };
  // api Create account
  const createAccountApi = async values => {
    let data = {
      email: values.email.toLowerCase(),
      password: values.password,
      confirm_password: values.confirmPassword,
    };
    let apiData = {
      url: create_account,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await createAccountCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        dispatch(setToken(apiResponse.data.access_token));
        navigation.navigate('EditProfile');
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

  const facebookLogin = async () => {
    LoginManager.logOut();
    try {
      const results = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
        'user_friends',
      ]);

      if (Platform.OS === 'ios') {
        const result =
          await AuthenticationToken.getAuthenticationTokenIOS().then(data => {
            const processRequest = new GraphRequest(
              '/me?fields=name,email',
              null,
              (err, res) =>
                getResponseInfo(err, res, result?.authenticationToken),
            ); // Start the graph request.
            new GraphRequestManager().addRequest(processRequest).start();
          });
      } else {
        if (!results.isCancelled) {
        }
        const result = AccessToken.getCurrentAccessToken().then(data => {
          const processRequest = new GraphRequest(
            '/me?fields=name,picture.type(large),email',
            null,
            (err, res) =>
              getResponseInfo(err, res, data.accessToken.toString()),
          ); // Start the graph request.
          new GraphRequestManager().addRequest(processRequest).start();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getResponseInfo = (error, result, info) => {
    if (error) {
      console.log('Error fetching data:', error);
    } else {
      facebookApi(result, info);
    }
  };

  const facebookApi = async (userInfo, info) => {
    let data = {
      email: userInfo?.email.toLowerCase(),
      name: userInfo?.name,
      type: 'employee',
    };
    let apiData = {
      url: google_login,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await facebookLoginCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setToken(apiResponse.data.access_token));
        if (apiResponse.data.user?.type == 'employee') {
          if (apiResponse.data.user.phone == null) {
            navigation.navigate('EditProfile', {
              name: apiResponse.data.user.name,
              profileImage: apiResponse.data.user.image,
            });
          } else if (apiResponse.data?.user?.phone_verified_at == null) {
            navigation.navigate('PhoneVerification', {
              phoneNumber: apiResponse.data.user.phone,
            });
          } else {
            if (apiResponse.data.user.admin_verify == 'active') {
              dispatch(setAccessToken(apiResponse.data.access_token));
              dispatch(setEmployee(apiResponse.data.user));
              dispatch(onLogin(true));
              let externalUserId = apiResponse.data.user.email.toLowerCase(); // You will supply the external user id to the OneSignal SDK
              let oneSignalHash = apiResponse.data.oneSignalHash;
              OneSignal.setExternalUserId(externalUserId, oneSignalHash);
            } else {
              Snackbar.show({
                text: 'Please wait for your account to be approved from admin',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        } else {
          Snackbar.show({
            text: 'This email is associated with Business Account',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      LoginManager.logOut();
    } catch (e) {
      console.log('e', e);
      LoginManager.logOut();
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const appleLogin = async () => {
    const appleAuthRequestResponse = await appleAuth
      .performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      .then(async appleAuthResponse => {
        let data = {
          name:
            appleAuthResponse?.fullName.givenName +
            appleAuthResponse?.fullName.familyName,
          email: appleAuthResponse.email?.toLowerCase(),
          apple_id: appleAuthResponse.user,
          is_apple: 'apple',
          type: 'employee',
        };
        let apiData = {
          url: google_login,
          method: 'POST',
          data: data,
        };
        appleApi(apiData);
      })
      .catch(e => {
        console.log('e', e);
      });
  };

  const appleApi = async apiData => {
    try {
      let apiResponse = await appleLoginCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setToken(apiResponse?.data?.access_token));
        if (apiResponse.data.user?.type == 'employee') {
          if (apiResponse.data.user.phone == null) {
            navigation.navigate('EditProfile', {
              name: apiResponse.data.user.name,
              profileImage: apiResponse.data.user.image,
            });
          } else if (apiResponse.data?.user?.phone_verified_at == null) {
            navigation.navigate('PhoneVerification', {
              phoneNumber: apiResponse.data.user.phone,
            });
          } else {
            if (apiResponse.data.user.admin_verify == 'active') {
              dispatch(setAccessToken(apiResponse?.data?.access_token));
              dispatch(setEmployee(apiResponse.data.user));
              dispatch(onLogin(true));
              let externalUserId = apiResponse.data.user.email.toLowerCase(); // You will supply the external user id to the OneSignal SDK
              let oneSignalHash = apiResponse.data.oneSignalHash;
              OneSignal.setExternalUserId(externalUserId, oneSignalHash);
            } else {
              Snackbar.show({
                text: 'Please wait for your account to be approved from admin',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          }
        } else {
          Snackbar.show({
            text: 'This email is associated with Business Account',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
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
        centerComponent={
          <Image
            source={require('../../../assets/images/lybl.png')}
            style={styles.headerImage}
            resizeMode={'contain'}
          />
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <Text style={styles.SignUpText}>Create Account</Text>
        <Text style={styles.signupSubText}>
          Enter the info below to Create Account
        </Text>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{email: '', password: '', confirmPassword: ''}}
          onSubmit={values => {
            if (isSelected) {
              createAccountApi(values);
            } else {
              Snackbar.show({
                text: 'Please accept terms and conditions',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
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
          }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.textFieldTitle}>Email</Text>
              <CustomInputField
                name="email"
                keyboardType={'email-address'}
                inputStyle={styles.loginInputText}
                inputContainerStyle={{borderColor: 'lightgray'}}
                placeholder="Email Address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                leftIcon={<MessageSvg />}
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <Text style={styles.textFieldTitle}>Password</Text>
              <CustomInputField
                name="password"
                inputStyle={styles.loginInputText}
                inputContainerStyle={{borderColor: 'lightgray'}}
                placeholder="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry={passwordVisible}
                leftIcon={<LockSvg />}
                rightIcon={
                  passwordVisible ? (
                    <Eye
                      onPressSvg={() => setPasswordVisible(!passwordVisible)}
                    />
                  ) : (
                    <EyeOff
                      onPressSvg={() => setPasswordVisible(!passwordVisible)}
                    />
                  )
                }
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <Text style={styles.textFieldTitle}>Confirm Password</Text>

              <CustomInputField
                name="confirmPassword"
                inputStyle={styles.loginInputText}
                inputContainerStyle={{borderColor: 'lightgray'}}
                placeholder="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={confirmPasswordVisible}
                leftIcon={<LockSvg />}
                rightIcon={
                  confirmPasswordVisible ? (
                    <Eye
                      onPressSvg={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    />
                  ) : (
                    <EyeOff
                      onPressSvg={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                    />
                  )
                }
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={isSelected}
                  boxType="square"
                  onValueChange={setSelection}
                  style={styles.checkbox}
                  tintColors={{true: 'black', false: 'black'}}
                />
                <Text style={styles.termsTextt}>
                  I agree to{' '}
                  <Text
                    onPress={() => {
                      setDialog(true);
                      setWebUri(
                        'https://liibl.stackup.solutions/terms-conditions',
                      );
                    }}
                    style={styles.linkText}>
                    Terms & Conditions
                  </Text>{' '}
                  and{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => {
                      setDialog(true);
                      setWebUri(
                        'https://liibl.stackup.solutions/privacy_policy',
                      );
                    }}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
              {/* {!isSelected && (
                <Text style={styles.errorText}>this is required</Text>
              )} */}
              <Button
                onPress={handleSubmit}
                style={[styles.loginButton, styles.text]}
                title1="Continue"
                loading={createAccountResponse.isLoading}
              />
              <View style={styles.dividerView}>
                <View style={styles.dividerStyle} />
                <Text style={styles.optionText}> Or Sign Up with </Text>
                <View style={styles.dividerStyle} />
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.socialButtonContainer}>
          <Button
            style={[styles.socialButton, styles.socialText]}
            title1="Google"
            onPress={GoogleSignIn}
            loaderBlack
            svg={<GoogleSvg />}
            loading={googleLoginResponse.isLoading}
          />
          <Button
            style={[styles.socialButtonFacebook, styles.socialTextFacebook]}
            title1="Facebook "
            icon={'facebook'}
            iconColor={'white'}
            onPress={facebookLogin}
            loading={facebookLoginResponse.isLoading}
          />
        </View>
        {Platform.OS == 'ios' && (
          <Button
            style={[styles.appleBtn, styles.appleBtnText]}
            // title1={
            //   <Icon name="apple" color="white" size={styles.iconSize} />
            // }
            icon={'apple'}
            iconColor={'white'}
            title1="Apple"
            loading={appleLoginResponse.isLoading}
            onPress={appleLogin}
          />
        )}
        <View style={styles.termsButton}>
          <Text style={styles.loggingText}>Already have an account? </Text>
          <Button
            style={[styles.createButton, styles.termsText]}
            title1="Login"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
        {/* <Button
          style={[styles.termsButton, styles.loggingText, styles.t]}
          title1="Already have an account? "
          title2="Login"
          onPress={() => navigation.navigate('Login')}
        /> */}
      </KeyboardAwareScrollView>
      <ReactNativeModal
        isVisible={dialog}
        onBackdropPress={() => setDialog(false)}
        onBackButtonPress={() => setDialog(false)}
        onRequestClose={() => setDialog(false)}
        hasBackdrop
        backdropOpacity={0.7}
        backdropColor="rgb(0,0,0)"
        style={styles.webModal}>
        <WebView source={{uri: webUri}} startInLoadingState />
      </ReactNativeModal>
    </View>
  );
}

export default CreateAccount;
