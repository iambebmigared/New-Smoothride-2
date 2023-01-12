/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  AppState,
  Alert,
  Linking,
  Platform
} from 'react-native';
import codePush from 'react-native-code-push';
import VersionCheck from 'react-native-version-check';
import { getAppstoreAppVersion } from "react-native-appstore-version-checker";

import beep from './asset/sound/beep.mp3';
import AsyncStorage from '@react-native-community/async-storage';

import AppNavigator from './navigation/index';
import DriverNavigator from './navigation/index2';
import RiderNavigator from './navigation/index3';
import store from './store/store';
import {  Provider } from 'react-redux';
import firebase, { Notification, RemoteMessage } from 'react-native-firebase';
import { objectTypeSpreadProperty } from '@babel/types';
import {connect} from 'react-redux';
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user_data:{},
      appState:AppState.currentState,
      title:'',
      body:'',
      reroute:0 //0
    }
    
    this._getState();

  }
  _getState = async () => {
     //await AsyncStorage.clear();
     let user_data = await AsyncStorage.getItem('user_data');
     if(user_data){
       let data = JSON.parse(user_data);
       if(Object.keys(data).length > 0) this.setState({reroute:1});
       this.setState({user_data:data});
     }
     else{
      this.setState({reroute:2});
     }
  }
 
  openStore = async () =>{
      await VersionCheck.needUpdate()
      .then(async res => {
      if (res.isNeeded) {
        Alert.alert(
                    'Alert',
                    'Update Available',
                    [
                      {text: 'Update', onPress: () => Linking.openURL(VersionCheck.getAppStoreUrl()) }, // open store if update is needed.
                      {text: 'Not Now'}
                    ],
                    {cancelable: false},
        );
       
      }
      });
  }
  componentDidMount = async () => {
    //await AsyncStorage.clear();
    //this.setState({user_data:{}});
    //Alert.alert(VersionCheck.getCurrentVersion());
    //Alert.alert(VersionCheck.getCurrentBuildNumber()); 
    if(Platform.OS == 'ios') this.openStore();
    const fcmToken = await firebase.messaging().getToken();
    
    if (fcmToken) {
        //ßAlert.alert(fcmToken);
        //console.log(fcmToken);
        await AsyncStorage.setItem('device_token', fcmToken);
        this.createNotificationChannel();
        this.getPermission();
        // user has a device token
    } else {
        // user doesn't have a device token yet
    }
  }
  componentWillUnmount() {
    this.messageListener();
    //Alert.alert('dddd');
  }
  processMsg(){
    this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
        // Process your message as required
    });
  }
  getPermission = async () =>{
    const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
          this.messageListener();
          //Alert.alert(enabled.toString());
          // user has permissions
      } else {
          // user doesn't have permission
          try {
            await firebase.messaging().requestPermission();
            // User has authorised
          } catch (error) {
              // User has rejected permissions
          }
      }
  }
  createNotificationChannel = () => {
    // Build a android notification channel
    const channel = new firebase.notifications.Android.Channel(
      "reminder", // channelId
      "Reminders Channel", // channel name
      firebase.notifications.Android.Importance.High // channel importance
    ).setDescription("Used for getting reminder notification"); // channel description
  
    // Create the android notification channel
    firebase.notifications().android.createChannel(channel);
  };
  messageListener = async () => {

    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        const localnotification = new firebase.notifications.Notification({sound: 'default',
        show_in_foreground: true, show_in_background:true})
        .setNotificationId("1") // Any random ID
        .setTitle(title) // Title of the notification
        .setBody(body) // body of notification
        .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
        .android.setChannelId("reminder") // should be the same when creating channel for Android
        .android.setAutoCancel(true); // To remove notification when tapped on it
         firebase.notifications().displayNotification(localnotification);
         this.setState({title:title,body:body});
        //this.buildNotification(title,body);
    });
  
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notificationOpen) => {
        const { title, body } = notificationOpen.notification.data;
        
        //Alert.alert(title);
        this.setState({title:title,body:body});
        //Alert.alert(this.state.title);
        //this.buildNotification(title,body);
        //Alert.alert(title);
        //this.setData();
        
        //this.buildNotification(title,body);
       });
  
    
  
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification.data;
        this.setState({title:title,body:body});
        if(Object.keys(this.state.user_data).length > 0 && this.state.user_data.role == 'staff')
             this.setData();
            //AsyncStorage.setItem('newinformation',true);
        //this.buildNotification(title,body);
    }
  
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
    setData = async () => {
      await AsyncStorage.setItem('tripinformation',true);
    }
  }
  render(){
    return (
      
      <Provider store={store}>
       <View style={{flex:1}}>
            {
              Platform.OS == 'android' && 
              <StatusBar hidden={false} style={{height:20}} backgroundColor="#005091" barStyle="light-content" />
            }
            {
              Platform.OS == 'ios' && 
              <StatusBar hidden={false} style={{height:20}} backgroundColor="#005091" barStyle="light-content" />
            }
         
            
          
            {
              Object.keys(this.state.user_data).length != 0 && this.state.user_data.role == 'driver' && <DriverNavigator screenProps = {{title: this.state.title, body:this.state.body}}/>
            }
            {
              
              Object.keys(this.state.user_data).length != 0 && this.state.user_data.role == 'staff' && <RiderNavigator screenProps = {{title: this.state.title, body:this.state.body}} />
            }
            {
              
              Object.keys(this.state.user_data).length == 0 && this.state.reroute == 2 && <AppNavigator screenProps = {{title: this.state.title, body:this.state.body}}/>
            }
          
       </View> 
      </Provider>
    );
  }
}

/*const App = () => {
  return (
    <Provider store={store}>
       <AppNavigator />
    </Provider>
  );
};*/

const styles = StyleSheet.create({
  
});

const codePushOptions = {
  checkFrequency:codePush.CheckFrequency.ON_APP_START
}
thisApp = codePush(codePushOptions)(App);
export default thisApp;
