import React, {Component } from 'react';
import LoginScreen from '../screen/login';
import PointsScreen from '../screen/tripmap';
import AppRider from './rider';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const RiderNavigator = createStackNavigator({
    Ridertab:{
        screen: AppRider,
        navigationOptions: {
            header: null,
        },
    },
    login:{
        screen:LoginScreen
    },
    tripmap:{
        screen:PointsScreen,
        navigationOptions: {
            header: null,
        },
    }
});
export default createAppContainer(RiderNavigator);