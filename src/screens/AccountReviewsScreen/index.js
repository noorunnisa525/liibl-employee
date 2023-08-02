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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {reviewsData} from '../../data/newMemory';
import ReviewsCard from '../../components/ReviewsCard';
import CustomStarRating from '../../components/CustomStarReviewRating/CustomStarRating';
import {hp, wp} from '../../util';
import {get_reviews, give_reviews} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {baseUrl} from '../../constants';
import {NoReviewsSvg} from '../../../assets/Icons/Svgs';
function AccountReviewsScreen({navigation}) {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const accessToken = useSelector(state => state.user.access_token);
  const [getReviewsCall, getReviewsResponse] = usePostApiMutation();
  const [reviewList, setReviewList] = useState([]);
  useEffect(() => {
    onRefresh();
  }, []);
  const onRefresh = () => {
    getReviewsApi();
    setIsFetching(false);
  };

  const renderEmptyContainer = () => {
    return (
      <View style={styles.emptyListStyle}>
        <NoReviewsSvg />
        <Text style={styles.emptyMessageStyle}>No reviews available</Text>
      </View>
    );
  };

  const getReviewsApi = async () => {
    let apiData = {
      url: get_reviews,
      method: 'GET',
      token: accessToken,
    };
    try {
      let getJobs = await getReviewsCall(apiData).unwrap();
      if (getJobs.status == 200) {
        setReviewList(getJobs.data?.userReview);
      } else {
        Snackbar.show({
          text: getJobs?.message,
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };
  const renderReviews = ({item}) => {
    return (
      <ReviewsCard
        stars={
          <CustomStarRating
            rating={item?.rating_business}
            textStyle={{fontSize: hp(2)}}
            ComponentStyle={{
              width: hp(10),
            }}
            starSize={hp(1.7)}
          />
        }
        taskCardStyle={styles.profileCardStyle}
        title={item?.business.name}
        profileImage={
          item?.business?.image
            ? {uri: baseUrl.base + '/' + item?.business?.image}
            : require('../../../assets/images/avatar-placeholder.png')
        }
        description={item?.review_business}
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
        centerComponent={<Text style={styles.headerInitialText}>Reviews</Text>}
      />

      <View style={styles.container}>
        {getReviewsResponse.isLoading ? (
          <ActivityIndicator color="black" style={{alignSelf: 'center'}} />
        ) : (
          <FlatList
            data={reviewList}
            renderItem={renderReviews}
            contentContainerStyle={{flexGrow: 1}}
            numColumns={1}
            refreshing={isFetching}
            onRefresh={onRefresh}
            keyExtractor={item => item?.name}
            ListEmptyComponent={renderEmptyContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => {
              return <View style={{height: hp(32)}}></View>;
            }}
          />
        )}
      </View>
    </View>
  );
}

export default AccountReviewsScreen;
