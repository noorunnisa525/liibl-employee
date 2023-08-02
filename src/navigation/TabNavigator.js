import {useKeyboard} from '@react-native-community/hooks';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  NotificationsSvg,
  homeSvg as HomeSvg,
  homeActiveSvg as HomeActiveSvg,
  workSvg as WorkSvg,
  workActiveSvg as WorkActiveSvg,
  plusSvg as PlusSvg,
  chatActiveSvg as ChatActiveSvg,
  chatSvg as ChatSvg,
  accountSvg as AccountSvg,
  accountActiveSvg as AccountActiveSvg,
  NotificationsActiveSvg,
} from '../../assets/Icons/Svgs';
import Home from '../screens/Home';
import MyJobs from '../screens/MyJobs';
import Chat from '../screens/Chat';
import PostJobs from '../screens/PostJobs';
import Account from '../screens/Account';
import {useThemeAwareObject} from '../theme';
import {hp, wp} from '../util';
import Notifications from '../screens/Notifications';

import Plus from '../../assets/Icons/plus.svg';
import {setSelectedTab} from '../redux/slices/userSlice';
import {useDispatch} from 'react-redux';

const Tab = createBottomTabNavigator();
// const keyboard = useKeyboard();
const TabNavigator = ({route}) => {
  const keyboard = useKeyboard();
  const dispatch = useDispatch();
  const createStyles = theme => {
    const themeStyles = StyleSheet.create({
      mainContainer: {
        height: wp(15),
        width: wp(15),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        position: 'absolute',
        bottom: wp(1),
        borderWidth: wp(1),
        borderColor: 'white',
      },

      tabBarContainer: {
        flexDirection: 'row',
        width: wp(100),
        backgroundColor: 'white',
        justifyContent: 'space-around',
        borderTopRightRadius: hp(3),
        borderTopLeftRadius: hp(3),
        borderWidth: 0.4,
        // shadowColor: 'black',
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        position: 'absolute',
        bottom: keyboard.keyboardShown ? -1000 : 0,
      },
      textView: {
        fontSize: wp(2.75),
        position: 'absolute',
        bottom: hp(-1.3),
      },
      iconView: {
        height: wp(15),
        width: wp(15),
        borderRadius: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        position: 'absolute',
        bottom: wp(1),
        borderWidth: wp(0.01),
        borderColor: 'red',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      },
      iconView1: {
        bottom: hp(1),
        marginBottom: wp(1),
      },
      plusIconStyle: {
        position: 'absolute',
        bottom: hp(1),
        justifyContent: 'center',
        alignItems: 'center',
      },
      textStyle: {
        fontSize: wp(3),
      },
      focusColorStyle: {
        color: 'black',
      },
      nonFocusColorStyle: {
        color: 'black',
      },
      inner: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
      },
      tabBar: {
        // position: 'absolute',
        // bottom: keyboard.keyboardShown ? -300 : 0,
      },

      mainTab: {
        height: wp(15),
        width: wp(15),
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
      },
      upperTab: {
        height: wp(14.5),
        width: wp(14.5),
        borderRadius: 100,
        backgroundColor: 'white',
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
      },
      selectedTab: {
        height: wp(12.5),
        width: wp(12.5),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: wp(30),
        borderWidth: wp(1),
        borderColor: 'white',
      },
    });
    return themeStyles;
  };
  const styles = useThemeAwareObject(createStyles);
  function MyTabBar({state, descriptors, navigation}) {
    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            descriptors[route.key].options.tabBarHideOnKeyboard && (
              <TouchableOpacity
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  height: hp(5),
                  justifyContent: 'flex-end',
                  marginBottom: 12,
                }}>
                <TouchableOpacity onPress={onPress} style={styles.inner}>
                  <View style={isFocused ? null : styles.iconView1}></View>
                  <View
                    style={
                      route.name == 'PostJobs'
                        ? styles.iconView
                        : isFocused
                        ? styles.iconView1
                        : styles.iconView1
                    }>
                    {isFocused
                      ? options.tabBarIconActive
                      : options.tabBarIconInactive}
                  </View>

                  <Text style={[styles.textView]}>{label}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )
          );
        })}
      </View>
    );
  }
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          keyboardHidesTabBar: true,
          tabBarStyle: {height: 60},
          tabBarAllowFontScaling: false,
        }}
        backBehavior="initialRoute">
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Jobs',
            tabBarIconActive: <HomeActiveSvg />,
            tabBarIconInactive: <HomeSvg />,
          }}
        />
        <Tab.Screen
          name="MyJobs"
          component={MyJobs}
          options={{
            tabBarLabel: 'My jobs',
            tabBarIconActive: <WorkActiveSvg />,
            tabBarIconInactive: <WorkSvg />,
          }}
          listeners={({navigation}) => ({
            tabPress: event => {
              dispatch(setSelectedTab('Invited'));
            },
          })}
        />

        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarLabel: 'Chat',
            tabBarIconActive: <ChatActiveSvg />,
            tabBarIconInactive: <ChatSvg />,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarLabel: 'Notifications',
            tabBarIconActive: <NotificationsActiveSvg />,
            tabBarIconInactive: <NotificationsSvg />,
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIconActive: <AccountActiveSvg />,
            tabBarIconInactive: <AccountSvg />,
          }}
        />
        {/* <Tab.Screen
        name="Shop"
        component={Home}
        options={{
          tabBarLabel: 'Shop',
          tabBarIconActive: <ShopIconF />,
          tabBarIconInactive: <ShopIcon />,
        }}
      />

      <Tab.Screen
        name="Models"
        component={Home}
        options={{
          tabBarLabel: 'Models',
          tabBarIconActive: <ModelIconF />,
          tabBarIconInactive: <ModelIcon />,
        }}
      />
      <Tab.Screen
        name="More"
        component={Home}
        options={{
          tabBarLabel: 'More',
          tabBarIconActive: <MoreIconF />,
          tabBarIconInactive: <MoreIcon />,
        }}

      /> */}
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;
