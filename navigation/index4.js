import React, {Component } from 'react';
import MapScreen from '../screen/driver/tripmap';
import AppRider from './rider';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


const MapNavigator = createStackNavigator({
    tripmap:{
        screen:MapScreen
    }
});
export default createAppContainer(MapNavigator);