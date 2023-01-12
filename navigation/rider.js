import React, {Component} from 'react';
import { createAppContainer} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookRideScreen from '../screen/rider/rider';
import ProfileScreen from '../screen/rider/profile';
import  TripScreen  from '../screen/rider/trips';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AppRider = createBottomTabNavigator({
  Book:{
    screen:BookRideScreen,
    navigationOptions: {
      title:'Request',
      headerTitle:'Yes'
    }
  },
  Trips:{
    screen:TripScreen,
    navigationOptions: {
      header: null,
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
        } else if (routeName === 'Profile') {
          iconName = `ios-person`;
        } 
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#005091',
      inactiveTintColor: '#c1c1c1',
      style:{
        backgroundColor:'#ffffff'
      },
    },
  }
);
AppRider.navigationOptions = {
  header: null,
};
export default createAppContainer(AppRider);