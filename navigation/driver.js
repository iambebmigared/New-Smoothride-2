import React, {Component} from 'react';
import { createAppContainer} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookRideScreen from '../screen/driver/driver';
import ProfileScreen from '../screen/driver/profile';
import  TripScreen  from '../screen/driver/trips';
import  PendingScreen  from '../screen/driver/pendings';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AppDriver = createBottomTabNavigator({
  Book:{
    screen:BookRideScreen,
    navigationOptions: {
      title:'Start Ride',
      headerTitle:'Yes'
    }
  },
  Trips:{
    screen:TripScreen,
    navigationOptions: {
      header: null,
    }
  },
  Pending:{
    screen:PendingScreen,
    navigationOptions: {
      title:'Pending Data',
      headerTitle:'Yes'
    }
  },
  Profile:ProfileScreen
},
{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Book') {
          iconName = `md-car`; 
        }
        else if (routeName === 'Trips') {
          iconName = `md-car`; 
        } else if (routeName === 'Pending') {
          iconName = `ios-information-circle`;
        } 
        else if (routeName === 'Profile') {
          iconName = `ios-person`;
        } 
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      inactiveTintColor: '#c1c1c1',
      style:{
        backgroundColor:'#005091'
      },
    },
  }
);
AppDriver.navigationOptions = {
  header: null,
};
export default createAppContainer(AppDriver);