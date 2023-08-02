import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import Header from '../../components/CustomHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import CustomTopBar from '../../components/CustomTopBar';
import {postedJob, profileData} from '../../data/newMemory';
import InvitedJobCard from '../../components/InvitedJobCard';
import ActiveJobCard from '../../components/ActiveJobCard';
import CompletedJobCard from '../../components/CompletedJobCard';
import InProgressJobCard from '../../components/InProgressJobCard';
import {usePostApiMutation} from '../../services/service';
import {useDispatch, useSelector} from 'react-redux';
import {
  get_employee_active_jobs,
  get_employee_completed_jobs,
  get_employee_inprogress_jobs,
  get_employee_invited_jobs,
  get_my_posted_jobs,
} from '../../services/api-confog';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {baseUrl} from '../../constants';
import {hp} from '../../util/index';
import {NoJobsSvg} from '../../../assets/Icons/Svgs';
import {setSelectedTab} from '../../redux/slices/userSlice';
function MyJobs({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [callApi, setCallApi] = useState(true);
  const [getInvitedJobsCall, getInvitedJobsResponse] = usePostApiMutation();
  const [getActiveJobsCall, getActiveJobsResponse] = usePostApiMutation();
  const [getInprogressJobsCall, getInProgressJobsResponse] =
    usePostApiMutation();
  const [getCompletedJobsCall, getCompletedJobsResponse] = usePostApiMutation();
  const accessToken = useSelector(state => state.user.access_token);
  const [pageNo, setPageNo] = useState(1);
  const [activePageNo, setActivePageNo] = useState(1);
  const [inprogressPageNo, setInprogressPageNo] = useState(1);
  const [completedPageNo, setCompletedPageNo] = useState(1);
  const [invitedJobsList, setInvitedJobsList] = useState([]);
  const [activeJobsList, setActiveJobsList] = useState([]);
  const [inprogressJobsList, setInprogressJobsList] = useState([]);
  const [completedJobsList, setCompletedJobsList] = useState([]);
  const [nextPageURL, setNextPageURL] = useState();
  const isFocused = useIsFocused();
  const selectedTab = useSelector(state => state.user.selectedTab);
  const dispatch = useDispatch();
  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <NoJobsSvg />
        <Text style={styles.emptyMessageStyle}>No jobs available</Text>
      </View>
    );
  };
  useEffect(() => {
    if (isFocused) {
      onRefresh();
      // dispatch(setSelectedTab('Invited'));
    }
  }, [isFocused]);

  const onRefresh = () => {
    if (isFocused) {
      let invitedPageNo = pageNo;
      let activeJobPageNo = activePageNo;
      let inprogressPage = inprogressPageNo;
      getInvitedJobsApi(invitedPageNo);
      getActiveJobsApi(activeJobPageNo);
      getInprogressJobsApi(inprogressPage);
      getCompletedJobsApi(inprogressPage);
    }
    setIsFetching(false);
  };

  const getInvitedJobsApi = async pageNo => {
    setCallApi(false);
    let apiData = {
      url: get_employee_invited_jobs + pageNo,
      method: 'GET',
      token: accessToken,
    };

    try {
      let invitedJobs = await getInvitedJobsCall(apiData).unwrap();
      if (invitedJobs.statusCode == 200) {
        setPageNo(invitedJobs.Data.current_page);
        setInvitedJobsList(invitedJobs.Data.data);
        setNextPageURL(invitedJobs.Data.next_page_url);
      } else {
        Snackbar.show({
          text: invitedJobs?.message,
          duration: Snackbar?.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  const getActiveJobsApi = async pageNo => {
    setCallApi(false);
    let apiData = {
      url: get_employee_active_jobs + pageNo,
      method: 'GET',
      token: accessToken,
    };
    try {
      let activeJobs = await getActiveJobsCall(apiData).unwrap();
      if (activeJobs.statusCode == 200) {
        setActivePageNo(activeJobs.Data.current_page);
        setActiveJobsList(activeJobs.Data.data);
      } else {
        Snackbar.show({
          text: activeJobs?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  const getInprogressJobsApi = async pageNo => {
    setCallApi(false);
    let apiData = {
      url: get_employee_inprogress_jobs + pageNo,
      method: 'GET',
      token: accessToken,
    };
    try {
      let inprogressJob = await getInprogressJobsCall(apiData).unwrap();
      if (inprogressJob.statusCode == 200) {
        setInprogressPageNo(inprogressJob.Data.current_page);
        setInprogressJobsList(inprogressJob.Data.data);
      } else {
        Snackbar.show({
          text: invitedJobs?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  const getCompletedJobsApi = async pageNo => {
    setCallApi(false);
    let apiData = {
      url: get_employee_completed_jobs + pageNo,
      method: 'GET',
      token: accessToken,
    };
    try {
      let completeJobResponse = await getCompletedJobsCall(apiData).unwrap();
      if (completeJobResponse.statusCode == 200) {
        setCompletedPageNo(completeJobResponse.Data.current_page);
        setCompletedJobsList(completeJobResponse.Data.data);
      } else {
        Snackbar.show({
          text: invitedJobs?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  const renderInvited = ({item}) => {
    return (
      <InvitedJobCard
        onPress={() =>
          navigation.navigate('InvitedJobDetails', {
            id: item?.job_id,
            invite_id: item?.id,
          })
        }
        name={item?.job?.title}
        category={item?.jobCategory}
        skills={item?.requiredSkills}
        taskCardStyle={styles?.profileCardStyle}
        price={'$' + item?.job?.amount}
        imgStyle={styles?.imageStyle}
        img={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        date={moment(item?.job?.date).format('MMMM Do YYYY')}
        time={item?.job?.start_time + ' - ' + item?.job?.end_time}
        description={item?.job?.description}
      />
    );
  };

  const renderActive = ({item}) => {
    return (
      <ActiveJobCard
        onPressHeader={() =>
          navigation.navigate('ActiveJobDetails', {item: item})
        }
        name={item.title}
        category={item?.category?.name}
        skills={item?.sub_categories}
        taskCardStyle={styles.profileCardStyle}
        price={'$' + item.amount}
        title={item?.name}
        img={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        imgStyle={styles.imageStyle}
        date={moment(item.date).format('MMMM Do YYYY')}
        time={item.start_time + ' - ' + item.end_time}
        description={item?.description}
      />
    );
  };
  const renderProgress = ({item}) => {
    return (
      <InProgressJobCard
        onPressHeader={() =>
          navigation.navigate('InprogressJobDetails', {item: item})
        }
        name={item.title}
        category={item?.category?.name}
        skills={item?.sub_categories}
        taskCardStyle={styles.profileCardStyle}
        price={'$' + item.amount}
        title={item?.name}
        img={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        imgStyle={styles.imageStyle}
        date={moment(item.date).format('MMMM Do YYYY')}
        time={item.start_time + ' - ' + item.end_time}
        description={item?.description}
      />
    );
  };
  const renderComplete = ({item}) => {
    return (
      <CompletedJobCard
        onPressHeader={() =>
          navigation.navigate('CompleteJobDetails', {id: item?.id})
        }
        name={item?.title}
        category={item?.category?.name}
        skills={item?.sub_categories}
        taskCardStyle={styles.profileCardStyle}
        price={'$' + item.amount}
        title={item?.name}
        img={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        imgStyle={styles.imageStyle}
        date={moment(item.date).format('MMMM Do YYYY')}
        time={item.start_time + ' - ' + item.end_time}
        description={item?.description}
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
        centerComponent={<Text style={styles.headerInitialText}>My Jobs</Text>}
      />

      <CustomTopBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <View style={styles.container}>
        {selectedTab == 'Invited' && (
          <>
            {getInvitedJobsResponse.isLoading ? (
              <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
            ) : (
              <FlatList
                data={invitedJobsList}
                renderItem={renderInvited}
                refreshing={isFetching}
                onRefresh={onRefresh}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                ListFooterComponent={() => {
                  return <View style={{height: hp(27)}}></View>;
                }}
                onEndReached={() => {
                  if (nextPageURL) {
                    let temp = pageNo + 1;
                    getInvitedJobsApi(temp);
                  }
                }}
                onEndReachedThreshold={0.01}
              />
            )}
          </>
        )}
        {selectedTab == 'Active' && (
          <>
            {getActiveJobsResponse.isLoading ? (
              <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
            ) : (
              <FlatList
                data={activeJobsList}
                renderItem={renderActive}
                refreshing={isFetching}
                onRefresh={onRefresh}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                ListFooterComponent={() => {
                  return <View style={{height: hp(27)}}></View>;
                }}
                onEndReached={() => {
                  if (nextPageURL) {
                    let activePageNo = activePageNo + 1;
                    getActiveJobsApi(activePageNo);
                  }
                }}
                onEndReachedThreshold={0.01}
              />
            )}
          </>
        )}
        {selectedTab == 'InProgress' && (
          <>
            {getInProgressJobsResponse.isLoading ? (
              <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
            ) : (
              <FlatList
                data={inprogressJobsList}
                renderItem={renderProgress}
                refreshing={isFetching}
                onRefresh={onRefresh}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                ListFooterComponent={() => {
                  return <View style={{height: hp(27)}}></View>;
                }}
                onEndReached={() => {
                  if (nextPageURL) {
                    let inprogressPage = inprogressPageNo + 1;
                    getActiveJobsApi(inprogressPage);
                  }
                }}
                onEndReachedThreshold={0.01}
              />
            )}
          </>
        )}
        {selectedTab == 'completed' && (
          <>
            {getCompletedJobsResponse.isLoading ? (
              <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
            ) : (
              <FlatList
                data={completedJobsList}
                renderItem={renderComplete}
                refreshing={isFetching}
                onRefresh={onRefresh}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmptyContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                ListFooterComponent={() => {
                  return <View style={{height: hp(27)}}></View>;
                }}
                onEndReached={() => {
                  if (nextPageURL) {
                    let completePage = completedPageNo + 1;
                    getCompletedJobsApi(completePage);
                  }
                }}
                onEndReachedThreshold={0.01}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

export default MyJobs;
