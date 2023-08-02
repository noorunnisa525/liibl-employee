import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Linking,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import FastImage from 'react-native-fast-image';
import {
  lockSvg as LockSvg,
  CardSvg,
  StarSvg,
  SettingSvg,
  ShieldSvg,
  TermServiceSvg,
  AccountLogoutSvg,
  AccountCloseModalSvg,
} from '../../../assets/Icons/Svgs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialogModal from '../../components/DialogModal';
import {hp} from '../../util';
import AccountCard from '../../components/AccountCard';
import {useDispatch} from 'react-redux';
import {onLogin, setEmployee} from '../../redux/slices/userSlice';
import CustomDropDown from '../../components/CustomDropdown';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import {baseUrl} from '../../constants';
import {
  get_skills,
  get_sub_categories,
  profile_visibility,
  profile_visible,
  update_profile,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {updateEmployee} from '../../redux/slices/userSlice';
import OneSignal from 'react-native-onesignal';
import ToggleSwitch from 'toggle-switch-react-native';
import ReactNativeModal from 'react-native-modal';

const Account = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const [openModal, setOpenModal] = useState(false);
  const [skillsModal, setSkillsModal] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openPref, setOpenPref] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const employeeData = useSelector(state => state.user.employeeData);
  const [skillsValue, setSkillsValue] = useState([]);
  const [preferencesValue, setPreferencesValue] = useState([]);
  const accessToken = useSelector(state => state.user.access_token);
  const [updateProfileCall, updateProfileResponse] = usePostApiMutation();
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [isEnabled, setIsEnabled] = useState(
    employeeData?.toggle === 1 ? true : false,
  );
  const [dialog, setDialog] = useState(false);
  const [webUri, setWebUri] = useState('');

  const [skillError, setSkillError] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);

  const [categoriesSkillsCall, categoriesSkillsResponse] =
    useParamApiMutation();
  const [subCategoriesCall, subCategoriesResponse] = useParamApiMutation();
  const [profileVisibilityCall, profileVisibilityResponse] =
    usePostApiMutation();
  const dispatch = useDispatch();

  const postProfileVisibility = async value => {
    setIsEnabled(prev => !prev);
    let visibleValue = value === true ? 1 : 0;
    let apiData = {
      url: profile_visibility,
      data: {profile_visible: visibleValue},
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await profileVisibilityCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(updateEmployee(apiResponse?.data?.user));
      } else {
        Snackbar.show({
          text: apiResponse?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const getCategoriesSkillsApi = async () => {
    setSkills([]);
    setSkillsValue([]);
    let categoryId = employeeData.category_id;
    let apiData = {
      url: get_skills,
      params: `category_id=${categoryId}`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let categoriesSkills = await categoriesSkillsCall(apiData).unwrap();
      if (categoriesSkills.statusCode == 200) {
        let tempSkills = categoriesSkills?.Data?.map(item => ({
          value: item.id,
          label: item.name,
        }));
        setSkills(tempSkills);
      } else {
        Snackbar.show({
          text: categoriesSkills?.message,
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

  const updateProfileApi = async () => {
    var apiValue = new FormData();

    skillsValue.forEach((item, index) => {
      let itemValue = skills.find(skill => skill.value == item);
      if (item !== null) {
        apiValue.append(`skills[${index}]`, itemValue?.label);
      }
    });
    preferencesValue.forEach((item, index) => {
      let itemValue = preferences.find(preference => preference.value == item);
      if (item !== null) {
        apiValue.append(`preferences[${index}]`, itemValue?.label);
      }
    });

    let apiData = {
      url: update_profile,
      data: apiValue,
      method: 'POST',
      token: accessToken,
    };
    try {
      let res = await updateProfileCall(apiData).unwrap();
      if (res.status == 200) {
        dispatch(setEmployee(res.data.user));
        navigation.navigate('Account');
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      setSkillsModal(false);
      setSuccessModal(true);
    } catch (e) {
      Snackbar.show({
        text: 'Network Error',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const getSubCategoriesApi = async () => {
    setPreferences([]);
    setPreferencesValue([]);
    let categoryId = employeeData.category_id;

    let apiData = {
      url: get_sub_categories,
      params: `category_id=${categoryId}`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getSubCategoryList = await subCategoriesCall(apiData).unwrap();
      if (getSubCategoryList.statusCode == 200) {
        let tempSubCategories = getSubCategoryList?.Data?.map(item => ({
          value: item.id,
          label: item.name,
        }));
        setPreferences(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
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

  useEffect(() => {
    getCategoriesSkillsApi();
    getSubCategoriesApi();
  }, []);

  useEffect(() => {
    if (employeeData?.skills && skills.length > 0) {
      let skillsArr = employeeData.skills.split(',');
      let intersection = skills.filter(x => skillsArr.includes(x.label));
      skillsArr = intersection.map(item => item.value);
      setSkillsValue(skillsArr);
    }
    if (employeeData?.preferences && preferences.length > 0) {
      let prfArray = employeeData.preferences.split(',');
      let intersection = preferences.filter(x => prfArray.includes(x.label));
      prfArray = intersection.map(item => item.value);
      setPreferencesValue(prfArray);
    }
  }, [employeeData, preferences, skills]);

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
        <View style={styles.profileContainer}>
          {employeeData?.image ? (
            <Image
              // resizeMode={FastImage.resizeMode.cover}
              style={styles.imgStyle}
              source={{
                uri: baseUrl.base + employeeData?.image,
              }}
            />
          ) : (
            <FastImage
              resizeMode="contain"
              style={styles.imgStyle}
              source={require('../../../assets/images/avatar-placeholder.png')}
            />
          )}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{employeeData.name}</Text>
            <Text style={styles.emailText}>{employeeData.email}</Text>
            <Button
              style={[styles.viewProfile, styles.viewProfileText]}
              title1="View Profile"
              onPress={() => {
                navigation.navigate('AccountViewProfile', {
                  employeeData: employeeData,
                });
              }}
            />
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}>
        <View style={styles.listItem}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.categoryText}>
              Profile Visibility to Business
            </Text>
          </View>
          <View style={styles.arrowRightView}>
            <ToggleSwitch
              isOn={isEnabled ? true : false}
              onColor="#000"
              offColor="#767577"
              size="small"
              onToggle={postProfileVisibility}
            />
          </View>
        </View>
        <AccountCard
          leftIcon={<LockSvg />}
          title={'Change Password'}
          onPress={() => {
            if (employeeData?.social_platform) {
              Snackbar.show({
                text: 'This is a social account. Cannot change password',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else {
              navigation.navigate('AccountChangePassword');
            }
          }}
        />
        <AccountCard
          leftIcon={<CardSvg />}
          title={'Skills and Preferences'}
          onPress={() => {
            setSkillsModal(true);
          }}
        />
        <AccountCard
          leftIcon={<StarSvg />}
          title={'Reviews'}
          onPress={() => {
            navigation.navigate('AccountReviewsScreen');
          }}
        />
        <AccountCard
          leftIcon={<SettingSvg />}
          title={'Settings'}
          onPress={() => {}}
        />
        <AccountCard
          leftIcon={<ShieldSvg />}
          title={'Privacy Policy'}
          onPress={() => {
            setDialog(true);
            setWebUri('https://liibl.stackup.solutions/privacy_policy');
          }}
        />
        <AccountCard
          leftIcon={<TermServiceSvg />}
          title={'Terms of Service'}
          onPress={() => {
            setDialog(true);
            setWebUri('https://liibl.stackup.solutions/terms-conditions');
          }}
        />
        <AccountCard
          leftIcon={<AccountLogoutSvg />}
          title={'Logout'}
          onPress={() => {
            setOpenModal(true);
          }}
        />
        <DialogModal
          visible={skillsModal}
          dialogStyle={styles.dialogStyle}
          children={
            <>
              <View style={styles.modalTitle}>
                <Text style={styles.SkillsTitle}>Skills And Preferences</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSkillsModal(false);
                  }}>
                  <Ionicons name={'close-circle-outline'} size={hp(4)} />
                </TouchableOpacity>
              </View>

              <Text style={styles.textFieldTitle}>Skills</Text>
              <CustomDropDown
                value={skillsValue}
                setValue={setSkillsValue}
                open={openSkills}
                multiple={true}
                style={styles.dropdownStyle}
                setOpen={setOpenSkills}
                items={skills}
                setItems={setSkills}
                placeholder={'Select Skills'}
                zIndex={5}
              />

              {skillError && (
                <Text style={styles.errorText}>Skills are required</Text>
              )}

              <Text style={styles.textFieldTitle}>Preferences</Text>
              <CustomDropDown
                value={preferencesValue}
                setValue={setPreferencesValue}
                open={openPref}
                multiple={true}
                style={styles.dropdownStyle}
                setOpen={setOpenPref}
                items={preferences}
                setItems={setPreferences}
                placeholder={'Select Preferences'}
                zIndex={2}
              />

              {preferenceError && (
                <Text style={styles.errorText}>Preferences are required</Text>
              )}

              <Button
                style={[styles.updateButton, styles.updateButtonText]}
                title1="Update"
                loading={updateProfileResponse.isLoading}
                onPress={() => {
                  if (skillsValue.length != 0 && preferencesValue.length != 0) {
                    updateProfileApi();
                  }
                  if (skillsValue.length == 0) {
                    setSkillError(true);
                  } else {
                    setSkillError(false);
                  }
                  if (preferencesValue.length == 0) {
                    setPreferenceError(true);
                  } else {
                    setPreferenceError(false);
                  }
                }}
              />
            </>
          }
        />
        <DialogModal
          visible={openModal}
          dialogStyle={styles.dialogStyle}
          children={
            <>
              <Image
                resizeMode="contain"
                style={styles.thumbStyle}
                source={require('../../../assets/images/tick-circle.png')}
              />
              <Text style={styles.responseText}>
                Are you sure you want to logout from the App?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Button
                  style={[styles.cancelModalButton, styles.modalText]}
                  title1="No"
                  onPress={() => setOpenModal(false)}
                />
                <Button
                  style={[styles.acceptModalButton, styles.modalText]}
                  title1="Yes"
                  onPress={() => {
                    setOpenModal(true);
                    dispatch(onLogin(false));
                    OneSignal.removeExternalUserId();
                  }}
                />
              </View>
            </>
          }
        />
        <DialogModal
          visible={successModal}
          dialogStyle={styles.dialogStyle}
          children={
            <>
              <Image
                resizeMode="contain"
                style={styles.thumbStyle}
                source={require('../../../assets/images/thumb.png')}
              />
              <Text style={styles.responseText}>
                Your skills and preferences are successfully updated!
              </Text>
              <Button
                style={[styles.responseButton, styles.text]}
                title1="OK"
                onPress={() => {
                  setSuccessModal(false);
                }}
              />
            </>
          }
        />
      </ScrollView>
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
};

export default Account;
