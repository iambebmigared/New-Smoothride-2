import React, {Component } from 'react';
import LoginScreen from '../screen/login';
import AppRider from './rider';
import AppDriver from './driver';
import PointsScreen from '../screen/tripmap';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const DriverNavigator = createStackNavigator({
    Drivertab:{
        screen: AppDriver,
        navigationOptions: {
            header: null,
        },
    },
    tripmap:{
        screen:PointsScreen,
        navigationOptions: {
            header: null,
        },
    },
    login:{
        screen:LoginScreen
    },
});
export default createAppContainer(DriverNavigator);