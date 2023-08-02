import {Formik} from 'formik';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {Keyboard, ScrollView, TouchableOpacity, View} from 'react-native';
import {ProgressStep, ProgressSteps} from 'react-native-progress-steps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  callSvg as CallSvg,
  FullNameSvg,
  locationSvg as LocationSvg,
} from '../../../assets/Icons/Svgs';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomDropDown from '../../components/CustomDropdown';
import CustomInputField from '../../components/CustomInputField';
import Text from '../../components/CustomText';
import ImageCropPicker from '../../components/ImagePicker/ImageCropPicker';
import ImageCropPickerModal from '../../components/ImagePickerModal/ImageCropPickerModal';
import Header from '../../components/LoggedInHeader';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  get_categories,
  get_skills,
  get_sub_categories,
  update_profile,
} from '../../services/api-confog';
import {useParamApiMutation, usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import {useRoute} from '@react-navigation/native';
import {hp, wp} from '../../util';
import {baseUrl} from '../../constants';
const EditProfile = ({navigation}) => {
  const route = useRoute();
  let address = null;
  let latitude = null;
  let longitude = null;
  if (route.params) {
    address = route.params.address;
    latitude = route.params.latitude;
    longitude = route.params.longitude;
  }
  const styles = useThemeAwareObject(createStyles);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [uri, setUri] = useState();

  const [socialIdUri, setSocialIdUri] = useState();
  const [open, setOpen] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openPref, setOpenPref] = useState(false);
  const [value, setValue] = useState();
  const [categoryValue, setCategoryValue] = useState(null);
  const [skillsValue, setSkillsValue] = useState([]);
  const [preferencesValue, setPreferencesValue] = useState([]);
  const [fullName, setFullName] = useState(route?.params?.name ?? '');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(address ?? '');
  const [phoneNumber, setPhoneNumber] = useState('+1');
  const [aboutMe, setAboutMe] = useState('');
  const [socialSecurityNo, setSocialSecurityNo] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [check, setCheck] = useState(false);
  const [categoriesCall, getCategoriesResponse] = usePostApiMutation();
  const [updateProfileCall, updateProfileResponse] = usePostApiMutation();
  const [categoriesSkillsCall, categoriesSkillsResponse] =
    useParamApiMutation();
  const [subCategoriesCall, subCategoriesResponse] = useParamApiMutation();
  const [activeStep, setActiveStep] = useState(false);
  const [socialCheck, setSocialCheck] = useState(false);
  const [otherInfoCheck, setOtherInfoCheck] = useState(false);
  const [checkBackButton, toggleBackButton] = useState(true);
  const [creatingCheck, setCreatingCheck] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [aboutError, setAboutError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [ssnError, setSsnError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [skillsError, setSkillsError] = useState(false);
  const [preferenceError, setPreferenceError] = useState(false);

  const token = useSelector(state => state.user.token);

  const onChange = ImageOrVideo => {
    let obj = {};
    const newImageUri = 'file:/' + ImageOrVideo.path.split('file:///').join('');
    obj['uri'] = ImageOrVideo.path;
    obj['type'] = ImageOrVideo.mime;
    obj['name'] = newImageUri.split('/').pop();
    setUri(obj);
  };
  const onChangeSocialID = ImageOrVideo => {
    let obj = {};
    const newImageUri = 'file:/' + ImageOrVideo.path.split('file:///').join('');
    obj['uri'] = ImageOrVideo.path;
    obj['type'] = ImageOrVideo.mime;
    obj['name'] = newImageUri.split('/').pop();
    setSocialIdUri(obj);
  };

  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState([]);

  const [genderItem, setGenderItem] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);

  // api post updateProfile
  const updateProfileApi = async values => {
    var apiValue = new FormData();
    apiValue.append('name', fullName);
    if (uri) {
      apiValue.append('image', uri);
    }

    apiValue.append('phone', phoneNumber);
    apiValue.append('dob', moment(date).format('YYYY-MM-DD'));
    apiValue.append('gender', value);
    apiValue.append('about', aboutMe);
    apiValue.append('address', address);
    apiValue.append('nic', socialIdUri);
    apiValue.append('ssn', socialSecurityNo);
    apiValue.append('job_title', jobTitle);
    apiValue.append('latitude', latitude);
    apiValue.append('longitude', longitude);
    apiValue.append('category_id', categoryValue);

    skillsValue.forEach((item, index) => {
      let itemValue = skills.find(skill => skill.value == item);
      if (item !== null) {
        apiValue.append(`skills[${index}]`, itemValue.label);
      }
    });
    preferencesValue.forEach((item, index) => {
      let itemValue = preferences.find(preference => preference.value == item);
      if (item !== null) {
        apiValue.append(`preferences[${index}]`, itemValue.label);
      }
    });

    let apiData = {
      url: update_profile,
      data: apiValue,
      method: 'POST',
      token: token,
    };
    try {
      let res = await updateProfileCall(apiData).unwrap();
      if (res.status == 200) {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setCreatingCheck(false);
        navigation.navigate('PhoneVerification', {phoneNumber: phoneNumber});
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
        setCreatingCheck(false);
      }
    } catch (e) {
      setCreatingCheck(false);
      console.log('Error', e);
    }
  };

  //api getCategories
  const getCategoriesApi = async () => {
    let apiData = {
      url: get_categories,
      method: 'GET',
    };
    try {
      let getCategoryList = await categoriesCall(apiData).unwrap();
      if (getCategoryList.statusCode == 200) {
        let tempCategory = getCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setItems(tempCategory);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const getCategoriesSkillsApi = async id => {
    setSkills([]);
    setSkillsValue([]);
    let apiData = {
      url: get_skills,
      params: `category_id=${id}`,
      method: 'GET',
      token,
    };
    try {
      let categoriesSkills = await categoriesSkillsCall(apiData).unwrap();
      if (categoriesSkills.statusCode == 200) {
        let tempSkills = categoriesSkills?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setSkills(tempSkills);
      } else {
        Snackbar.show({
          text: categoriesSkills?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  const getSubCategoriesApi = async id => {
    setPreferences([]);
    setPreferencesValue([]);
    let apiData = {
      url: get_sub_categories,
      params: `category_id=${id}`,
      method: 'GET',
      token,
    };
    try {
      let getSubCategoryList = await subCategoriesCall(apiData).unwrap();
      if (getSubCategoryList.statusCode == 200) {
        let tempSubCategories = getSubCategoryList?.Data?.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setPreferences(tempSubCategories);
      } else {
        Snackbar.show({
          text: getSubCategoryList?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  useEffect(() => {
    getCategoriesApi();
  }, []);
  const handleNextFirst = () => {
    toggleBackButton(false);
    setCheck(true);
    if (fullName?.length < 1) {
      setNameError(true);
    } else {
      setNameError(false);
    }
    if (
      phoneNumber?.length < 1 ||
      phoneNumber == '+1' ||
      phoneNumber.length < 2
    ) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
    if (aboutMe?.length < 1) {
      setAboutError(true);
    } else {
      setAboutError(false);
    }
    if (!value) {
      setGenderError(true);
    } else {
      setGenderError(false);
    }
    if (!address) {
      setAddressError(true);
    } else {
      setAddressError(false);
    }
    if (
      fullName?.length < 1 ||
      date.length < 1 ||
      aboutMe?.length < 1 ||
      phoneNumber?.length < 12 ||
      !address ||
      !value
    ) {
      setActiveStep(true);
    } else {
      setActiveStep(false);
    }
  };

  const handlePreviousSecond = () => {
    toggleBackButton(true);
  };
  const handleNextSecond = () => {
    toggleBackButton(false);
    setSocialCheck(true);
    if (socialSecurityNo.length < 1) {
      setSsnError(true);
    } else {
      setSsnError(false);
    }
    if (!socialIdUri) {
      setIdError(true);
    } else {
      setIdError(false);
    }
    if (socialIdUri == undefined || socialSecurityNo?.length < 1) {
      setActiveStep(true);
    } else {
      setActiveStep(false);
    }
  };
  const handlePreviousThird = () => {
    toggleBackButton(false);
  };
  const handleOtherInfo = () => {
    setOtherInfoCheck(true);
    if (jobTitle.length < 1) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (!categoryValue) {
      setCategoryError(true);
    } else {
      setCategoryError(false);
    }
    if (skillsValue.length == 0) {
      setSkillsError(true);
    } else {
      setSkillsError(false);
    }
    if (preferencesValue.length == 0) {
      setPreferenceError(true);
    } else {
      setPreferenceError(false);
    }
    if (
      jobTitle?.length < 1 ||
      !categoryValue ||
      skillsValue?.length == 0 ||
      preferencesValue?.length == 0
    ) {
      setActiveStep(true);
      setCreatingCheck(false);
    } else {
      setActiveStep(false);
      setCreatingCheck(true);
      updateProfileApi();
    }
  };
  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}>
      <Header
        placement={'center'}
        barStyle={'dark-content'}
        containerStyle={styles.headerContainerStyle}
        backgroundColor={styles.headerColor}
        statusBarProps={styles.headerColor}
        leftComponent={
          checkBackButton && (
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
          )
        }
        centerComponent={
          <Text style={styles.headerInitialText}>Add Profile Info</Text>
        }
      />

      <View style={{flex: 1}}>
        <ProgressSteps
          activeLabelColor={'#000000'}
          completedProgressBarColor={'#000000'}
          completedStepIconColor={'#000000'}
          activeStepNumColor={'#fff'}
          disabledStepNumColor={'#ebebe4'}
          activeStepIconBorderColor={'#000000'}>
          <ProgressStep
            label="Personal Info"
            onNext={handleNextFirst}
            nextBtnStyle={styles.nextButtonStyle}
            nextBtnTextStyle={styles.nextButtonTextStyle}
            nextBtnText={'Continue'}
            errors={activeStep}>
            <View>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always">
                <>
                  <ImageCropPicker
                    onChange={onChange}
                    uri={uri}
                    profile={true}
                    mediaType={true}
                    setMediaOpen={setMediaOpen}
                    camera={true}
                  />
                  <View style={styles.memoryContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textFieldTitle}>Full Name</Text>
                      <CustomInputField
                        name="fullName"
                        inputStyle={styles.loginInputText}
                        inputContainerStyle={{borderColor: 'lightgray'}}
                        placeholder="Enter Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        leftIcon={<FullNameSvg />}
                      />
                      {nameError && check && (
                        <Text style={styles.errorText}>
                          Full name is required
                        </Text>
                      )}
                      <Text style={styles.textFieldTitle}>Date of Birth</Text>
                      <CustomDatePicker
                        customDateView={{
                          marginBottom: hp(0),
                        }}
                        calendar
                        value={date}
                        type="date"
                        setCurrentDate={setDate}
                        onChange={date => {
                          setDate(date);
                        }}
                        maxDate={new Date()}
                        format={moment(date).format('DD-MM-YYYY')}
                      />

                      <Text style={styles.textFieldTitle}>Gender</Text>
                      <CustomDropDown
                        value={value}
                        setValue={value => {
                          setValue(value);
                        }}
                        style={styles.dropDownStyle}
                        open={open}
                        setOpen={setOpen}
                        items={genderItem}
                        setItems={setGenderItem}
                        placeholder={'Select Gender'}
                      />
                      {genderError && check && (
                        <Text style={styles.errorText}>Gender is required</Text>
                      )}
                      <Text style={styles.textFieldTitle}>About Me</Text>
                      <CustomInputField
                        name="aboutMe"
                        inputStyle={styles.loginInputText}
                        inputContainerStyle={{borderColor: 'lightgray'}}
                        placeholder="Type here..."
                        value={aboutMe}
                        onChangeText={txt => setAboutMe(txt)}
                      />
                      {aboutError && check && (
                        <Text style={styles.errorText}>
                          About description is required
                        </Text>
                      )}
                      <Text style={styles.textFieldTitle}>Phone</Text>
                      <CustomInputField
                        name="phoneNumber"
                        inputStyle={styles.loginInputText}
                        inputContainerStyle={{borderColor: 'lightgray'}}
                        placeholder="+0123435443"
                        value={phoneNumber}
                        keyboardType="phone-pad"
                        onChangeText={setPhoneNumber}
                        leftIcon={<CallSvg />}
                      />
                      {phoneError && check && (
                        <Text style={styles.errorText}>
                          Phone number is required
                        </Text>
                      )}
                      <Text style={styles.textFieldTitle}>Address</Text>
                      <TouchableOpacity
                        style={styles.addressTouchField}
                        onPress={() => {
                          navigation.navigate('Address');
                        }}>
                        <Text
                          style={
                            address
                              ? styles.addressInputField
                              : styles.addressPlaceholder
                          }>
                          {address ? address : 'Add Address'}
                        </Text>
                        {/* <CustomInputField
                          name="location"
                          inputStyle={styles.addressInputField}
                          inputContainerStyle={{borderColor: 'lightgray'}}
                          placeholder="Add address"
                          editable={false}
                          value={address}
                          onChangeText={setLocation}
                          leftIcon={<LocationSvg />}
                        /> */}
                      </TouchableOpacity>
                      {addressError && check && (
                        <Text style={styles.errorText}>
                          Address is required
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={{width: '10%'}}></View>
                </>
              </KeyboardAwareScrollView>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Social Info"
            errors={activeStep}
            onNext={handleNextSecond}
            onPrevious={handlePreviousSecond}
            nextBtnStyle={styles.nextButtonStyle2}
            nextBtnTextStyle={styles.nextButtonTextStyle}
            previousBtnStyle={styles.prevButtonStyle}
            previousBtnTextStyle={styles.prevButtonTextStyle}
            nextBtnText={'Continue'}
            previousBtnText={'Back'}>
            <View>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="always">
                <>
                  <View style={styles.socialProgressView}>
                    <Text style={styles.textFieldTitle}>Upload ID</Text>
                    <ImageCropPickerModal
                      onChange={onChangeSocialID}
                      uri={socialIdUri?.uri}
                      profile={true}
                      mediaType={true}
                      setMediaOpen={setMediaOpen}
                      camera={true}
                    />

                    {idError && socialCheck && (
                      <Text style={styles.socialErrorText}>
                        Please upload ID
                      </Text>
                    )}
                    <Text style={styles.textFieldTitle}>
                      Social security number (SSN)
                    </Text>
                    <CustomInputField
                      name="socialSecurityNumber"
                      inputStyle={styles.socialSecurityText}
                      inputContainerStyle={{borderColor: 'white'}}
                      placeholder="Enter Social Security number"
                      maxLength={4}
                      value={socialSecurityNo}
                      keyboardType="phone-pad"
                      onChangeText={setSocialSecurityNo}
                    />
                    {ssnError && socialCheck && (
                      <Text style={styles.socialErrorText}>
                        Social security number is required
                      </Text>
                    )}
                  </View>
                </>
              </KeyboardAwareScrollView>
            </View>
          </ProgressStep>
          <ProgressStep
            label="Other Info"
            onSubmit={handleOtherInfo}
            onPrevious={handlePreviousThird}
            nextBtnStyle={styles.nextButtonStyle2}
            nextBtnTextStyle={styles.nextButtonTextStyle}
            previousBtnStyle={styles.prevButtonStyle}
            previousBtnTextStyle={styles.prevButtonTextStyle}
            finishBtnText={creatingCheck ? 'Creating...' : 'Create'}
            errors={activeStep}
            previousBtnText={'Back'}>
            <KeyboardAwareScrollView
              contentContainerStyle={styles.container}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="always">
              <View style={styles.otherInfoProgressView}>
                <Text style={styles.textFieldTitle}>Job Title</Text>
                <CustomInputField
                  name="jobTitle"
                  inputStyle={styles.loginInputText}
                  inputContainerStyle={{borderColor: 'lightgray'}}
                  placeholder="Enter title"
                  value={jobTitle}
                  onChangeText={text => setJobTitle(text)}
                />
                {titleError && otherInfoCheck && (
                  <Text style={styles.otherErrorText}>Title is required</Text>
                )}
                <Text style={styles.textFieldTitle}>Category</Text>
                <CustomDropDown
                  value={categoryValue}
                  disable={getCategoriesResponse.isLoading}
                  setValue={setCategoryValue}
                  onChangeValue={id => {
                    getCategoriesSkillsApi(id);
                    getSubCategoriesApi(id);
                  }}
                  style={styles.dropDownStyle}
                  open={open}
                  setOpen={setOpen}
                  items={items}
                  setItems={setItems}
                  placeholder={'Select Category'}
                  zIndex={60}
                  zIndexInverse={40}
                />
                {categoryError && otherInfoCheck && (
                  <Text style={styles.otherErrorText}>
                    Category is required
                  </Text>
                )}
                <Text style={styles.textFieldTitle}>Skills</Text>
                <CustomDropDown
                  style={styles.dropDownStyle}
                  value={skillsValue}
                  setValue={setSkillsValue}
                  open={openSkills}
                  multiple={true}
                  setOpen={setOpenSkills}
                  items={skills}
                  setItems={setSkills}
                  placeholder={'Select Skills'}
                  zIndex={50}
                  zIndexInverse={50}
                />
                {skillsError && otherInfoCheck && (
                  <Text style={styles.otherErrorText}>Skills are required</Text>
                )}

                <Text style={styles.textFieldTitle}>Preferences</Text>
                <CustomDropDown
                  style={styles.dropDownStyle}
                  value={preferencesValue}
                  setValue={setPreferencesValue}
                  open={openPref}
                  multiple={true}
                  setOpen={setOpenPref}
                  items={preferences}
                  setItems={setPreferences}
                  placeholder={'Select Preferences'}
                  zIndex={40}
                  zIndexInverse={60}
                  dropDownContainerStyle={{
                    height:
                      preferences.length > 2
                        ? hp(14)
                        : preferences.length == 2
                        ? hp(10)
                        : hp(5),
                  }}
                />
                {preferenceError && otherInfoCheck && (
                  <Text style={styles.otherErrorText}>
                    Preferences are required
                  </Text>
                )}
              </View>
            </KeyboardAwareScrollView>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;
