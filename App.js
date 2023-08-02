import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import GlobalFont from 'react-native-global-font';
import OneSignal from 'react-native-onesignal';
import {SafeAreaView} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import './IgnoreWarnings';
import RootNavigator from './src/navigation/index';
import {persistor, store} from './src/redux/store';

function App() {
  useEffect(() => {
    let fontName = 'SofiaPro';
    GlobalFont.applyGlobal(fontName);
    // SplashScreen.hide();
  });
  setTimeout(() => {
    SplashScreen.hide();
  }, 3000);

  useEffect(() => {
    OneSignal.setAppId('89617140-287a-40d4-956b-d72ef6b06504');
    // OneSignal.setAppId('bd01b444-c3b4-4785-8d55-b03395730ba7');

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      notificationReceivedEvent => {
        let notification = notificationReceivedEvent.getNotification();
        notificationReceivedEvent.complete(null);
      },
    );
  }, []);

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </KeyboardAvoidingView>
  );
}

export default App;
