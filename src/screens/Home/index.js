import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import ActiveJobCard from '../../components/ActiveJobCard';
import SearchBar from '../../components/SearchBar';
import {
  NoJobsSvg,
  filterSvg as FilterSvg,
  clockSvg,
} from '../../../assets/Icons/Svgs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {hp, wp} from '../../util';
import {useSelector} from 'react-redux';
import {get_jobs} from '../../services/api-confog';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {baseUrl} from '../../constants';
import OneSignal from 'react-native-onesignal';
function Home({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [getJobsCall, getJobsResponse] = usePostApiMutation();
  const isFocused = useIsFocused();
  const [nextPageURL, setNextPageURL] = useState();
  const [jobList, setJobList] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchJobList, setSearchJobList] = useState([]);
  const accessToken = useSelector(state => state.user.access_token);
  const [pageNo, setPageNo] = useState(1);
  const [searching, setSearching] = useState('');
  const route = useRoute();
  const [isFiltered, setIsFiltered] = useState(false);
  let subValue = null,
    categoryValue = null,
    type = null;
  if (route.params) {
    subValue = route.params.subValue;
    categoryValue = route.params.categoryValue;
    type = route.params.type;
  }

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.categoryValue || route?.params?.type) {
        setIsFiltered(true);
      } else {
        setIsFiltered(false);
      }
    }
  }, [route?.params?.categoryValue, isFocused]);

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      if (
        notification?.notification?.additionalData?.type == 'send job invite'
      ) {
        navigation.navigate('InvitedJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
          invite_id: notification?.notification?.additionalData?.job_invite_id,
        });
      } else if (
        notification?.notification?.additionalData?.type == 'cancel job'
      ) {
        navigation.navigate('CompleteJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
        });
      } else if (
        notification?.notification?.additionalData?.type ==
        'business job review'
      ) {
        navigation.navigate('CompleteJobDetails', {
          id: notification?.notification?.additionalData?.job_id,
        });
      } else {
      }
    });
  }, []);

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <NoJobsSvg />
        <Text style={styles.emptyMessageStyle}>No jobs available</Text>
      </View>
    );
  };

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    let filteredJobList = [];
    if (categoryValue || type) {
      if (type) {
        if (filteredJobList.length == 0) {
          filteredJobList = allJobs;
        }
        if (type == 'applied') {
          filteredJobList = filteredJobList.filter(
            item => item.proposals_auth != null,
          );
        } else if (type == 'non') {
          filteredJobList = filteredJobList.filter(
            item => item.proposals_auth == null,
          );
        }
      }
      if (categoryValue) {
        filteredJobList = allJobs.filter(
          item => item.category_id === categoryValue,
        );
      }
      if (subValue) {
        subValue.forEach(item => {
          filteredJobList = filteredJobList.filter(el =>
            el.sub_categories.includes(item.label),
          );
        });
      }

      setJobList(filteredJobList);
      setSearchJobList(filteredJobList);
    } else {
      setJobList(allJobs);
      setSearchJobList(allJobs);
    }
  }, [categoryValue, subValue, type]);

  const onRefresh = () => {
    let getJobPageNo = pageNo;
    getJobsApi(getJobPageNo);

    setIsFetching(false);
  };

  const getJobsApi = async pageNo => {
    let apiData = {
      url: get_jobs + pageNo,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getJobs = await getJobsCall(apiData).unwrap();
      if (getJobs.statusCode == 200) {
        setNextPageURL(getJobs.Data.next_page_url);
        setPageNo(getJobs.Data.current_page);
        setJobList(getJobs.Data.data);
        setAllJobs(getJobs.Data.data);
        setSearchJobList(getJobs.Data.data);
      } else {
        Snackbar.show({
          text: getJobs?.message,
          duration: Snackbar?.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  const renderJobs = ({item}) => {
    return (
      <ActiveJobCard
        onPressHeader={() => navigation.navigate('JobDetails', {item: item})}
        name={item.title}
        featured={item?.is_featured == 1}
        category={item.category.name}
        skills={item.sub_categories}
        taskCardStyle={'styles.profileCardStyle'}
        price={'$' + item.amount}
        imgStyle={styles.imageStyle}
        applied={item.proposals_auth}
        img={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        date={moment(item.date).format('MMMM Do YYYY')}
        time={item.start_time + ' - ' + item.end_time}
        description={item?.description}
      />
    );
  };

  const onChangeText = text => {
    if (text) {
      const newData = searchJobList.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setJobList(newData);
      setSearching(text);
    } else {
      setJobList(searchJobList);
      setSearching(text);
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
        centerComponent={
          <Text style={styles.headerInitialText}>Listed Jobs</Text>
        }
        rightComponent={
          isFiltered && (
            <MaterialIcons
              name={'refresh'}
              size={wp(6.5)}
              color={'black'}
              onPress={() => {
                setJobList(allJobs);
                setSearchJobList(allJobs);
                setIsFiltered(false);
                route.params = null;
              }}
            />
          )
        }
      />

      <View style={styles.iconContainer}>
        <SearchBar
          placeholder="Search for Job Title"
          value={searching}
          onChangeText={txt => onChangeText(txt)}
        />
        <TouchableOpacity style={{paddingLeft: hp(1.5)}}>
          <FilterSvg
            onPressFilter={() => {
              navigation.navigate('FilterScreen');
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {getJobsResponse.isLoading ? (
          <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
        ) : (
          <FlatList
            data={jobList}
            renderItem={renderJobs}
            contentContainerStyle={{flexGrow: 1}}
            numColumns={1}
            refreshing={isFetching}
            onRefresh={onRefresh}
            onEndReached={() => {
              if (nextPageURL) {
                let temp = pageNo + 1;
                getJobsApi(temp);
              }
            }}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.01}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => {
              return <View style={{height: hp(27)}}></View>;
            }}
          />
        )}
      </View>
    </View>
  );
}

export default Home;
