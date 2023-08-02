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
import {hp, wp} from '../../util';
import {
  calenderSvg as CalenderSvg,
  clockSvg as ClockSvg,
  ChatWithBackgroundSvg,
} from '../../../assets/Icons/Svgs';
import {useRoute} from '@react-navigation/native';
import moment from 'moment';
import {usePostApiMutation} from '../../services/service';
import {useDispatch, useSelector} from 'react-redux';
import {
  accept_job_invite,
  give_reviews,
  reject_job_invite,
  view_job_details,
} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import QRCode from 'react-native-qrcode-svg';
import {baseUrl} from '../../constants';
import {setSelectedTab} from '../../redux/slices/userSlice';

function InvitedJobDetails({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const route = useRoute();
  const {id} = route.params;
  const [invite, setInvite] = useState(false);
  const [inviteRejected, setInviteRejected] = useState(false);
  const [inviteJobDetailsData, setInviteJoBDetails] = useState();
  const [rejectInviteCall, rejectInviteResponse] = usePostApiMutation();
  const [acceptInviteCall, acceptInviteResponse] = usePostApiMutation();
  const [viewDetailsCall, viewDetailsResponse] = usePostApiMutation();
  const accessToken = useSelector(state => state.user.access_token);
  const dispatch = useDispatch();
  useEffect(() => {
    viewJobDetailsApi();
  }, []);
  const rejectJobInviteApi = async () => {
    let data = {
      job_invite_id: route.params.invite_id,
    };
    let apiData = {
      url: reject_job_invite,
      data: data,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await rejectInviteCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        setInviteRejected(true);
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

  const acceptJobInviteApi = async () => {
    let data = {
      job_invite_id: route.params.invite_id,
    };
    let apiData = {
      url: accept_job_invite,
      data: data,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await acceptInviteCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setSelectedTab('Active'));
        navigation.navigate('MyJobs');
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

  const viewJobDetailsApi = async () => {
    let apiData = {
      url: view_job_details + `${route.params.id}`,
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
        <ScrollView
          style={styles.listItem}
          showsVerticalScrollIndicator={false}>
          {viewDetailsResponse.isLoading ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
            </View>
          ) : (
            <>
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
                    <Text style={styles.priceText}>
                      {'$' + inviteJobDetailsData?.amount}
                    </Text>
                  </View>
                </View>
                {inviteJobDetailsData?.status === 'invited' && (
                  <>
                    {inviteRejected ? (
                      <TouchableOpacity
                        style={styles.profileContainer}
                        disabled={true}
                        // onPress={props.onPress}
                      >
                        <Text style={styles.profileText}>Invitation</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.iconView}
                        onPress={() => {
                          navigation.navigate('Inbox', {
                            name: inviteJobDetailsData?.business?.name,

                            id: inviteJobDetailsData?.business?.id,

                            image: inviteJobDetailsData?.business?.image,
                          });
                        }}>
                        <ChatWithBackgroundSvg />
                      </TouchableOpacity>
                    )}
                  </>
                )}
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
                  <View style={styles.postedByImg}>
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
                  </View>
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
              {invite ? (
                <View>
                  <Text style={styles.qrTitleText}>
                    QR Code to start the job
                  </Text>

                  <QRCode
                    value={inviteJobDetailsData?.job_qr_code}
                    logoSize={120}
                    logoBackgroundColor="transparent"
                  />
                  <Text style={styles.qrDescriptionText}>
                    Show this QR code to you employer to{'\n'} start the job
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: hp(3)}}></View>
              )}
            </>
          )}
        </ScrollView>
        {(inviteJobDetailsData?.status === 'invited' ||
          inviteJobDetailsData?.proposals_auth?.status === 'approved') &&
          inviteJobDetailsData?.status != 'cancelled' && (
            <>
              {inviteRejected ? (
                <View style={{marginTop: hp(2)}}>
                  <Button
                    style={[styles.inviteRejectedButton, styles.inviteText]}
                    title1="Invite Rejected"
                  />
                </View>
              ) : (
                <View>
                  <Button
                    style={[styles.inviteButton, styles.inviteText]}
                    title1="Accept Invite"
                    loading={acceptInviteResponse.isLoading}
                    onPress={() => acceptJobInviteApi()}
                  />
                  <Button
                    style={[styles.rejectButton, styles.rejectText]}
                    title1="Reject Invitation"
                    loading={rejectInviteResponse.isLoading}
                    onPress={() => rejectJobInviteApi()}
                    loaderBlack
                  />
                </View>
              )}
            </>
          )}
        {inviteJobDetailsData?.status === 'cancelled' && (
          <Button
            style={[styles.cancelButton, styles.cancelText]}
            title1="Job Cancelled"
          />
        )}
        {inviteJobDetailsData?.status === 'active' && (
          <Button
            style={[styles.cancelButton, styles.cancelText]}
            title1="Job Already Started"
          />
        )}
        {inviteJobDetailsData?.proposals_auth?.status === 'reject' && (
          <Button
            style={[styles.cancelButton, styles.cancelText]}
            title1="Proposal Rejected"
          />
        )}
      </View>
    </View>
  );
}

export default InvitedJobDetails;
