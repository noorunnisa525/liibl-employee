import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Button from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {usePostApiMutation} from '../../services/service';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomInputField from '../../components/CustomInputField';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  lockSvg as LockSvg,
  messageSvg as MessageSvg,
  eye as EyeOff,
  eyeOff as Eye,
  googleSvg as GoogleSvg,
} from '../../../assets/Icons/Svgs';
import {
  onLogin,
  setAccessToken,
  setEmployee,
  setToken,
} from '../../redux/slices/userSlice';
import {employee_login, google_login} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  LoginManager,
  GraphRequestManager,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import OneSignal from 'react-native-onesignal';
import appleAuth from '@invertase/react-native-apple-authentication';

function Login({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [loginCall, loginResponse] = usePostApiMutation();
  const [googleLoginCall, googleLoginResponse] = usePostApiMutation();
  const [facebookLoginCall, facebookLoginResponse] = usePostApiMutation();
  const [appleLoginCall, appleLoginResponse] = usePostApiMutation();
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(true);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email address is required'),
    password: yup
      .string()
      // .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  // api Login
  const LoginApi = async values => {
    let data = {
      email: values.email.toLowerCase(),
      password: values.password,
    };
    let apiData = {
      url: employee_login,
      data: data,
      method: 'POST',
    };
    try {
      let apiResponse = await loginCall(apiData).unwrap();
      if (apiResponse.status == 200) {
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
              let externalUserId = apiResponse?.data?.user?.email.toLowerCase(); // You will supply the external user id to the OneSignal SDK
              let oneSignalHash = apiResponse?.data?.oneSignalHash;
              OneSignal.setExternalUserId(externalUserId, oneSignalHash);
              dispatch(setAccessToken(apiResponse.data.access_token));
              dispatch(setEmployee(apiResponse.data.user));
              dispatch(onLogin(true));
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
      console.log('e', e);
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  //SocialLogin
  const googleLoginApi = async userInfo => {
    GoogleSignin.signOut();

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
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
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
      LoginManager.logOut();
    } catch (e) {
      LoginManager.logOut();
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
      console.log('error', error);
    }
  };

  const getResponseInfo = (error, result, info) => {
    if (error) {
      console.log('erorr response info', error);
    } else {
      facebookApi(result, info);
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
        <View style={{paddingVertical: 2}}>
          <Text style={styles.loginText}>Login</Text>
          <Text style={styles.loginSubText}>
            Enter your email and password to login
          </Text>
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              LoginApi(values);
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
                <TouchableOpacity
                  style={styles.forgotButton}
                  onPress={() => navigation.navigate('EmailSent')}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <Button
                  onPress={handleSubmit}
                  style={[styles.loginButton, styles.text]}
                  title1="Login"
                  loading={loginResponse.isLoading}
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
        </View>

        <View style={styles.termsButton}>
          <Text style={styles.loggingText}>Don't have an account? </Text>
          <Button
            style={[styles.createButton, styles.termsText]}
            title1="Create Account"
            onPress={() => navigation.replace('CreateAccount')}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Login;
