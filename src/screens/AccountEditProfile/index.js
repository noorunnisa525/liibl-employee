import {Formik} from 'formik';
import moment from 'moment';
import React, {useState} from 'react';
import {ScrollView, TouchableOpacity, View, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';
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
import Header from '../../components/LoggedInHeader';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/CustomButton';
import DialogModal from '../../components/DialogModal';
import {hp, wp} from '../../util';
import {useDispatch, useSelector} from 'react-redux';
import {baseUrl} from '../../constants';
import {update_profile} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {setEmployee} from '../../redux/slices/userSlice';
import Snackbar from 'react-native-snackbar';
import {useRoute} from '@react-navigation/native';

const AccountEditProfile = ({navigation}) => {
  const employeeData = useSelector(state => state.user.employeeData);
  const route = useRoute();
  const styles = useThemeAwareObject(createStyles);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [uri, setUri] = useState(
    employeeData?.image ? baseUrl.base + employeeData?.image : null,
  );

  const [date, setDate] = useState(
    moment(new Date(employeeData?.dob)).format('LL'),
  );
  const [aboutMe, setAboutMe] = useState(
    employeeData ? employeeData.about : null,
  );

  let address = employeeData?.address;
  let latitude = employeeData?.latitude;
  let longitude = employeeData?.longitude;
  if (route.params) {
    address = route.params.address;
    latitude = route.params.latitude;
    longitude = route.params.longitude;
  }

  const [errorCategory, setErrorCategory] = useState(false);
  const [dorpDownValue, setValue] = useState(employeeData?.gender);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(
    employeeData ? employeeData.address : null,
  );
  const [errorLocation, setErrorLocation] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [updateProfileCall, updateProfileResponse] = usePostApiMutation();
  const accessToken = useSelector(state => state.user.access_token);
  const [isChangedImage, setChangeImage] = useState(false);
  const dispatch = useDispatch();
  const loginValidationSchema = yup.object().shape({
    fullName: yup.string().required('Full name is required'),
    aboutMe: yup.string().required('About me is required'),
  });
  const onChange = ImageOrVideo => {
    setChangeImage(true);
    let obj = {};
    const newImageUri = 'file:/' + ImageOrVideo.path.split('file:///').join('');
    obj['uri'] = ImageOrVideo.path;
    obj['type'] = ImageOrVideo.mime;
    obj['name'] = newImageUri.split('/').pop();
    setUri(obj);
  };

  const [genderItem, setGenderItem] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);

  // api post updateProfile
  const updateProfileApi = async values => {
    var apiValue = new FormData();
    apiValue.append('name', values.fullName);
    if (isChangedImage) {
      apiValue.append('image', uri);
    }
    apiValue.append('dob', moment(date).format('YYYY-MM-DD'));
    apiValue.append('gender', dorpDownValue);
    apiValue.append('about', values.aboutMe);
    apiValue.append('address', address);
    apiValue.append('latitude', latitude);
    apiValue.append('longitude', longitude);
    let apiData = {
      url: update_profile,
      data: apiValue,
      method: 'POST',
      token: accessToken,
    };
    try {
      let res = await updateProfileCall(apiData).unwrap();
      if (res.status == 200) {
        setSuccessModal(true);
        dispatch(setEmployee(res.data.user));
      } else {
        Snackbar.show({
          text: res?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  return (
    <KeyboardAwareScrollView style={styles.mainContainer}>
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
          <Text style={styles.headerInitialText}>Edit Profile</Text>
        }
      />

      <View style={{flex: 1}}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="always">
          <ImageCropPicker
            onChange={onChange}
            uri={uri}
            profile={true}
            mediaType={true}
            setMediaOpen={setMediaOpen}
            camera={true}
            resizeMode={'cover'}
          />

          <View style={styles.memoryContainer}>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                fullName: employeeData.name,
                aboutMe: employeeData.about,
              }}
              onSubmit={values => {
                if (dorpDownValue && location) {
                  updateProfileApi(values);
                } else if (!dorpDownValue) {
                  setErrorCategory(true);
                } else {
                  setErrorLocation(true);
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
                  <Text style={styles.textFieldTitle}>Full Name</Text>
                  <CustomInputField
                    name="fullName"
                    maxLength={21}
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Full Name"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    // leftIcon={<FullNameSvg />}
                  />
                  {errors.fullName && touched.fullName && (
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  )}

                  <Text style={styles.textFieldTitle}>Date of Birth</Text>
                  <CustomDatePicker
                    inputStyle={styles.datePciekrView}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    calendar
                    value={date}
                    type="date"
                    setCurrentDate={setDate}
                    customDateView={styles.dateInput}
                    onChange={date => {
                      setDate(date);
                    }}
                    format={moment(date).format('DD-MM-YYYY')}
                    // profile={true}
                  />

                  <Text style={styles.textFieldTitle}>Gender</Text>

                  <CustomDropDown
                    value={dorpDownValue}
                    setValue={setValue}
                    open={open}
                    setOpen={setOpen}
                    style={styles.dropDownStyle}
                    items={genderItem}
                    setItems={setGenderItem}
                    placeholder={'Select Gender'}
                  />
                  {errorCategory && (
                    <Text style={styles.errorText}>Gender is required</Text>
                  )}

                  <Text style={styles.textFieldTitle}>About Me</Text>

                  <CustomInputField
                    name="aboutMe"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Type here..."
                    value={values.aboutMe}
                    onChangeText={handleChange('aboutMe')}
                    onBlur={handleBlur('aboutMe')}
                  />
                  {errors.aboutMe && touched.aboutMe && (
                    <Text style={styles.errorText}>{errors.aboutMe}</Text>
                  )}

                  <Text style={styles.textFieldTitle}>Address</Text>

                  <TouchableOpacity
                    style={styles.addressTouchField}
                    onPress={() => {
                      navigation.navigate('Address', {
                        login: true,
                      });
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
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{borderColor: 'lightgray'}}
                      placeholder="Add address"
                      editable={false}
                      value={address}
                      onChangeText={setLocation}
                      leftIcon={<LocationSvg />}
                    /> */}
                  </TouchableOpacity>
                  {errorLocation && (
                    <Text style={styles.errorText}>Location is required</Text>
                  )}
                  <Button
                    onPress={handleSubmit}
                    style={[styles.createBusinessProfileButton, styles.text]}
                    title1="Update Profile"
                    loading={updateProfileResponse.isLoading}
                  />
                </View>
              )}
            </Formik>
          </View>
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
                  Your profile has been successfully updated!
                </Text>
                <Button
                  style={[styles.responseButton, styles.text]}
                  title1="OK"
                  onPress={() => {
                    setSuccessModal(false);
                    navigation.navigate('Account');
                  }}
                />
              </>
            }
          />
        </KeyboardAwareScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AccountEditProfile;
