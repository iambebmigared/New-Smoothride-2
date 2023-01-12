import React, { Component } from 'react';
import {View, Text, Dimensions,PermissionsAndroid, Image,AppState,Linking,StyleSheet,TextInput,Alert,ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import CardView from 'react-native-cardview';
import MapViewDirections from 'react-native-maps-directions';
import {bookaRide} from '../../action/fetch';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {user_update} from '../../action/fetch';
import {getDriver} from '../../action/fetch';
import { clear_driver } from '../../action/fetch';
import PTRView from 'react-native-pull-to-refresh';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Dialog from "react-native-dialog";

const { width, height  } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.006339428281933124;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let mapheight = height;
const mapviewheight = parseInt(mapheight);
const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU';

class BookRideScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rider_update:false,
            isFetching: false,
            isFetchingCompleted:false,
            showDialog: false,
            position:{},
            appState:''
        }
    }
    static navigationOptions = {
        header:null
    };
    
      getMapRegion = () => ({
        latitude: this.state.position.coords.latitude,
        longitude: this.state.position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
    render(){
        return (
            <MapView initialRegion={this.getMapRegion()} style={{height:mapviewheight}}>
                <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                />
            </MapView>
        );
    }
}
const styles = StyleSheet.create({
    header:{
        backgroundColor:'#007cc2',
        alignSelf:'center',
        width:'100%',
        padding:14
    },
    actionbtn:{
        alignSelf:'center',color:'#fff',fontSize:18,
        fontFamily:'Roboto-Regular'
    },
    cardview:{
        padding:10,
        marginTop:10,
        position:"absolute",
        top:0,
        width:'100%'
    },
    headerText:{
        fontSize:20,
        alignSelf:'center',
        color:'#fff',
        fontFamily:'Roboto-Regular'
    },
    details:{
        padding:10,
        fontSize:14,
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        fontWeight:'900',
        fontFamily: "Roboto-Regular"
    },
    time:{
        color:'#007cc2',
        fontSize:13
    }
});
const mapStateToProps = state =>{
    return {
        data:state.DataReducer,
        driver:state.DriverReducer
    }
}
export default connect(mapStateToProps)(BookRideScreen);