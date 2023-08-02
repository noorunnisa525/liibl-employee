import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
  Circle,
} from 'react-native-maps';
import {request, PERMISSIONS} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Carousel from 'react-native-snap-carousel';
import ProfileCard from './ProfileCard';
import {hp} from '../util';
import {mapStyle} from '../constants';

export default class CarouselMap extends Component {
  static navigationOptions = {
    title: 'San Francisco',
  };

  state = {
    markers: [],
    coordinates: [
      {
        name: 'Karlee J',
        category: 'Chef',
        experience: '5-7 yrs Experiance',
        latitude: 37.8025259,
        longitude: -122.4351431,
        image: require('../../assets/images/Image1.png'),
      },
      {
        name: 'James C',
        category: 'Cleaner',
        experience: '10-12 yrs Experiance',
        latitude: 37.7946386,
        longitude: -122.421646,
        image: require('../../assets/images/Image2.png'),
      },

      {
        name: 'Willson F.',
        latitude: 37.7665248,
        category: 'Bartender',
        experience: '5-7 yrs Experiance',
        longitude: -122.4165628,
        image: require('../../assets/images/Image3.png'),
      },

      {
        name: 'Courtney C.',
        latitude: 37.7834153,
        category: 'Waitress',
        experience: '5-7 yrs Experiance',
        longitude: -122.4527787,
        image: require('../../assets/images/sushi.jpg'),
      },
      {
        name: 'Mathew P.',
        latitude: 37.7948105,
        category: 'cook',
        experience: '5-7 yrs Experiance',
        longitude: -122.4596065,
        image: require('../../assets/images/sushi.jpg'),
      },
    ],
  };

  componentDidMount() {
    this.requestLocationPermission();
  }

  showWelcomeMessage = () =>
    Alert.alert('Welcome to San Francisco', 'The food is amazing', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Ok',
      },
    ]);

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };

  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };

        this.setState({initialPosition});
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };

  onCarouselItemChange = index => {
    let location = this.state.coordinates[index];

    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });

    this.state.markers[index].showCallout();
  };

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });

    this._carousel.snapToItem(index);
  };

  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.nn}</Text>
      <Image style={styles.cardImage} source={item.ii} />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          ref={map => (this._map = map)}
          showsUserLocation={true}
          style={styles.map}
          initialRegion={this.state.initialPosition}>
          <Polygon coordinates={this.state.coordinates} strokeWidth={0} />
          <Circle center={{latitude: 37.8025259, longitude: -122.4351431}} />
          <Marker
            draggable
            coordinate={{
              latitude: 37.7825259,
              longitude: -122.4351431,
            }}></Marker>
          {this.state.coordinates.map((marker, index) => (
            <Marker
              key={marker.name}
              ref={ref => (this.state.markers[index] = ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}>
              <Callout>
                <ProfileCard
                  //   img={marker.image}
                  name={marker.name}
                  category={marker.category}
                  experience={marker.experience}
                  onPressButton={this.props.onPress}
                />
              </Callout>
            </Marker>
          ))}
        </MapView>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.coordinates}
          containerCustomStyle={styles.carousel}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          removeClippedSubviews={false}
          onSnapToItem={index => this.onCarouselItemChange(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48,
  },
  cardContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: hp(25),
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
  },
});
