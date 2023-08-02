import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Button from '../../components/CustomButton';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DialogModal from '../../components/DialogModal';
import FastImage from 'react-native-fast-image';
import {hp, wp} from '../../util';
import {
  calenderSvg as CalenderSvg,
  clockSvg,
  clockSvg as ClockSvg,
  noFeatured as NoFeatured,
} from '../../../assets/Icons/Svgs';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInputField from '../../components/CustomInputField';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {send_proposal, view_job_details} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useSelector} from 'react-redux';
import {baseUrl} from '../../constants';

function JobDetails({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const route = useRoute();
  const {item} = route.params;
  const [apply, setApply] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const [isSelected, setSelection] = useState(false);
  const [sendProposalCall, sendProposalResponse] = usePostApiMutation();
  const [proposalError, setProposalError] = useState(false);
  const [appliedButton, setAppliedButton] = useState(true);
  const accessToken = useSelector(state => state.user.access_token);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [viewDetailsCall, viewDetailsResponse] = usePostApiMutation();
  const [inviteJobDetailsData, setInviteJoBDetails] = useState();

  useEffect(() => {
    viewJobDetailsApi();
  }, []);

  const sendProposalApi = async () => {
    let data = {
      job_id: item?.id,
      description: proposal,
    };
    let apiData = {
      url: send_proposal,
      data: data,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await sendProposalCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        setApply(false), setSuccessModal(true);
        setAppliedButton(false);
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

  const viewJobDetailsApi = async () => {
    let apiData = {
      url: view_job_details + `${item?.id}`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let apiResponse = await viewDetailsCall(apiData).unwrap();
      if (apiResponse.statusCode == 200) {
        setInviteJoBDetails(apiResponse?.Data);
      } else {
        Snackbar.show({
          text: apiResponse?.Message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
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
          <Text style={styles.headerInitialText}>Job Details</Text>
        }
      />

      <View style={styles.container}>
        {viewDetailsResponse.isLoading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.listItem}
              showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.imgStyle}>
                    <Image
                      source={
                        inviteJobDetailsData?.business?.image
                          ? {
                              uri:
                                baseUrl.base +
                                '/' +
                                inviteJobDetailsData?.business?.image,
                            }
                          : require('../../../assets/images/avatar-placeholder.png')
                      }
                      style={styles.imageStyle}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                      {inviteJobDetailsData?.title}
                    </Text>
                    <Text style={styles.categoryTitle}>
                      {inviteJobDetailsData?.category?.name}
                    </Text>
                    <Text style={styles.skillsText} numberOfLines={2}>
                      {inviteJobDetailsData?.sub_categories}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    inviteJobDetailsData?.is_featured
                      ? styles.priceViewWithSvg
                      : styles.priceView
                  }>
                  {Boolean(inviteJobDetailsData?.is_featured) && (
                    <Image
                      source={require('../../../assets/images/Fire.png')}
                      style={{height: hp(2.5), width: hp(2.5)}}
                    />
                  )}
                  <Text style={styles.priceText}>
                    {'$' + inviteJobDetailsData?.amount}
                  </Text>
                </View>
              </View>
              <View style={styles.postedByView}>
                <Text style={styles.postedByText}>Job Posted By</Text>
                <TouchableOpacity
                  style={styles.postedByInnerView}
                  onPress={() => {
                    navigation.navigate('ViewBusinessProfile', {
                      item: inviteJobDetailsData,
                    });
                  }}>
                  <Image
                    source={
                      inviteJobDetailsData?.business?.image
                        ? {
                            uri:
                              baseUrl.base +
                              '/' +
                              inviteJobDetailsData?.business?.image,
                          }
                        : require('../../../assets/images/avatar-placeholder.png')
                    }
                    style={styles.postedImageStyle}
                    resizeMode={'cover'}
                  />
                  <Text style={styles.postedByInnerText}>
                    {inviteJobDetailsData?.business?.name}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.nameContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CalenderSvg />
                  <Text style={styles.nameText}>
                    {moment(inviteJobDetailsData?.date).format('MMMM Do YYYY')}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 20,
                  }}>
                  <ClockSvg />
                  <Text style={styles.nameText}>
                    {inviteJobDetailsData?.start_time +
                      ' - ' +
                      inviteJobDetailsData?.end_time}
                  </Text>
                </View>
              </View>
              <View style={styles.jobDescriptionView}>
                <Text style={styles.jobDescriptionText}>Job Description:</Text>
                <Text style={styles.checkBoxText}>
                  {inviteJobDetailsData?.description}
                </Text>
              </View>
              <DialogModal
                visible={successModal}
                dialogStyle={styles.dialogStyle}
                children={
                  <>
                    <FastImage
                      resizeMode="contain"
                      style={styles.thumbStyle}
                      source={require('../../../assets/images/thumb.png')}
                    />
                    <Text style={styles.responseText}>
                      Your application has been sent to the
                      {'\n'} employer. we will let you know their{'\n'}{' '}
                      response.
                    </Text>
                    <Button
                      style={[styles.responseButton, styles.inviteText]}
                      title1="OK"
                      onPress={() => {
                        setSuccessModal(false);
                      }}
                    />
                  </>
                }
              />
              <DialogModal
                visible={apply}
                dialogStyle={styles.dialogStyle}
                children={
                  <>
                    <View style={styles.modalTitle}>
                      <Text style={styles.applyTitle}>Apply</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setApply(false);
                        }}>
                        <Ionicons name={'close-circle-outline'} size={hp(4)} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.proposalTitle}>Proposal</Text>
                    <CustomInputField
                      name="proposal"
                      inputStyle={styles.proposalInputText}
                      inputContainerStyle={{
                        borderColor: 'lightgray',
                        marginLeft: wp(-3),
                      }}
                      placeholder="Enter your proposal"
                      value={proposal}
                      onChangeText={text => {
                        setProposal(text);
                      }}
                    />
                    {proposalError && (
                      <Text style={styles.errorText}>
                        Proposal description required
                      </Text>
                    )}
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        value={isSelected}
                        boxType="square"
                        onValueChange={setSelection}
                        style={styles.checkbox}
                        tintColors={{true: 'black', false: 'black'}}
                      />
                      <Text style={styles.loggingText}>
                        I agree to
                        <Text style={styles.termsText}>
                          {' '}
                          Employer’s Rate
                        </Text>{' '}
                        and {'\n'}
                        <Text style={styles.termsText}>Terms of the Job.</Text>
                      </Text>
                    </View>
                    <Button
                      style={[styles.submitButton, styles.inviteText]}
                      title1="Submit"
                      onPress={() => {
                        if (proposal) {
                          setProposalError(false);
                          if (isSelected) {
                            sendProposalApi();
                          } else {
                            Snackbar.show({
                              text: 'Please agree Terms and Conditions of Job',
                              duration: Snackbar.LENGTH_SHORT,
                            });
                          }
                        } else {
                          setProposalError(true);
                        }
                      }}
                      loading={sendProposalResponse.isLoading}
                    />
                  </>
                }
              />
            </ScrollView>
            {inviteJobDetailsData?.proposals_auth !== null || !appliedButton ? (
              <Button
                style={[styles.alreadyAppliedButton, styles.alreadyAppliedText]}
                title1="Applied"
              />
            ) : (
              <Button
                style={[styles.inviteButton, styles.inviteText]}
                title1="Apply"
                onPress={() => {
                  setApply(true);
                  setOpenSuccessModal(true);
                  setAppliedButton(true);
                }}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default JobDetails;
