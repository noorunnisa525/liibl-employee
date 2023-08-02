import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {profileData} from '../../data/newMemory';
import NotificationCard from '../../components/NotificationCard';
import {useSelector} from 'react-redux';
import {NoNotificationSvg} from '../../../assets/Icons/Svgs';
import {hp, wp} from '../../util';
import {useIsFocused} from '@react-navigation/native';
import {get_notifications} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import {useKeyboard} from '@react-native-community/hooks';
import Snackbar from 'react-native-snackbar';
import {baseUrl} from '../../constants';
import moment from 'moment';

function Notifications({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [getNotificationsCall, getNotificationsResponse] =
    usePostApiMutation(false);
  const [nextPageURL, setNextPageURL] = useState();
  const [pageNo, setPageNo] = useState(1);
  const isFocused = useIsFocused();
  const keyboard = useKeyboard();
  const [notificationList, setNotificationList] = useState([]);
  const accessToken = useSelector(state => state.user.access_token);

  useEffect(() => {
    if (isFocused) onRefresh();
  }, [isFocused]);

  const onRefresh = () => {
    getNotificationsApi();
    setIsFetching(false);
  };

  const getNotificationsApi = async () => {
    let apiData = {
      url: get_notifications,
      method: 'GET',
      token: accessToken,
    };
    try {
      let apiResponse = await getNotificationsCall(apiData).unwrap();
      if (apiResponse.status == 200) {
        setNotificationList(apiResponse?.data);
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

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <NoNotificationSvg />
        <Text style={styles.emptyMessageStyle}>No notifications available</Text>
      </View>
    );
  };
  const renderNotification = ({item}) => {
    return (
      <NotificationCard
        viewProposals
        onPressProposal={() => {
          if (item?.type === 'send job invite') {
            navigation.navigate('InvitedJobDetails', {
              id: item?.job_id,
              invite_id: item?.job_invite_id,
            });
          } else if (item?.type == 'cancel job') {
            navigation.navigate('CompleteJobDetails', {
              id: item?.job_id,
            });
          } else if (item?.type == 'business job review') {
            navigation.navigate('CompleteJobDetails', {
              id: item?.job_id,
            });
          } else {
          }
        }}
        name={item?.notification_text}
        category={item?.category}
        img={
          item?.receiver?.image
            ? {uri: baseUrl.base + '/' + item?.receiver?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        description={item?.descriptions}
        time={moment(item?.created_at).fromNow()}
      />
    );
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
          <Text style={styles.headerInitialText}>{`Notifications (${
            notificationList?.length ? notificationList?.length : 0
          })`}</Text>
        }
      />

      <View style={styles.container}>
        {getNotificationsResponse.isLoading ? (
          <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
        ) : (
          <FlatList
            data={notificationList}
            renderItem={renderNotification}
            contentContainerStyle={{flexGrow: 1}}
            numColumns={1}
            refreshing={isFetching}
            onRefresh={onRefresh}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => null}
            ListFooterComponentStyle={styles.footerStyle}
          />
        )}
      </View>
    </View>
  );
}
export default Notifications;
