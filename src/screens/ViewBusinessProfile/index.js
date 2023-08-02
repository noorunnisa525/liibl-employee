import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/LoggedInHeader';
import Text from '../../components/CustomText';
import {useThemeAwareObject} from '../../theme/index';
import createStyles from './styles';
import {
  viewProfileCall as ViewProfileCall,
  viewProfileEmail as ViewProfileEmail,
  viewProfileLocation as ViewProfileLocation,
} from '../../../assets/Icons/Svgs';
import {hp, wp} from '../../util';
import AccountCard from '../../components/ViewBusinessCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ViewProfileCard from '../../components/ViewProfileCard';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useRoute} from '@react-navigation/native';
import {view_business} from '../../services/api-confog';
import {useSelector} from 'react-redux';
import {usePostApiMutation} from '../../services/service';
import Snackbar from 'react-native-snackbar';
import {baseUrl, mapStyle} from '../../constants';

const ViewBusinessProfile = ({navigation}) => {
  const styles = useThemeAwareObject(createStyles);
  const [isFetching, setIsFetching] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const accessToken = useSelector(state => state.user.access_token);
  const [businessCall, businessResponse] = usePostApiMutation();
  const [viewBusinessData, setViewBusinessData] = useState([]);
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const {item} = route.params;
  useEffect(() => {
    setLoading(true);
    viewBusinessApi();
    onRefresh();
  }, []);
  useEffect(() => {}, [openModal]);
  const onRefresh = () => {
    setIsFetching(false);
  };
  const tokyoRegion = {
    latitude: viewBusinessData.latitude
      ? parseFloat(viewBusinessData.latitude)
      : 135.6762,
    longitude: viewBusinessData.longitude
      ? parseFloat(viewBusinessData.longitude)
      : 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const markerRegion = {
    latitude: viewBusinessData.latitude
      ? parseFloat(viewBusinessData.latitude)
      : 135.6762,
    longitude: viewBusinessData.longitude
      ? parseFloat(viewBusinessData.longitude)
      : 139.6503,
  };

  const viewBusinessApi = async () => {
    let apiData = {
      url: view_business + item.business_id,
      method: 'GET',
      token: accessToken,
    };
    try {
      let response = await businessCall(apiData).unwrap();
      if (response.status == 200) {
        setViewBusinessData(response.data);
        setLoading(false);
      } else {
        Snackbar.show({
          text: getCategoryList?.message,
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
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        style={{height: hp(30)}}
        source={
          viewBusinessData?.cover_image
            ? {uri: baseUrl.base + '/' + viewBusinessData?.cover_image}
            : require('../../../assets/images/Avatar.png')
        }
        resizeMode={viewBusinessData?.cover_image ? 'cover' : 'center'}
        // style={styles.image}
        // add this line
        imageStyle={{backgroundColor: '#f2f2f2'}}>
        <Header
          placement={'center'}
          barStyle={'dark-content'}
          containerStyle={styles.headerContainerStyle}
          backgroundColor={styles.headerColor}
          statusbar={styles.statusBar}
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
        />
      </ImageBackground>
      <View style={{marginTop: -hp(6)}}>
        <AccountCard
          viewProposals
          name={viewBusinessData.name}
          category={viewBusinessData?.category?.name}
          onPressEdit={() => navigation.navigate('EditViewProfile')}
          img={
            <Image
              source={
                viewBusinessData?.image
                  ? {uri: baseUrl.base + '/' + viewBusinessData?.image}
                  : require('../../../assets/images/Avatar.png')
              }
              style={{width: hp(6), height: hp(6), borderRadius: hp(3)}}
            />
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="always">
        {loading ? (
          <ActivityIndicator
            color="black"
            style={{position: 'absolute', top: 0, alignSelf: 'center'}}
          />
        ) : (
          <>
            <Text style={styles.nameText}>About us</Text>
            <Text style={styles.emailText}>{viewBusinessData?.about}</Text>
            <ViewProfileCard
              viewProposals
              name={'Email:'}
              category={viewBusinessData?.email}
              img={<ViewProfileEmail />}
            />
            <ViewProfileCard
              viewProposals
              name={'Phone Number:'}
              category={viewBusinessData?.phone}
              img={<ViewProfileCall />}
            />
            <ViewProfileCard
              viewProposals
              name={'Location:'}
              category={viewBusinessData?.address}
              img={<ViewProfileLocation />}
            />
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                style={styles.map}
                initialRegion={tokyoRegion} //your region data goes here.
                zoomControlEnabled={false}
                scrollEnabled={false}>
                <Marker coordinate={markerRegion} />
              </MapView>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ViewBusinessProfile;
