import React, {useRef, useEffect, useState, useCallback} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
// import CustomDropDown from '../../components/CustomDropdown';
// import CustomRadioButtons from '../../components/CustomRadioButton';
import {Formik} from 'formik';
import * as yup from 'yup';
// import CustomInputField from '../../components/CustomInputField';
// import DateTimePicker from '../../components/CustomDatePicker';
import {hp, wp} from '../../util';
// import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';

function PostJobs({navigation}) {
  const otpRef = useRef();
  const styles = useThemeAwareObject(createStyles);
  const [open, setOpen] = useState(false);
  const [openRequiredSkills, setOpenRequiredSkills] = useState(false);
  const [openJobDuty, setOpenJobDuty] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [chosenOption, setChosenOption] = useState('hourly');
  const [value, setValue] = useState();
  const [requiredSkillsvValue, setRequiredSkillsvValue] = useState();
  const [jobDutyValue, setJobDutyValue] = useState();
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorSkills, setErrorSkills] = useState(false);
  const [errorDuty, setErrorDuty] = useState(false);
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [amount, setAmount] = useState();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [items, setItems] = useState([
    {label: 'Chef', value: 'Chef'},
    {label: 'Cleaner', value: 'Cleaner'},
    {label: 'Bartender', value: 'Bartender'},
    {label: 'Cook', value: 'Cook'},
  ]);
  const [subItem, setSubItem] = useState([
    {label: 'Baking chef', value: 'Baking chef'},
    {label: 'Washroom Cleaner', value: 'Washroom Cleaner'},
    {label: 'Publican Bartender', value: 'Publican Bartender'},
  ]);
  const [duties, setDuties] = useState([
    {label: 'washing', value: 'Washing'},
    {label: 'cleaning', value: 'Cleaning'},
    {label: 'punctuality', value: 'Punctuality'},
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    otpRef?.current?.focusField(0);
  });

  const options = [
    {label: 'Hourly', value: 'hourly'},
    {label: 'Pay Job', value: 'payJob'},
  ]; //will store our current user options

  const loginValidationSchema = yup.object().shape({
    jobTitle: yup.string().required('Job title is required'),
    jobDetails: yup.string().required('Job details is required'),
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
        <Text style={styles.headerInitialText}>Post A job</Text>
        <View style={{width: '10%'}}></View>
      </View>
      {/* <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <View style={styles.optContainer}>
          <>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{jobTitle: '', jobDetails: ''}}
              onSubmit={values => {
                if (
                  value ||
                  requiredSkillsvValue ||
                  jobDutyValue ||
                  startTime ||
                  endTime
                ) {
                  setErrorCategory(false);
                  setErrorSkills(false);
                  setErrorDuty(false);
                  setStartTimeError(false);
                  setEndTimeError(false);
                  setOpenSuccessModal(true);
                } else {
                  setErrorCategory(true);
                  setErrorSkills(true);
                  setErrorDuty(true);
                  setStartTimeError(true);
                  setEndTimeError(true);
                }
              }}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.textFieldTitle}>Job Title</Text>
                  <CustomInputField
                    name="jobTitle"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Job Title"
                    numberOfLines={1}
                    value={values.jobTitle}
                    onChangeText={handleChange('jobTitle')}
                  />
                  {errors.jobTitle && touched.jobTitle && (
                    <Text style={styles.errorText}>{errors.jobTitle}</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Job Category</Text>

                  <CustomDropDown
                    value={value}
                    setValue={value => {
                      setValue(value), setErrorCategory(false);
                    }}
                    open={open}
                    setOpen={setOpen}
                    items={items}
                    setItems={setItems}
                    zIndex={10}
                    placeholder={'Select Business Category'}
                  />
                  {errorCategory && (
                    <Text style={styles.errorText}>Value is required</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Job Details</Text>
                  <CustomInputField
                    name="jobDetails"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Job Description"
                    numberOfLines={1}
                    value={values.jobDetails}
                    onChangeText={handleChange('jobDetails')}
                  />
                  {errors.jobDetails && touched.jobDetails && (
                    <Text style={styles.errorText}>{errors.jobDetails}</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Required Skills</Text>

                  <CustomDropDown
                    value={requiredSkillsvValue}
                    setValue={value => {
                      setRequiredSkillsvValue(value), setErrorSkills(false);
                    }}
                    open={openRequiredSkills}
                    setOpen={setOpenRequiredSkills}
                    zIndex={7}
                    items={subItem}
                    setItems={setSubItem}
                    placeholder={'Select Business Category'}
                  />
                  {errorSkills && (
                    <Text style={styles.errorText}>Skills is required</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Job duty</Text>

                  <CustomDropDown
                    value={jobDutyValue}
                    setValue={value => {
                      setJobDutyValue(value), setErrorDuty(false);
                    }}
                    open={openJobDuty}
                    setOpen={setOpenJobDuty}
                    zIndex={5}
                    items={duties}
                    setItems={setDuties}
                    placeholder={'Select Business Category'}
                  />
                  {errorDuty && (
                    <Text style={styles.errorText}>Duty is required</Text>
                  )}
                  <Text style={styles.textFieldTitle}>Date </Text>

                  <DateTimePicker
                    value={date}
                    type="date"
                    setCurrentDate={setDate}
                  />

                  <Text style={styles.textFieldTitle}>Time</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'space-between',
                      // paddingLeft: hp(2),
                      marginRight: hp(2.5),
                    }}>
                    <View style={{flexDirection: 'column'}}>
                      <CustomInputField
                        name="startTime"
                        inputStyle={styles.customInput}
                        inputContainerStyle={styles.containerStyle}
                        placeholder="Enter Start Time"
                        numberOfLines={1}
                        value={startTime}
                        onChangeText={text => {
                          setStartTime(text), setStartTimeError(false);
                        }}
                        rightIcon={
                          <Ionicons
                            name="time"
                            color="lightgray"
                            size={hp(3)}
                          />
                        }
                      />
                      {startTimeError && (
                        <Text style={styles.errorText}>Time required</Text>
                      )}
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <CustomInputField
                        name="EndTime"
                        inputStyle={styles.customInput}
                        inputContainerStyle={styles.containerStyle}
                        placeholder="Enter End Time"
                        numberOfLines={1}
                        value={endTime}
                        onChangeText={text => {
                          setEndTime(text), setEndTimeError(false);
                        }}
                        rightIcon={
                          <Ionicons
                            name="time"
                            color="lightgray"
                            size={hp(3)}
                          />
                        }
                      />
                      {endTimeError && (
                        <Text style={styles.errorText}>Time required</Text>
                      )}
                    </View>
                  </View>

                  <Text style={styles.textFieldTitle}>Job Type</Text>

                  <CustomRadioButtons
                    options={options}
                    setChosenOption={setChosenOption}
                  />
                  <Text style={styles.textFieldTitle}>Amount </Text>

                  <CustomInputField
                    name="Amount"
                    inputStyle={styles.loginInputText}
                    inputContainerStyle={{borderColor: 'lightgray'}}
                    placeholder="Enter Amount"
                    numberOfLines={2}
                    keyboardType={'numeric'}
                    multiline={true}
                    value={amount}
                    onChangeText={text => {
                      setAmount(text);
                    }}
                  />
                  <Button
                    style={[styles.postJobButton, styles.postJobButtonText]}
                    title1="Post Job"
                    onPress={handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </>
          <DialogModal
            visible={openSuccessModal}
            dialogStyle={styles.dialogStyle}
            children={
              <>
                <FastImage
                  resizeMode="contain"
                  style={styles.thumbStyle}
                  source={require('../../../assets/images/thumb.png')}
                />
                <Text style={styles.responseText}>
                  Congrats! Your job post a successfully {'\n'}will let you
                  posted.
                </Text>
                <Button
                  style={[styles.responseButton, styles.postJobButtonText]}
                  title1=OK"
                  onPress={() => {
                    setOpenSuccessModal(false), navigation.navigate('Home');
                  }}
                />
              </>
            }
          />
        </View>
      </ScrollView> */}
    </View>
  );
}

export default PostJobs;
