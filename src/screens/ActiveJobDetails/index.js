import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView, Image} from 'react-native';
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
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import {cancel_job} from '../../services/api-confog';
import {useDispatch, useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import {baseUrl} from '../../constants';
import {setSelectedTab} from '../../redux/slices/userSlice';

function ActiveJobDetails({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const route = useRoute();
  const {item} = route.params;
  const [openModal, setModal] = useState(false);
  const accessToken = useSelector(state => state.user.access_token);
  const [cancelJobCall, cancelJobResponse] = usePostApiMutation();
  const dispatch = useDispatch();
  const cancelJobApi = async () => {
    let data = {
      job_id: item?.id,
    };
    let apiData = {
      url: cancel_job,
      data: data,
      method: 'POST',
      token: accessToken,
    };
    try {
      let apiResponse = await cancelJobCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        dispatch(setSelectedTab('completed'));
        setModal(false);
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
          <View style={styles.header}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.imgStyle}>
                <Image
                  source={
                    item?.business?.image
                      ? {uri: baseUrl.base + '/' + item?.business?.image}
                      : require('../../../assets/images/avatar-placeholder.png')
                  }
                  style={styles.imageStyle}
                  resizeMode={'cover'}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text>{item.category.name}</Text>
                <Text style={styles.skillsText}>{item.sub_categories}</Text>
              </View>
            </View>

            <View style={styles.headerPriceContainer}>
              <Text style={styles.priceText}>{}</Text>

              <TouchableOpacity style={styles.activeJobButton} disabled={true}>
                <Text style={styles.profileText}>Active</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.postedByView}>
            <Text style={styles.postedByText}>Job Posted By</Text>
            <TouchableOpacity
              style={styles.postedByInnerView}
              onPress={() => {
                navigation.navigate('ViewBusinessProfile', {item: item});
              }}>
              <View style={styles.postedByImg}>
                <Image
                  source={
                    item?.business?.image
                      ? {uri: baseUrl.base + '/' + item?.business?.image}
                      : require('../../../assets/images/avatar-placeholder.png')
                  }
                  style={styles.postedImageStyle}
                  resizeMode={'cover'}
                />
              </View>
              <Text style={styles.postedByInnerText}>
                {item?.business?.name}
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
                {moment(item.date).format('MMMM Do YYYY')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ClockSvg />
              <Text style={styles.nameText}>
                {item.start_time + ' - ' + item.end_time}
              </Text>
            </View>
          </View>
          <View style={styles.jobDescriptionView}>
            <Text style={styles.jobDescriptionText}>Job Description:</Text>
            <Text style={styles.checkBoxText}>{item?.description}</Text>
          </View>

          <View>
            <Text style={styles.qrTitleText}>QR Code to start the job</Text>

            <View style={styles.qrImageStyle}>
              <QRCode
                value={item?.job_qr_code}
                size={hp(30)}
                logoBackgroundColor="transparent"
              />
            </View>
            <Text style={styles.qrDescriptionText}>
              Show this QR code to you employer to{'\n'} start the job
            </Text>
            <Button
              style={[styles.cancelJobButton, styles.inviteText]}
              title1="Cancel the job"
              onPress={() => {
                setModal(true);
              }}
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
                    Are you sure you want to cancel this job?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Button
                      style={[styles.cancelModalButton, styles.inviteText]}
                      title1="No"
                      onPress={() => setModal(false)}
                    />
                    <Button
                      style={[styles.acceptModalButton, styles.inviteText]}
                      title1="Yes"
                      loading={cancelJobResponse.isLoading}
                      onPress={() => {
                        cancelJobApi();
                      }}
                    />
                  </View>
                </>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default ActiveJobDetails;
