import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import {View, Text} from 'react-native';
import React from 'react';
import Welcome from '../screens/Welcome';
import CreateAccount from '../screens/CreateAccount';
import ForgotPassword from '../screens/ForgotPassword';
import EditProfile from '../screens/EditProfile';
import ResetPassword from '../screens/ResetPassword';
import EmailVerification from '../screens/EmailVerification';
import TabNavigator from './TabNavigator';
import {useSelector} from 'react-redux';
import JobDetails from '../screens/JobDetails';
import EmailSent from '../screens/ForgotPassword';
import ViewBusinessProfile from '../screens/ViewBusinessProfile';
import Inbox from '../screens/Inbox';
import InvitedJobDetails from '../screens/InvitedJobDetails';
import ActiveJobDetails from '../screens/ActiveJobDetails';
import InprogressJobDetails from '../screens/InprogressJobDetails';
import CompleteJobDetails from '../screens/CompleteJobDetails';
import AccountChangePassword from '../screens/AccountChangePassword';
import AccountReviewsScreen from '../screens/AccountReviewsScreen';
import FilterScreen from '../screens/FilterScreen';
import AccountViewProfile from '../screens/AccountViewProfile';
import AccountEditProfile from '../screens/AccountEditProfile';
import PhoneVerification from '../screens/PhoneVerification';
import Address from '../screens/Address';
import OtpVerification from '../screens/OtpVerification';

const LoggedInStack = createStackNavigator();
const AuthStack = createStackNavigator();

const Home = () => {
  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};
const AuthNavigator = () => {
  const welcome = useSelector(state => state.user.welcome);
  return (
    <AuthStack.Navigator
      initialRouteName="AuthStack"
      screenOptions={{
        headerShown: false,
      }}>
      {welcome && (
        <AuthStack.Screen
          name={'Welcome'}
          component={Welcome}
          screenOptions={{
            headerShown: false,
          }}
        />
      )}
      <AuthStack.Screen
        name={'Login'}
        component={Login}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'CreateAccount'}
        component={CreateAccount}
        screenOptions={{
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name={'ForgotPassword'}
        component={ForgotPassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'ResetPassword'}
        component={ResetPassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={'EmailVerification'}
        component={EmailVerification}
        screenOptions={{
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name={'EditProfile'}
        component={EditProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Subscription'}
        component={Home}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'EmailSent'}
        component={EmailSent}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'PhoneVerification'}
        component={PhoneVerification}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Address'}
        component={Address}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'OtpVerification'}
        component={OtpVerification}
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const LoggedInNavigator = () => {
  return (
    <LoggedInStack.Navigator
      initialRouteName="LoggedInStack"
      screenOptions={{
        headerShown: false,
      }}>
      <LoggedInStack.Screen
        name={'BottomTabStack'}
        component={TabNavigator}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'JobDetails'}
        component={JobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ViewBusinessProfile'}
        component={ViewBusinessProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Inbox'}
        component={Inbox}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'InvitedJobDetails'}
        component={InvitedJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'ActiveJobDetails'}
        component={ActiveJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'InprogressJobDetails'}
        component={InprogressJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'CompleteJobDetails'}
        component={CompleteJobDetails}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AccountChangePassword'}
        component={AccountChangePassword}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AccountReviewsScreen'}
        component={AccountReviewsScreen}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'FilterScreen'}
        component={FilterScreen}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AccountViewProfile'}
        component={AccountViewProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'AccountEditProfile'}
        component={AccountEditProfile}
        screenOptions={{
          headerShown: false,
        }}
      />
      <LoggedInStack.Screen
        name={'Address'}
        component={Address}
        screenOptions={{
          headerShown: false,
        }}
      />
    </LoggedInStack.Navigator>
  );
};
const App = () => {
  const isLogin = useSelector(state => state.user.isLogin);
  return <>{isLogin ? <LoggedInNavigator /> : <AuthNavigator />}</>;
};

export default App;
