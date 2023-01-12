import React, {Component } from 'react';
import LoginScreen from '../screen/login';
import ForgetScreen from '../screen/forgetpassword';
import AppRider from './rider';
import AppDriver from './driver';
import PointsScreen from '../screen/tripmap';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppNavigator = createStackNavigator({
    login:{
        screen:LoginScreen
    },
    forget:{
        screen:ForgetScreen
    },
    tripmap:{
        screen:PointsScreen,
        navigationOptions: {
            header: null,
        },
    },
    Drivertab:{
        screen: AppDriver,
        navigationOptions: {
            header: null,
        },
    },
    Ridertab:{
        screen: AppRider,
        navigationOptions: {
            header: null,
        },
    }
});
export default createAppContainer(AppNavigator);



//export default createAppContainer(AppNavigator);