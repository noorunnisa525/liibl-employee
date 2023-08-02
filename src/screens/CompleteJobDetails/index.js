import React, {useState, useEffect} from 'react';
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
} from '../../../assets/Icons/Svgs';
import {useRoute} from '@react-navigation/native';
import DialogModal from '../../components/DialogModal';
import CustomRatingStars from '../../components/CustomStarReviewRating/CustomStarRating';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInputField from '../../components/CustomInputField';
import {baseUrl} from '../../constants';
import {give_reviews, view_job_details} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';
import moment from 'moment';
import InvitedJobDetails from '../InvitedJobDetails';

const CompleteJobDetails = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const route = useRoute();
  const {id} = route.params;
  const [openModal, setModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [reviewContainer, setReviewContainer] = useState(false);
  const [viewDetailsCall, viewDetailsResponse] = usePostApiMutation();
  const [giveReviewsCall, giveReviewsResponse] = usePostApiMutation();
  const [inviteJobDetailsData, setInviteJoBDetails] = useState();
  const accessToken = useSelector(state => state.user.access_token);
  const [defaultRating, setDefaultRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingError, setRatingError] = useState(false);
  const [reviewError, setReviewError] = useState(false);
  useEffect(() => {
    viewJobDetailsApi();
  }, []);
  useEffect(() => {
    if (inviteJobDetailsData?.review?.id) {
      setReviewContainer(true);
    }
  }, [inviteJobDetailsData]);
  const viewJobDetailsApi = async () => {
    let apiData = {
      url: view_job_details + `${id}&type=completed`,
      method: 'GET',
      token: accessToken,
    };
    try {
      let apiResponse = await viewDetailsCall(apiData).unwrap();
      if (apiResponse.statusCode == 200) {
        setInviteJoBDetails(apiResponse?.Data);
        setDefaultRating(apiResponse?.Data?.review?.rating_employee);
        setReview(apiResponse?.Data?.review?.review_employee);
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

  const giveReviewsApi = async () => {
    let form = new FormData();
    form.append('job_id', route.params.id);
    form.append('review', review);
    form.append('rating', defaultRating);

    let apiData = {
      url: give_reviews,
      data: form,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await giveReviewsCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        setSubmitModal(true), setModal(false);
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
                    <Text>{inviteJobDetailsData?.category.name}</Text>
                    <Text style={styles.skillsText}>
                      {inviteJobDetailsData?.sub_categories}
                    </Text>
                  </View>
                </View>

                <View style={styles.headerPriceContainer}>
                  <Text style={styles.priceText}>
                    {'$' + inviteJobDetailsData?.amount}
                  </Text>

                  <TouchableOpacity
                    style={styles.progressJobButton}
                    disabled={true}>
                    <Text style={styles.profileText}>
                      {inviteJobDetailsData?.status}
                    </Text>
                  </TouchableOpacity>
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
              <View
                style={
                  reviewContainer
                    ? styles.jobDescriptionReview
                    : styles.jobDescriptionView
                }>
                <Text style={styles.jobDescriptionText}>Job Description:</Text>
                <Text style={styles.checkBoxText}>
                  {inviteJobDetailsData?.description}
                </Text>
              </View>

              {reviewContainer ? (
                <>
                  <View style={styles.reviewContainer}>
                    <Text style={styles.employerText}>Employer Review</Text>
                    <CustomRatingStars
                      rating={inviteJobDetailsData?.review?.rating_business}
                      textStyle={{fontSize: hp(2)}}
                      ComponentStyle={{width: hp(15)}}
                      starSize={hp(2)}
                    />
                    <Text style={styles.reviewText}>
                      {inviteJobDetailsData?.review?.review_business}
                    </Text>
                  </View>
                  {inviteJobDetailsData?.review?.rating_employee ? (
                    <View style={styles.reviewContainer}>
                      <Text style={styles.employerText}>Your Review</Text>
                      <CustomRatingStars
                        rating={defaultRating}
                        textStyle={{fontSize: hp(2)}}
                        ComponentStyle={{width: hp(15)}}
                        starSize={hp(2)}
                      />
                      <Text style={styles.reviewText}>
                        {inviteJobDetailsData?.review?.review_employee}
                      </Text>
                    </View>
                  ) : null}
                </>
              ) : null}
              <DialogModal
                visible={openModal}
                dialogStyle={styles.dialogStyle}
                children={
                  <>
                    <View style={styles.modalTitle}>
                      <Text style={styles.reviewModalTitle}>Give review</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setModal(false);
                        }}>
                        <Ionicons name={'close-circle-outline'} size={hp(4)} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.reviewModalSubTitle}>Rating</Text>
                    <CustomRatingStars
                      rating={defaultRating}
                      onChangeValue={txt => {
                        setDefaultRating(txt);
                      }}
                    />
                    {ratingError ? (
                      <Text style={styles.errorText}>Rating is Required</Text>
                    ) : (
                      <Text style={styles.errorText}></Text>
                    )}
                    <Text style={styles.reviewModalSubTitle}>Review</Text>
                    <CustomInputField
                      name="review"
                      inputStyle={styles.loginInputText}
                      inputContainerStyle={{borderColor: 'white'}}
                      placeholder="Add review..."
                      // numberOfLines={2}
                      multiline={true}
                      value={review}
                      onChangeText={text => {
                        setReview(text);
                      }}
                    />
                    {reviewError ? (
                      <Text style={styles.reviewError}>Review is Required</Text>
                    ) : (
                      <Text style={styles.reviewError}></Text>
                    )}
                    <Button
                      style={[styles.submitButton, styles.inviteText]}
                      title1="Submit"
                      loading={giveReviewsResponse.isLoading}
                      onPress={() => {
                        if (
                          review &&
                          review != '' &&
                          defaultRating &&
                          defaultRating != 0
                        ) {
                          setReviewError(false);
                          setRatingError(false);
                          giveReviewsApi();
                        } else {
                          if (!review || review == '') {
                            setReviewError(true);
                          } else {
                            setReviewError(false);
                          }
                          if (!defaultRating || defaultRating == 0) {
                            setRatingError(true);
                          } else {
                            setRatingError(false);
                          }
                        }
                      }}
                    />
                  </>
                }
              />
              <DialogModal
                visible={submitModal}
                dialogStyle={styles.dialogStyle}
                children={
                  <>
                    <Image
                      resizeMode="contain"
                      style={styles.thumbStyle}
                      source={require('../../../assets/images/thumb.png')}
                    />
                    <Text style={styles.responseText}>
                      Your ratings are submitted and {'\n'}the user will see it
                      shortly.
                    </Text>
                    <Button
                      style={[styles.responseButton, styles.inviteText]}
                      title1="OK"
                      onPress={() => {
                        viewJobDetailsApi();
                        setSubmitModal(false);
                        setReviewContainer(true);
                      }}
                    />
                  </>
                }
              />
            </>
          )}
        </ScrollView>
        {!viewDetailsResponse.isLoading &&
          inviteJobDetailsData &&
          !inviteJobDetailsData?.review?.rating_employee &&
          inviteJobDetailsData?.review?.rating_business &&
          inviteJobDetailsData?.status != 'cancel' && (
            <Button
              style={[styles.completeJobButton, styles.inviteText]}
              title1="Rate your Employers"
              onPress={() => {
                setModal(true);
              }}
            />
          )}
      </View>
    </View>
  );
};

export default CompleteJobDetails;
