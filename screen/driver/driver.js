import React, { Component } from 'react';
import {View, Text,Dimensions,KeyboardAvoidingView,BackHandler,Picker,Platform,TextInput,StatusBar, ImageBackground,AppState,StyleSheet,Image,PermissionsAndroid,Alert,Linking,ActivityIndicator,TouchableHighlight,SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import CardView from 'react-native-cardview';
import {connect} from 'react-redux';
import PTRView from 'react-native-pull-to-refresh';
import { getTrip } from '../../action/fetch';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import haversine  from 'haversine-distance';
import {completedtrip} from '../../action/fetch';
import {user_update} from '../../action/fetch';
import AsyncStorage from '@react-native-community/async-storage';
import {startAddress} from '../../action/fetch';
import {endAddress} from '../../action/fetch';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker,Polyline } from 'react-native-maps';
import { updatetripstatus } from '../../action/fetch';
import { continuetrip } from '../../action/fetch';
import { clear_rider } from '../../action/fetch';
import {declinetrip} from '../../action/fetch';
import {driver_status,endWaiting} from '../../action/fetch';
import Dialog from "react-native-dialog";
import { ProgressDialog } from 'react-native-simple-dialogs';
import { update_triptime } from '../../action/fetch';
import { update_tripPosition } from '../../action/fetch';
import { updateMoreTripInformation } from '../../action/fetch';
import { endTripTimeInfo } from '../../action/fetch';
import { updatelastPoint } from '../../action/fetch';
import { updateFinalTripInfo } from '../../action/fetch';
import { clearTripState } from '../../action/fetch';
import { updateResultTripInfo } from '../../action/fetch';
import { resetTripCount, user_login,validateTrip } from '../../action/fetch';
import Modal from 'react-native-modal';
import { getSavedRiderInfo,acceptTrip } from '../../action/fetch';
import { getSavedTripInfo } from '../../action/fetch';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import  NetInfo from "@react-native-community/netinfo";
//import { FAB } from 'react-native-paper';



const { width, height  } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.006339428281933124;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let mapheight = (height * 2) / 3;
//let mapheight = height;
const mapviewheight = parseInt(mapheight);
const status_bar_height = Platform.OS == 'ios' ? 20 : 0;
let watchID;
let permissionMsg = "";
const managestate = [
  {label: 'Offline', value: 'Offline' },
  {label: 'Online', value: 'Online' }
 ];
 const tripissues = [
  {label:'Unavailable for Trip', value:'reassign'},
  {label:'Trip Declined by Rider', value:'decline'}
 ];
 

 
class BookRideScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            FetchingisTripValid:false,
             opacity:1,
             textFocus:'',
             startIssueLocation:'',
             endIssueLocation:'',
             showTripInfomodal:true,
             clearAllRiderData:false,
             startTime:'',
             driverrequest:false,
             reason:'',
             request:'Online',
             endTime:'',
             isStarted:false,
             distance_covered:0,
             position:{},
             prevposition:{},
             waypoints:[],
             firstLat:0,
             firstLng:0,
             lastLat:0,
             lastLng:0,
             cost:0,
             unformattedcost:0,
             lasttrip:{},
             alltrips:[],
             getAddress:false,
             startAddress:'',
             stopAddress:'',
             startHour:'',
             startMin:'',
             startSec:'',
             endHour:'',
             endMin:'',
             endSec:'',
             travelTime:0,
             isFetching:false,
             device_token:'',
             isEnded:false,
             showDialog: false,
             showDialogforExit:false,
             driver_mode:'Online',
             isFirstTrip:true,
             isrequesting:false,
             isSavingAvailability:false,
             routeCoordinates:[],
             appState:AppState.currentState,
             decline:false,
             mode_num:0,
             reasonfordecline:'',
             getlocationmodal:false,
             locationFromGoogle:[],
             gettingInputLocation:false,
             costAvailable:false,
             msgTitle:'',
             TripInfo:'',
             ontrip: false,
             coordinate: new AnimatedRegion({
                latitude: 23,
                longitude: 90,
                latitudeDelta:LATITUDE_DELTA,
                longitudeDelta:LONGITUDE_DELTA
            })

          };
    }
    static navigationOptions = {
        header:null
    };

    async componentDidUpdate(previousProps,previousState)
    {
        //this.NetworkState();
        this.UpdatePropsTrip(previousProps,previousState);  
    }

    NotifyIfIssue = () => 
    {
        //if(Object.keys(this.props.drivertrip.prevposition) == 0 && this.props.drivertrip.isStarted == false)
        //{
            Alert.alert(
                'Alert',
                `We Observed the Google Map does not Load...Have you reach your destination?`,
                [
                  {text: 'Yes', onPress: () => this.setState({showTripInfomodal:true})},
                  {text: 'No'},
                ],
                {cancelable: false},
              );
        //}
    }
    NetworkState = async () => {
        let state = await NetInfo.fetch();
        if(state.isConnected == false)
        {
            Alert.alert(
                'Alert',
                'No Internet Connection',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
              return false;
        }
        if(state.isInternetReachable == false)
        {
            Alert.alert(
                'Alert',
                'Internet Connection not Accessible',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
              return false;
        }
    }
    UpdatePropsTrip = async (previousProps,previousState) => {
        const { title, body } = this.props.screenProps;
        if(previousProps.screenProps != this.props.screenProps)
        {
              if(title == 'New Trip') this.fetchData();
              if(title == 'cancel' || title == 'Cancel') this.tripStatus();
              
              if(title != null && body != null)
              {
                //Alert.alert(title);  
                await this.setState({costAvailable:true,msgTitle:title,TripInfo:body});
              }
              //await this.setState({costAvailable:true,msgTitle:title,TripInfo:body});

        }
    }
    async tripStatus()
    {
        
        if(this.props.drivertrip.isValidTrip == '' && this.props.rider.trip_id != '')
        {
            let status = await this.props.dispatch(validateTrip(this.props.data.access_token,this.props.rider.trip_id));
            //Alert.alert(this.props.drivertrip.isValidTrip);
            if(this.props.drivertrip.isValidTrip == false)
            {
                this.setState({clearAllRiderData:true});
                this.exitthistrip();
            }
        }
        //Alert.alert('okay');
    }
    checkforlastRide = async () => {
        if(this.props.rider.rider_id == ''){
            let rider_data = await AsyncStorage.getItem('stillontripwith');
            let tripdetails = await AsyncStorage.getItem('stillontripData');
            //console.log(rider_data);
            //Alert.alert('Get Value');
            if(rider_data !== null && tripdetails !== null){
                let r_data = JSON.parse(rider_data);
                let trip_data = JSON.parse(tripdetails);
                if(Object.keys(r_data).length > 0 && Object.keys(trip_data).length > 0){
                    await  this.props.dispatch(getSavedRiderInfo(r_data));
                    await  this.props.dispatch(getSavedTripInfo(trip_data));
                    //console.log(trip_data);
                    //Alert.alert('Get Value 2');
                    if(this.props.drivertrip.isStarted == true && Object.keys(this.props.drivertrip.prevposition).length > 0 && this.props.drivertrip.getAddress == false) 
                       this.watchLocation();
                    else if(this.props.drivertrip.isStarted == true && Object.keys(this.props.drivertrip.prevposition).length == 0 && this.props.drivertrip.getAddress == false)
                       this.getLocation();  
                    else if(this.props.drivertrip.getAddress == true){
                        //Alert.alert('Get Value 3');
                        this.stopTrip();
                    }
                       
                }
            }
            
            
        }
    }
    _getState = async () => {
        let user_data = await AsyncStorage.getItem('user_data');
        let device_token = await AsyncStorage.getItem('device_token');
        this.setState({device_token:device_token});
        let information = await AsyncStorage.getItem('tripinformation');
        if(information == true) this.setState({rider_update:true});
        let data = JSON.parse(user_data);
        if(this.props.data.user_id == '' && Object.keys(data).length > 0)
          await  this.props.dispatch(user_update(data));
          await this.checkforlastRide();
          this.fetchData();
        //console.error(this.props.data);
          
    }
    keepData = async ()=>{
        await AsyncStorage.setItem('stillontripwith',JSON.stringify(this.props.rider));
        await AsyncStorage.setItem('stillontripData',JSON.stringify(this.props.drivertrip));
    }
    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.fetchData();
            //this.componentDidUpdate(this.props.pre);
            //console.error(this.props.screenProps);
            //Alert.alert('here');
            //App has come to the foreground
            this.checkforlastRide();
        }else{
            //Alert.alert('here iop');
            //App is going to background
            this.keepData();
        }
        this.setState({appState: nextAppState});
    }
    handleAndroidBackButton = () => {
        BackHandler.addEventListener('hardwareBackPress', () => {
             //this.checkforlastRide();
             this.keepData();
             return true;
        });
      };
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', () =>{});
    }
    update_driver_status = async (val) => {
        try {
          await AsyncStorage.setItem('driver_status',val);
          this.setState({driver_mode:val.toString()});
        } catch(e) {
        }
      }
    getDriverMode = async () => {
       let mode = await AsyncStorage.getItem('driver_status');
       if(mode !== null) {
        this.setState({driver_mode:mode.toString()});
        if(mode.toString() == 'Online') this.setState({mode_num:1});
        else if(mode.toString() == 'Offline') this.setState({mode_num:0});
       }
       
    }
    updateToken = async () => {
      let formdata = await AsyncStorage.getItem('formdata');
      const device_token = await AsyncStorage.getItem('device_token');
      if(formdata != null){
         formdata = JSON.parse(formdata);
         //console.error(formdata);
         this.props.dispatch(user_login(formdata.email,formdata.password,device_token));
      }
    }
    async componentDidMount(){
        let state = await this.NetworkState();
        if(state == false) return false;
        //this.props.navigation.navigate('map');
        //console.log('okaying');
        //Alert.alert(Platform.OS);
        //console.error(NetInfo.isConnectionExpensive());
        this.updateToken();
        if(Platform.OS === 'android') this.handleAndroidBackButton();
        AppState.addEventListener('change', this._handleAppStateChange);
        this.getDriverMode();
        if(Platform.OS === 'android'){
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
            .then(data => {
                this._getState();
                //this.getLocation
                //Alert.alert('aaaa');
            }).catch(err => {
            //console.error(err.toString());
            });
        }else {
            this._getState();
        }
        
    }
    fetchData = async () =>{
        let user_id = this.props.data.user_id;
        let token = this.props.data.access_token;
        //.alert(token);
        
        if(this.props.rider.rider_id == ''){
             this.setState({isFetching:true});
             const trip = await this.props.dispatch(getTrip(user_id,token));
             this.setState({isFetching:false});
        }
        
    }
    _refresh = async () => {
        let user_id = this.props.data.user_id;
        let token = this.props.data.access_token;
        if(this.props.rider.rider_id == ''){
           const trip = await this.props.dispatch(getTrip(user_id,token));
        }
        //Alert.alert(this.props.rider.rider_email);
        return new Promise((resolve) => {
         
          setTimeout(()=>{resolve()}, 2000)
        });
      };
    toggleDialog = () => {
      this.setState({driverrequest:!this.state.driverrequest });
    };
    dismissmodal = () =>{
        this.setState({driverrequest:!this.state.driverrequest});
    }
    onopentoexit = () => {
        this.setState({showDialogforExit:!this.state.showDialogforExit});
    }
    showDialog = () => {
      this.setState({showDialog:true});
    };
    sendrequest = async () => {
            //Alert.alert(this.state.request);
            //return false;
            if(this.state.reason == '') {
              Alert.alert(
                    'Alert',
                    'Kindly state the reason why you are changing state',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
              return false;
            }
            if(this.state.request == '') {
              Alert.alert(
                    'Alert',
                    'Kindly select the state',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
              return false;
            }
            let data = {reason:this.state.reason,isAvailable:this.state.request};
            this.setState({isrequesting:true});
            await fetch('https://www.smoothride.ng/taxi/api/driverrequeststate', {
                method:'POST',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${this.props.data.access_token}`
                },
                body: JSON.stringify(data)
            }).then(async data => data.json()).then(data => {
                //console.error(data);
                  this.setState({isrequesting:false}); 
                  if(data.success == true){
                    this.update_driver_status(this.state.request);  
                    this.setState({reason:''});  
                    Alert.alert(
                        'Alert',
                        `${data.message}`,
                        [
                          {text: 'OK', onPress: () => this.setState({driverrequest:!this.state.driverrequest})},
                        ],
                        {cancelable: false},
                      );
                  }      
              }).catch(err => {
                  this.setState({isrequesting:false});
                  Alert.alert(
                    'Alert',
                    'No Internet Connection',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
              });
    }
    declineTrip = () => {
        this.setState({decline:!this.state.decline});
    }
    declinenow = async () => {
        if(this.state.reasonfordecline == '') { return false }
        this.setState({isrequesting:true});
        let data = {reason:this.state.reasonfordecline,trip_id:this.props.rider.trip_id}; 
        //console.error(data);
        //return false;
        await fetch('https://www.smoothride.ng/taxi/api/driverdeclinetrip', {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer ${this.props.data.access_token}`
            },
            body: JSON.stringify(data)
        }).then(async data => data.json()).then(async data => {
              this.setState({isrequesting:false,decline:false}); 
              if(data.success == true){
                //this.update_driver_status(this.state.request);
                await this.props.dispatch(clear_rider(this.props.rider.trip_id,this.props.data.access_token,''));  
                //console.error(this.props.rider.rider_id);
                this.fetchData();
                this.setState({reason:''});
                //this.setState({decline:!this.state.decline});  
                Alert.alert(
                    'Alert',
                    `${data.message}`,
                    [
                      {text: 'OK', onPress: () => this.setState({decline:false})},
                    ],
                    {cancelable: false},
                  );
              }      
          }).catch(err => {
              this.setState({isrequesting:false});
              //console.error(JSON.stringify(err));
              Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
          });
    }
    handleoffline = async () => {
        this.setState({isSavingAvailability:true});   
        await this.props.dispatch(driver_status('offline',this.props.data.access_token));
        this.setState({ showDialog: !this.state.showDialog });
        this.setState({isSavingAvailability:false});  
        this.getDriverMode();
    }
    handleonline = async () => {
        this.setState({isSavingAvailability:true});
        await this.props.dispatch(driver_status('online',this.props.data.access_token));  
        this.setState({ showDialog: !this.state.showDialog });
        this.setState({isSavingAvailability:false}); 
        this.getDriverMode();
    }
    handlecancel = () => {
        this.setState({ showDialog: !this.state.showDialog });
    }
     
      
      call = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${this.props.rider.rider_phone}`;
          }
          else {
            phoneNumber = `telprompt:${this.props.rider.rider_phone}`;
          }
          Linking.openURL(phoneNumber);
      }
      toHHMMSS = (secs) => {
        let sec_num = parseInt(secs, 10)
        let hours   = Math.floor(sec_num / 3600)
        let minutes = Math.floor(sec_num / 60) % 60
        let seconds = sec_num % 60
    
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
      }
      ValidTrip = async () => 
      {
        this.setState({FetchingisTripValid:true,opacity:0});
        await this.props.dispatch(validateTrip(this.props.data.access_token,this.props.rider.trip_id));
        this.setState({FetchingisTripValid:false,opacity:1});
        let status = await this.props.drivertrip.isValidTrip;
        return status;
        
      }
      startTrip = async () => {  
        let state = await this.NetworkState();
        if(state == false) return false;  
        let locationAccessPermission = await this.locationAccessPermission();
        if(locationAccessPermission == false) return false;
        let status = await this.ValidTrip(); 
        if(status == false)
        {
            Alert.alert(
                'Alert',
                'This Trip has been Cancelled by the Rider. Kindly wait for a new request.',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
            );
            this.setState({clearAllRiderData:true});
            this.exitthistrip();
            return false;
        } 
        else if(status == 'unknown')
        {
            Alert.alert(
                'Alert',
                'Cannot Establish Connection with the server. kindly try again',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
            );
            return false;
        }else if(status != true)
        {
            Alert.alert(
                'Alert',
                'Cannot Validate this trip',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
            );
            return false;
        }
        
        let date =  new Date(Date.now());
        let startDate = date.toString();
            if(this.props.drivertrip.endTime != ''){
                let data = {
                    startTime: this.props.drivertrip.startTime,
                    endTime:this.props.drivertrip.endTime,
                    cost:this.props.drivertrip.cost,
                    distance_covered:this.props.drivertrip.distance_covered,
                    isFirstTrip:this.props.drivertrip.isFirstTrip,
                    rider_name: this.props.rider.rider_name,
                    trip_id:this.props.rider.trip_id
                }
                let lat = 23;
                let lng = 90;
                let date =  new Date(Date.now());
                let start = Date.parse(this.props.drivertrip.endTime);
                let end = Date.parse(startDate);
                let diff = (end - start) / 1000;
                let startwaitingTime = await AsyncStorage.getItem('startWaitingTime');
                const endinfo = {
                    waitingTime:diff,
                    startwaitingTime:startwaitingTime,
                    endwaitingTime:startDate
                };
                //Alert.alert(startwaitingTime);
                await this.props.dispatch(endWaiting(endinfo));
                this.props.dispatch(clearTripState());
                this.setState(
                    {
                        startTime:'',
                        endTime:'',
                        isStarted:false,
                        distance_covered:0,
                        position:{},
                        prevposition:{},
                        firstLat:0,
                        firstLng:0,
                        lastLat:0,
                        lastLng:0,
                        cost:0,
                        unformattedcost:0,
                        lasttrip:data,
                        getAddress:false,
                        startAddress:'',
                        stopAddress:'',
                        startHour:'',
                        startMin:'',
                        startSec:'',
                        endHour:'',
                        endMin:'',
                        endSec:'',
                        travelTime:0,
                        isEnded:false,
                        isSavingAvailability:false,
                        routeCoordinates:[],
                        waypoints:[],
                        coordinate: new AnimatedRegion({
                            latitude: lat,
                            longitude: lng,
                            latitudeDelta:LATITUDE_DELTA,
                            longitudeDelta:LONGITUDE_DELTA

                        })
                    });
            }
            if(this.props.rider.price_config == null || this.props.rider.price_config.perkm == null || this.props.rider.price_config.permin == null || this.props.rider.price_config.basefare == '' || this.props.rider.price_config.waitpermin == '' || this.props.rider.price_config.basefare == ''){
                Alert.alert(
                    'Alert',
                    'Price Configuration for this user is not Set, Contact the Administrator',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                );
                return false;
            }
            //console.error(this.props.rider.price_config);
            //return false;
            this.setState({startHour:date.getHours(),startMin:date.getMinutes(),startSec:date.getSeconds()});
            this.setState({startTime: startDate,isStarted:!this.state.isStarted});
            const TripTime = {
                startHour:date.getHours(),
                startMin:date.getMinutes(),
                startSec:date.getSeconds(),
                startTime:startDate,
                isStarted:!this.props.drivertrip.isStarted
            };
            this.props.dispatch(update_triptime(TripTime));
            //console.error(this.props.drivertrip);
            await this.props.dispatch(updatetripstatus(this.props.rider.trip_id,this.props.data.access_token));
            this.getLocation();
            /*
            try {
                if(Platform.OS === 'android') {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getLocation();
                    } else {
                        Alert.alert(
                            'Alert',
                            'You have denied location Access, hence you can not start trip',
                            [
                              {text: 'OK'},
                            ],
                            {cancelable: false},
                        );
                        //return false;
                    }
                }else {
                    this.getLocation();
                }
                
            }catch{

            }
            */
      }
      locationAccessPermission = async () => {
        try {
            if(Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //this.getLocation();
                    return true;
                } else {
                    Alert.alert(
                        'Alert',
                        'You have denied location Access, hence you can not start trip',
                        [
                          {text: 'OK'},
                        ],
                        {cancelable: false},
                    );
                    return false;
                }
            }else {
                //this.getLocation();
                return true;
            }
            
        }catch{
            return false;
        }
      }

      getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                if(parseFloat(position.coords.accuracy) > 200) {
                  this.getLocation(); return false; 
                }   
                //console.error(position);
                //return false;
                this.setState({prevposition:position,firstLat:position.coords.latitude,firstLng:position.coords.longitude});
                this.setState({position:position});
                let date =  new Date(Date.now());
                let LocationDate = date.toString();
                //console.error(position);
                //return false;
                //this.getStartAddress(position.coords.latitude,position.coords.longitude);
                const TripPosition = {
                    prevposition:position,
                    firstLat:position.coords.latitude,
                    firstLng:position.coords.longitude,
                    position:position,
                    firstLocationTime:LocationDate
                };
                this.props.dispatch(update_tripPosition(TripPosition));
                this.watchLocation();
                //this.props.drivertrip.coordinate.timing({latitude:position.coords.latitude,longitude:position.coords.longitude}).start();
                this.state.coordinate.timing({latitude:position.coords.latitude,longitude:position.coords.longitude}).start();
                //this.setState({prevLat:position.coords.latitude,prevLng:position.coords.longitude});
                //console.error(position);
            },
            (error) => {
                // See error code charts below.
                //console.error(error.code, error.message);
                Alert.alert(
                    'Alert',
                    'Error getting your current location, Click OK to try again',
                    [
                      {text: 'OK', onPress: () => this.getLocation()},
                    ],
                    {cancelable: false},
                );
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
      getmarker = (newCoordinate) => {
        if (Platform.OS === "android") {
            if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
             );
            }
          } else {
            this.state.coordinate.timing(newCoordinate).start();
          }
      }
      oncompleted = async () => {
        let rider = this.state.clearAllRiderData == true ? '' : this.props.rider.rider_id; 
        await this.props.dispatch(clear_rider(this.props.rider.trip_id,this.props.data.access_token,rider));
        if(this.props.rider.trip_id != '') return false;
        if(this.state.clearAllRiderData == false) this.setState({showDialogforExit:!this.state.showDialogforExit});
        //this.setState({clearAllRiderData:false});
        this.props.dispatch(clearTripState());
        this.props.dispatch(resetTripCount());
        AsyncStorage.removeItem('stillontripwith');
        AsyncStorage.removeItem('stillontripData');
        this.setState(
            {
                startTime:'',
                endTime:'',
                isStarted:false,
                distance_covered:0,
                position:{},
                prevposition:{},
                firstLat:0,
                firstLng:0,
                lastLat:0,
                lastLng:0,
                cost:0,
                unformattedcost:0,
                lasttrip:{},
                getAddress:false,
                startAddress:'',
                stopAddress:'',
                startHour:'',
                startMin:'',
                startSec:'',
                endHour:'',
                endMin:'',
                endSec:'',
                travelTime:0,
                isSavingAvailability:false,
                isEnded:false,
                isFirstTrip:true,
                routeCoordinates:[],
                coordinate: new AnimatedRegion({
                    latitude: 23,
                    longitude: 90,
                    latitudeDelta:LATITUDE_DELTA,
                    longitudeDelta:LONGITUDE_DELTA

                })
            });
        this.props.dispatch(acceptTrip(false));     
        this._refresh();
      }
      exitthistrip = async () => {
        //this.setState({isFetching:true});
        //Alert.alert(this.props.data.access_token);
        //this.setState({showDialogforExit:!this.state.showDialogforExit});
        this.oncompleted();
        
        //await this.props.dispatch(clear_driver(this.props.data.access_token));
        //this.setState({isFetching:false});
        
    }
      decline = async () => {
        await this.props.dispatch(declinetrip(this.state,this.props.data,this.props.rider));
      }
      dismissdeclinemodal = () =>{
        this.setState({decline:!this.state.decline});
      }
      getMapRegion = () => ({
        latitude: this.props.drivertrip.position.coords.latitude,
        longitude: this.props.drivertrip.position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
      watchLocation = () => {
        this.watchID = Geolocation.watchPosition(
            (position) => {
            if(parseFloat(position.coords.accuracy) > 50) return false;   
                this.setState({position:position});
                let waypoints = {latitude:position.coords.latitude,longitude:position.coords.longitude};
                let points = this.state.waypoints;
                let pointsprops = this.props.drivertrip.waypoints;
                points.push(waypoints);
                pointsprops.push(waypoints);
                this.setState({waypoints:points});
                //let a = { latitude: this.state.prevposition.coords.latitude, longitude: this.state.prevposition.coords.longitude };
                let a = { latitude: this.props.drivertrip.prevposition.coords.latitude, longitude: this.props.drivertrip.prevposition.coords.longitude };
                let b = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                let distance = haversine(a,b) + parseFloat(this.props.drivertrip.distance_covered);
                //Alert.alert(distance.toFixed(2)+'_'+this.state.distance_covered);
                let formatted_distance = 0;
                if(distance != null && distance != undefined){
                    formatted_distance = distance.toFixed(2);
                    this.setState({ distance_covered:formatted_distance });
                }
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                const newCoordinate = {latitude:latitude, longitude:longitude,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA }
                //Alert.alert(this.marker);
                //this.getmarker(newCoordinate);
                //Alert.alert(distance.toString());
                this.setState({prevposition:position});
                this.setState({routeCoordinates: this.state.routeCoordinates.concat([newCoordinate])});

                const moretripInfo = {
                     position:position,
                     waypoints:pointsprops,
                     prevposition:position,
                     routeCoordinates:this.props.drivertrip.routeCoordinates.concat([newCoordinate]),
                     distance_covered:formatted_distance
                }
                this.props.dispatch(updateMoreTripInformation(moretripInfo));
                this.keepData();
                //console.error(position);
            },
            (error) => {
                // See error code charts below.
                //console.error(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter : 100 }
        );

      }
      stopTrip = async () => {
        //this.checkIfMapLoadOnTime();  
          let state = this.NetworkState();
          if(state == false) return false;
          Geolocation.stopObserving();
          let startDateTime = Date.parse(this.props.drivertrip.startTime);
          let firstlocationTime = Date.parse(this.props.drivertrip.firstLocationTime);
          let diff = (firstlocationTime - startDateTime) / 1000;
          if(diff > 20){
              this.setState({getlocationmodal:!this.state.getlocationmodal});
              return false;
          }
        let date =  new Date(Date.now());
        this.setState({getAddress:true});
        this.setState({endHour:date.getHours(),endMin:date.getMinutes(),endSec:date.getSeconds()});
        
        const endinfo = {
            isEnded:false,
            isEndingTrip:true,
            getAddress:true
        };
        this.props.dispatch(endTripTimeInfo(endinfo));
        try {
            if(Platform.OS === 'android'){
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.clearWatch(this.watchID);
                    this.getLastLocation();
                } else {
                    Alert.alert("Access Denied");
                }
            }else{
                Geolocation.clearWatch(this.watchID);
                this.getLastLocation();
            }
            
        }catch{

        }
        
      }
      getLastLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                if(parseFloat(position.coords.accuracy) > 200) {this.getLastLocation(); return false; }  
                this.setState({lastLat:position.coords.latitude,lastLng:position.coords.longitude});
                let formatted_distance = 0;
                if(Object.keys(this.props.drivertrip.prevposition).length > 0){
                    let a = { latitude: this.props.drivertrip.prevposition.coords.latitude, longitude: this.props.drivertrip.prevposition.coords.longitude };
                    let b = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    let distance = haversine(a,b) + parseFloat(this.props.drivertrip.distance_covered);
                    //let formatted_distance = 0;
                    if(distance != null && distance != undefined){
                        formatted_distance = distance.toFixed(2);
                        this.setState({ distance_covered:formatted_distance });
                    }
                }
                const lastpoints = {
                    lastLat:position.coords.latitude,
                    lastLng:position.coords.longitude,
                    distance_covered: Object.keys(this.props.drivertrip.prevposition).length > 0 ? formatted_distance : this.props.drivertrip.distance_covered
                };
                this.props.dispatch(updatelastPoint(lastpoints));
                this.getEndAddress(position.coords.latitude,position.coords.longitude);
                //console.error(this.props.drivertrip);
            },
            (error) => {
                // See error code charts below.
                //console.error(error.code, error.message);
                Alert.alert(
                    'Alert',
                    'Error getting your current location, Click OK to try again',
                    [
                      {text: 'OK', onPress: () => this.getLastLocation()},
                    ],
                    {cancelable: false},
                );
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
      getStartAddress = async (latitude,longitude) => {
          await this.props.dispatch(startAddress(latitude,longitude));
          //Alert.alert(this.props.rider.startAddress);
          this.setState({startAddress:this.props.rider.startAddress});
      }
      getEndAddress = async (latitude,longitude) => {
        let date =  new Date(Date.now());
        this.setState({endTime: date.toString()});
        //await this.props.dispatch(endAddress(latitude,longitude));
        this.setState({stopAddress:this.props.rider.endAddress});
        let diskm = parseFloat(this.props.drivertrip.distance_covered) / 1000;
        let farekm = diskm * parseFloat(this.props.rider.price_config.perkm);
        let startSec = Date.parse(this.props.drivertrip.startTime);
        let endSec = Date.parse(this.state.endTime);
        let diff = (endSec - startSec) / 1000;
        let secspent = (diff / 60) * parseFloat(this.props.rider.price_config.permin);
        let totalcost = farekm + secspent + parseFloat(this.props.rider.price_config.basefare);
        let unformattedcost = farekm + secspent + parseFloat(this.props.rider.price_config.basefare);
        totalcost = totalcost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let travelTime = diff;
        //waiting Cost
        let totalwaitingcost = (parseFloat(this.props.drivertrip.waitingTime) / 60) * parseFloat(this.props.rider.price_config.waitpermin);
        this.setState({cost:totalcost,unformattedcost:unformattedcost,travelTime:travelTime});
        this.setState({getAddress:true});
        let endDateTime = this.state.endTime; 
        //this.setState({endTime: date.toString()});
        const lastParam = {
            stopAddress:this.props.rider.endAddress,
            cost:totalcost,
            unformattedcost:unformattedcost,
            travelTime:travelTime,
            endTime:endDateTime,
            totalwaitingcost:totalwaitingcost,
            getAddress:true
        };
        await this.props.dispatch(updateFinalTripInfo(lastParam));
        if(this.props.drivertrip.isFirstTrip == true)
          await this.props.dispatch(completedtrip(this.props.drivertrip,this.props.data,this.props.rider));
        else
          await this.props.dispatch(continuetrip(this.props.drivertrip,this.props.data,this.props.rider));
          let alltrips = [];
          if(this.props.drivertrip.tripSavingStatus == false){
            const endinfo = { isEnded:true,isEndingTrip:false };
            await this.props.dispatch(endTripTimeInfo(endinfo));
            return false;
          }
          let data = {
            startTime: this.props.drivertrip.startTime,
            endTime:date.toString(),
            cost:this.props.drivertrip.cost,
            distance_covered:this.props.drivertrip.distance_covered,
            isFirstTrip:this.props.drivertrip.isFirstTrip,
            rider_name: this.props.rider.rider_name,
            trip_id:this.props.rider.trip_id,
            state:{
                firstLat:this.props.drivertrip.firstLat,
                firstLng:this.props.drivertrip.firstLng,
                lastLat:this.props.drivertrip.lastLat,
                lastLng:this.props.drivertrip.lastLng,
                startAddress:this.props.drivertrip.startAddress,
                stopAddress:this.props.drivertrip.stopAddress,
                cost:this.props.drivertrip.cost,
                unformattedcost:this.props.drivertrip.unformattedcost,
                endTime:this.props.drivertrip.endTime,
                startTime:this.props.drivertrip.startTime,
                distance_covered:this.props.drivertrip.distance_covered,
                travelTime:this.props.drivertrip.travelTime,
                waypoints:this.props.drivertrip.waypoints,
                startwaitingTime: await AsyncStorage.getItem('startWaitingTime'),
                endwaitingTime:this.props.drivertrip.startTime,
                waitingTime:this.props.drivertrip.waitingTime,
                totalwaitingcost:this.props.drivertrip.totalwaitingcost
            },
            propsdata:this.props.data,
            propsrider:this.props.rider
        }  
        //alltrips = this.state.alltrips;
        alltrips.push(data);
        //let alltripsjson = JSON.stringify(alltrips);
        this.setState({alltrips:alltrips});
        if(this.props.rider.trip_submit_status == false){
            this.unsyncData(alltrips);
        }
        this.setState({isStarted:!this.state.isStarted,isEnded:true,getAddress:false});
        this.setState({isFirstTrip:false});
        const update_result = {
            alltrips:alltrips,
            isStarted:!this.props.drivertrip.isStarted,
            isEnded:true,
            getAddress:false,
            isFirstTrip:false
        };
        await this.props.dispatch(updateResultTripInfo(update_result));
        await AsyncStorage.setItem('startWaitingTime',this.state.endTime);
        await AsyncStorage.setItem('stillontripwith',JSON.stringify(this.props.rider));
        await AsyncStorage.setItem('stillontripData',JSON.stringify(this.props.drivertrip));
        //console.error(this.props.drivertrip);
      }
      unsyncData = async (alltrips) => {
        try {
            const data = await AsyncStorage.getItem('unsyncData');
            if (data !== null) {
                let datajson = JSON.parse(data);
                let newval = datajson.concat(alltrips);
                let newvaljson = JSON.stringify(newval);
                await AsyncStorage.setItem('unsyncData',newvaljson);
                //this.setState({unsync:newvaljson,isFetching:false});
            }else{
                let newvaljson = JSON.stringify(alltrips);
                await AsyncStorage.setItem('unsyncData',newvaljson);
            }
          } catch (error) {
            // Error retrieving data
            this.setState({isFetching:false});
          }
        
      }
      getLocationDetails = async (val,latitude, longitude) => {
        const location = [];
        let token = this.props.data.access_token;
        this.value = val; 
        //let access_token = ${this.props.data.access_token
        //Alert.alert(latitude.toString());
        const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU';
        //url='https://maps.googleapis.com/maps/api/geocode/json?address='+ latitude.toString() + ',' +longitude.toString()+ '&key=' +  googleApiKey;
        //console.error(url);
        await fetch(`https://smoothride.ng/taxi/api/getlastassigntrip`, {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization':token
            },body:{user_id:'7'},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.error(val.toString());
            //location = responseJson;
            console.error(responseJson);
            let that = this;
            Alert.alert(that.value);
            if(val == 'stop'){
                this.setState({stopAddress:responseJson.results[0].formatted_address});
                let diskm = parseFloat(this.state.distance_covered) / 1000;
                let farekm = diskm * parseFloat(this.props.rider.price_config.perkm);
                let startSec = (parseInt(this.state.startHour) * 3600) + (parseInt(this.state.startMin) * 60) + parseInt(this.state.startSec);
                let endSec = (parseInt(this.state.endHour) * 3600) + (parseInt(this.state.endMin) * 60) + parseInt(this.state.endSec);
                let secspent = ((endSec - startSec) / 60) * parseFloat(this.props.rider.price_config.permin);
                let totalcost = farekm + secspent + parseFloat(this.props.rider.price_config.basefare);
                this.setState({cost:totalcost});
                this.setState({getAddress:true}); 
                console.error(this.state);
                //const trip = await this.props.dispatch(completedtrip(this.state,this.props.data,this.props.rider));
                
            }
            else
            this.setState({startAddress:responseJson.results[0].formatted_address});
                //console.error(responseJson.results[0].formatted_address);
        }).catch(err => {
            Alert.alert(err.toString());
          });
      }
      getaddressSpecified = (text) => {
        const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU'; 
         fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=geocode&language=fr&key=${googleApiKey}&components=country:ng`, {
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
        }).then(async data => data.json()).then(async data => {
              if(data.status == 'OK'){
                this.setState({locationFromGoogle:data.predictions});
              }      
          }).catch(err => {
              this.setState({isrequesting:false});
              //console.error(err.toString());
              Alert.alert(
                'Alert',
                'No Internet Connection',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
          });
      }

      isDriverSureDestLocation = (address) => {
          Alert.alert(
            'Alert',
            `Are you sure this Address is Correct: "${address}"`,
            [
              {text: 'Yes', onPress: () => this.convertAddressToPoint(address)},
              {text: 'No'},
            ],
            {cancelable: false},
          );
      }
      convertAddressToPoint = (address) =>{
        this.setState({gettingInputLocation:!this.state.gettingInputLocation});  
        const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU'; 
         fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`, {
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
        }).then(data => data.json()).then(async data => {
            this.setState({gettingInputLocation:!this.state.gettingInputLocation}); 
            let distance = 0;
            let position = {
                coords:{latitude:data.results[0].geometry.location.lat,longitude:data.results[0].geometry.location.lng}
            }; 
            if(this.props.drivertrip.waypoints.length > 0){
                let a = { latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng };
                let b = { latitude: this.props.drivertrip.waypoints[0].latitude, longitude: this.props.drivertrip.waypoints[0].longitude };
                distance = haversine(a,b) + this.props.drivertrip.distance_covered;
            }
            const lastpoints = {
                lastLat:0,
                lastLng:0,
                distance_covered: this.props.drivertrip.waypoints.length > 0 ? distance : this.props.drivertrip.distance_covered
            };
            this.props.dispatch(updatelastPoint(lastpoints));
              const TripPosition = {
                prevposition:this.props.drivertrip.prevposition,
                firstLat:data.results[0].geometry.location.lat,
                firstLng:data.results[0].geometry.location.lng,
                position:this.props.drivertrip.position,
                firstLocationTime:this.props.drivertrip.startTime
            };
            this.props.dispatch(update_tripPosition(TripPosition)); 
            this.setState({getlocationmodal:false});
            this.setState({locationFromGoogle:[]});
            this.stopTrip();  
          }).catch(err => {
              this.setState({gettingInputLocation:false});  
              Alert.alert(
                'Alert',
                'No Internet Connection',
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
          });
      }

      acceptTrip = () => 
      {
        this.props.dispatch(acceptTrip(true)); 
      }

      rejectTrip = async () =>
      {
          await this.setState({reasonfordecline:'reassign'});
          this.declinenow();
      }

  
        

      
      
     
      
    render(){
        return (
               <PTRView onRefresh={this._refresh} style={styles.container}>
               <View>  
                   
               <ScrollView keyboardShouldPersistTaps='always'>

                    <ProgressDialog
                        visible={this.state.isSavingAvailability}
                        title="Updating Driver Availability"
                        message="Please, wait..."
                    />
                    <Modal isVisible={this.state.costAvailable}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:'auto',padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    <Image
                                source={require('../../asset/img/request.png')}
                                style={{width:40,height:40, alignSelf:'center',marginTop:20,marginBottom:15}}
                                />
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}>Trip Information</Text> 
                    
                        <Text style={{color:'#000',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>{this.state.TripInfo}</Text>  
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                            <TouchableOpacity onPress = {() => this.setState({costAvailable:false})} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Okay</Text>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                    </Modal>
                   <View style={styles.header}>
                       <Text style={styles.headerText}>
                           Trip Request <Text style={{fontSize:12}}>{this.state.driver_mode}</Text>
                       </Text>
                       <Text onPress={this.toggleDialog} style={{fontSize:12,alignSelf:'flex-end',borderRadius:5,color:'#fff',backgroundColor:'#a31225',padding:3}}>Status</Text>
                       
                   </View>

               
                   <Modal isVisible={this.state.getlocationmodal}>
                    
                    <KeyboardAvoidingView>
                    <View  style={{backgroundColor:'#fff',width:width,marginRight:0,alignSelf:'center',marginTop:20 }}>
                        <Text style={{color:'#000',fontSize:18,fontFamily:'Roboto-Bold',textAlign:'center',marginTop:20}}>We observed your trip Map did not load on Time</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Regular',textAlign:'center',marginTop:5}}>
                            Enter the address where you started trip
                        </Text> 
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                                
                                <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5} style={styles.cardview}>    
                                        <TextInput onChangeText = {(text) => this.getaddressSpecified(text)} style={{width:'100%', height:40,borderColor:'gray'}} placeholder="Enter the pickup address"/>
                                </CardView>
                                
                                {
                                    this.state.gettingInputLocation == true &&
                                    <ActivityIndicator size="large" color="#005091"/>
                                } 
                                <View style={{marginTop:10}} showsVerticalScrollIndicator={false}> 
                                    {
                                        (this.state.locationFromGoogle.length > 0) && <Text style={{textAlign:'center',marginBottom:20,fontWeight:'bold'}}>Select the Start Location below;</Text>
                                    }
                                    {
                                        
                                        this.state.locationFromGoogle.map((location)=>
                                          <TouchableOpacity value ={location.description} key = {location.description} onPress = {()=>this.isDriverSureDestLocation(location.description)} style={{height:40,width:'100%',borderWidth:1,borderColor:'#c1c1c1',marginTop:4,justifyContent:'center'}}>
                                              <Text style={{alignSelf:'flex-start',marginStart:5}}>{location.description}</Text>
                                          </TouchableOpacity>
                                        )
                                    }
                                </View>
                        </View>
                        </View>
                    </KeyboardAvoidingView>
                    
                   </Modal>
                   
                   <Modal isVisible={this.state.decline}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:300,padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    <Image
                                source={require('../../asset/img/request.png')}
                                style={{width:40,height:40, alignSelf:'center',marginTop:10,marginBottom:15}}
                                />
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}>Trip Option</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}></Text> 
                        
                         {
                          Platform.OS == 'ios' && this.props.drivertrip.isFirstTrip == true &&
                            <View style={{borderWidth:1,borderColor:'#c1c1c1',width:'94%',alignSelf:'center',borderRadius:5,marginBottom:5}}>
                            <RadioForm
                            radio_props={tripissues}
                            initial={-1}
                            labelStyle={{marginRight: '20%'}}
                            buttonColor={'#005091'}
                            buttonInnerColor={'#005091'}
                            buttonSize={10}
                            animation={true}
                            onPress={(value) => {this.setState({reasonfordecline:value})}}
                          />
                          </View>
                        }

                        {
                            this.props.drivertrip.isFirstTrip == true && Platform.OS == 'android' &&
                            <View style={{borderWidth:1,borderColor:'#c1c1c1',width:'94%',alignSelf:'center',borderRadius:5,marginBottom:5}}>
                            <Picker
                                selectedValue={this.state.reasonfordecline}
                                style={{height: 40, width: '100%',borderWidth:1,borderColor:'#005091'}}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({reasonfordecline: itemValue})
                                }>
                                <Picker.Item label="Select Reason" value="" />
                                <Picker.Item label="Unavailable for Trip" value="reassign" />
                                <Picker.Item label="Client Decline Trip" value="decline" />
                            </Picker> 
                            </View>
                        }
                        
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                            {
                                this.state.isrequesting == false &&
                                <TouchableOpacity onPress = {this.declinenow} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Yes</Text>
                                </TouchableOpacity>
                            }
                            
                            {
                                this.state.isrequesting == true &&
                                <TouchableOpacity>
                                    <ActivityIndicator size="small" color="#005091"/>
                                </TouchableOpacity>
                            }
                               <TouchableOpacity onPress = {this.dismissdeclinemodal} style={{width:'100%',backgroundColor:'#a31225',marginTop:10,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Cancel</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                   </Modal>
                   <Modal isVisible={this.state.showDialogforExit}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:300,padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    <Image
                                source={require('../../asset/img/request.png')}
                                style={{width:40,height:40, alignSelf:'center',marginTop:40,marginBottom:15}}
                                />
                        <Text style={{color:'#000',fontSize:18,fontFamily:'Roboto-Bold',textAlign:'center'}}>Trip Exit</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Regular',textAlign:'center',marginTop:5}}>
                            Do you really want to exit trip with this rider ?
                        </Text> 
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                                <TouchableOpacity onPress={this.exitthistrip} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Yes</Text>
                                </TouchableOpacity>
                               <TouchableOpacity onPress={()=>{this.setState({showDialogforExit:false})}} style={{width:'100%',backgroundColor:'#a31225',marginTop:10,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>No</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                   </Modal>
                   <Modal isVisible={this.state.driverrequest}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:380,padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    <Image
                                source={require('../../asset/img/request.png')}
                                style={{width:40,height:40, alignSelf:'center',marginTop:40,marginBottom:15}}
                                />
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}>Make Request</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Regular',textAlign:'center',marginTop:5}}>
                            Request to Change State
                        </Text>
                        {
                          Platform.OS == 'ios' &&
                            <View style={{borderWidth:1,borderColor:'#c1c1c1',width:'94%',alignSelf:'center',borderRadius:5,marginBottom:5}}>
                            <RadioForm
                            radio_props={managestate}
                            initial={-1}
                            formHorizontal={true}
                            labelStyle={{marginRight: '20%'}}
                            buttonColor={'#005091'}
                            buttonInnerColor={'#005091'}
                            buttonSize={10}
                            animation={true}
                            onPress={(value) => {this.setState({request:value})}}
                          />
                          </View>
                        }
                        
                        {
                          Platform.OS == 'android' &&
                            <View style={{borderWidth:1,borderColor:'#c1c1c1',width:'94%',alignSelf:'center',borderRadius:5,marginBottom:5}}>

                            <Picker
                              selectedValue={this.state.request}
                              style={{height: 40, width: '100%',borderWidth:1,borderColor:'#005091'}}
                              onValueChange={(itemValue, itemIndex) =>
                                  this.setState({request: itemValue})
                              }>
                             
                          
                          <Picker.Item label="Select State" value="" />
                          <Picker.Item label="Offline" value="Offline" />
                          <Picker.Item label="Online" value="Online" />
                          </Picker> 
                          </View>  
                        }
                        
                        
                        <TextInput
                        style={{ height: 40,paddingStart:10, borderColor: '#c1c1c1', borderWidth: 1,borderRadius:5,width:'94%',alignSelf:'center' }}
                        onChangeText={text => this.setState({reason:text})}
                        placeholder = "State your reason"
                        value={this.state.reason}
                        />  
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                            {
                                this.state.isrequesting == false &&
                                <TouchableOpacity onPress = {this.sendrequest} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Submit</Text>
                                </TouchableOpacity>
                            }
                            
                            {
                                this.state.isrequesting == true &&
                                <TouchableOpacity>
                                    <ActivityIndicator size="small" color="#005091"/>
                                </TouchableOpacity>
                            }
                               <TouchableOpacity onPress = {this.dismissmodal} style={{width:'100%',backgroundColor:'#a31225',marginTop:10,borderRadius:5}}>
                                  <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Cancel</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                   <View>
                   {
                       Object.keys(this.props.drivertrip.position).length > 0 && this.props.drivertrip.isStarted == true &&
                       <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={{height:mapviewheight}}
                        showUserLocation
                        followUserLocation
                        loadingEnabled
                        region={this.getMapRegion()}
                        >
                        <Polyline coordinates={this.props.drivertrip.routeCoordinates} strokeWidth={2} />
                        <Marker.Animated
                            ref={marker => {
                            this.marker = marker;
                            }}
                            coordinate={this.state.coordinate}
                        />    
                        </MapView>
                   }
                   {
                       this.props.rider.rider_name == '' && this.props.data.isFetching == false &&
                       <View style={{padding:10}}><CardView

                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={5} style={styles.cardview}>
                            <Text style={{color:'#877A80',alignSelf:'center',fontSize:16}}>
                                    No Ride Request Assigned Yet
                            </Text>
                       </CardView></View>
                   }
                   {
                       Object.keys(this.props.drivertrip.position).length == 0 && this.props.drivertrip.isStarted == true &&
                       <View style={{textAlign:'center'}}>
                        <Text style={{color:'#877A80',alignSelf:'center'}}>
                                Please wait...Getting your Current Location (Loading Google Map)
                        </Text>
                        <ActivityIndicator color="#007cc2" size='large' />
                       </View>
                   }
                   <View>
                        {
                            this.state.isFetching == true && <ActivityIndicator color="#007cc2" size='large' />
                        }    
                        {
                            this.props.drivertrip.isStarted == false && this.props.rider.rider_id !== '' && this.props.rider.accept == true &&
                            <View style={{padding:10}}><CardView
                                        cardElevation={3}
                                        cardMaxElevation={3}
                                        cornerRadius={5} style={styles.cardview}>
                                        <View>

                                        </View>    
                                        <View>
                                            <View style={{flexDirection:'row'}}>
                                                    <View style= {{width:'22%',marginStart:10}}>
                                                    {
                                                        this.props.rider.rider_image != null && 
                                                        <Image
                                                        source={{uri: `https://smoothride.ng/taxi/images/${this.props.rider.rider_image}`}}
                                                        style={{width:50,height:50,borderRadius:25, alignSelf:'center',margin:5}}
                                                        />
                                                    } 
                                                    {
                                                        this.props.rider.rider_image == null && 
                                                        <Image
                                                        source={require('../../asset/img/profile.jpg')}
                                                        style={{width:50,height:50,borderRadius:25, alignSelf:'center',margin:5}}
                                                        />
                                                    }   
                                                    </View>
                                                    <View style = {{width:'60%',marginLeft:5}}>
                                                        <Text style={{fontSize:17,marginTop:1,color:'#877A80',fontWeight:'bold'}}> {this.props.rider.rider_name}</Text>
                                                        {
                                                            this.props.rider.company_name == null &&
                                                            <Text style={{fontSize:16,fontWeight:'200',color:'#877A80',fontFamily: "Roboto-Regular"}}> Unknown </Text>
                                                        }
                                                        {
                                                            this.props.rider.company_name != null &&
                                                            <Text style={{fontSize:16,fontWeight:'800',color:'#007cc2',fontFamily: "Roboto-Regular"}}> {this.props.rider.company_name}</Text>
                                                        }
                                                                                                            
                                                    </View>
                                                    <View >
                                                        <View style={{borderColor:'#007cc2',borderWidth:2,borderRadius:17,width:35,height:35,marginTop:10}}>
                                                        <Ionicons onPress={this.call} name='md-call' size={20} style={{color:'#007cc2',alignSelf:'center',marginTop:5}}/>
                                                        </View>
                                                    
                                                    </View>
                                                        
                                            </View>
                                            
                                            <View style={{flexDirection:'row'}}>
                                                    {/*
                                                        this.state.isFetching == true &&
                                                        <TouchableOpacity onPress={this.oncompleted} style={{backgroundColor:'#a31225',padding:10,width:'100%'}}>
                                                        <ActivityIndicator color="#fff" size='large' />
                                                        </TouchableOpacity>
                                                    */}
                                                
                                                    {
                                                        this.state.isFetching == false &&
                                                        <View>
                                                        <View style={{flexDirection:'row',marginTop:20}}>
                                                            <View style={{width:'50%'}}>
                                                            {
                                                                    this.state.isFetching == true &&
                                                                    <ActivityIndicator color = '#007cc2' size = 'large'/>
                                                                }
                                                                {
                                                                    this.props.drivertrip.isStarted == false && this.props.drivertrip.isFirstTrip == true &&
                                                                    <TouchableOpacity onPress={this.declineTrip} style={{borderColor:'#005091',borderWidth:1,borderRadius:5,padding:5,width:'50%',marginTop:10,opacity:this.state.opacity}}>
                                                                        <Text style={{alignSelf:'center',color:'#005091',fontSize:15,fontFamily: "Roboto-Regular"}}>
                                                                                Option
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                }
                                                            </View>    
                                                            <View style={{width:'50%'}}>
                                                                {
                                                                    this.state.isFetching == true &&
                                                                    <ActivityIndicator color = '#007cc2' size = 'large'/>
                                                                }
                                                                {
                                                                    this.props.drivertrip.isStarted == false && 
                                                                    <TouchableOpacity onPress={this.startTrip} style={{backgroundColor:'#005091',borderRadius:5,padding:5,width:'100%',marginTop:10, opacity:this.state.opacity}}>
                                                                        <Text style={{alignSelf:'center',color:'#fff',fontSize:15,fontFamily: "Roboto-Regular"}}>
                                                                                Start Trip
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                }
                                                            
                                                            </View>
                                                            
                                                        </View >
                                                        <View style ={{textAlign:'center'}}>
                                                        {
                                                            this.state.FetchingisTripValid == true &&
                                                            <View>
                                                                 <ActivityIndicator color = '#005091' size = 'large'/>
                                                                 <Text style ={{color:'#005091',textAlign:'center'}}>Please Wait....</Text>
                                                            </View>
                                                        } 
                                                        </View>
                                                        </View>
                                                    }
                                                    
                                            
                                            </View>
                                            
                                            
                                            
                                            
                                            </View>
        
                                        
                                </CardView></View>
                        }
                        {
                                this.props.drivertrip.isStarted == true && Object.keys(this.props.drivertrip.position).length > 0 && 
                                <View style={{padding:10}}><CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5} style={styles.cardview}>    
                                        {
                                            this.props.drivertrip.isEndingTrip == true &&
                                                  <TouchableOpacity style={{backgroundColor:'#a31225',padding:10}}>
                                                        <ActivityIndicator color="#fff" size='small' />
                                                  </TouchableOpacity>       
                                        }
                                        {
                                            this.props.drivertrip.isEndingTrip == false && 
                                                    <TouchableOpacity onPress={this.stopTrip} style={{backgroundColor:'#a31225',padding:10}}>
                                                        <Text style={{alignSelf:'center',color:'#fff',fontSize:15,fontFamily: "Roboto-Regular"}}>
                                                           End Trip
                                                        </Text>
                                                    </TouchableOpacity> 
                                        }
                                        
                                    
                                </CardView></View>
                        }    
                   
                   </View>
                    {
                        this.props.drivertrip.isEnded == true && 
                            <View style={{padding:10}}>
                                <View style = {{marginTop:0,borderRadius:5}}>
                                            
                                                <TouchableOpacity style={{backgroundColor:'#fff',padding:10,marginTop:3}}>
                                                <Text onPress={this.call} style={{alignSelf:'center',color:'black',fontSize:18}}>
                                                    Trip Summary
                                                </Text>
                                                </TouchableOpacity>   
                                        
                                            
                                            <View style={{backgroundColor:'#fff'}}>
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>
                                                    <Text style={styles.details}>Start Time:  <Text style={styles.time}>{this.props.drivertrip.startTime}</Text>
                                                    </Text>
                                            </CardView>
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>       
                                                    <Text style={styles.details}>Distant Covered:  <Text style={styles.time}>{this.props.drivertrip.distance_covered} Meters</Text></Text>
                                            </CardView> 
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>         
                                                    <Text style={styles.details}>End Time:  <Text style={styles.time}>{this.props.drivertrip.endTime}</Text></Text>
                                            </CardView>
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>         
                                                    <Text style={styles.details}>Cost of Trip (NGN):  <Text style={styles.time}>{this.props.drivertrip.cost}</Text>
                                                    </Text>
                                            </CardView>        
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>         
                                                    <Text style={styles.details}>Waited Time:  <Text style={styles.time}>{this.toHHMMSS(this.props.drivertrip.waitingTime)}</Text>
                                                    </Text>
                                            </CardView>  
                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={10}
                                                style = {{marginTop:20,padding:7,backgroundColor:'#fff'}}>       
                                                    <Text style={styles.details}>Cost of Waiting (NGN):  <Text style={styles.time}>{this.props.drivertrip.totalwaitingcost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                                                    </Text>
                                            </CardView>        
                                               
                                                    <TouchableOpacity onPress={this.onopentoexit} style={{backgroundColor:'#a31225',padding:10,borderRadius:5,marginTop:20,marginBottom:40}}>
                                                        {
                                                            this.props.data.isFetching == false &&
                                                            <Text style={{alignSelf:'center',color:'#fff',fontSize:14,fontFamily: "Roboto-Regular"}}>
                                                                Exit Trip with Rider
                                                            </Text>
                                                        }
                                                        {
                                                            this.props.data.isFetching == true &&
                                                            <ActivityIndicator color="#fff" size='small' />
                                                        }
                                                        
                                                    </TouchableOpacity>
                                               
                                                
                                            </View>
                                </View>
                            </View>
                    }

                    
                    {
                       this.props.drivertrip.isStarted == false && this.props.rider.rider_id !== '' && this.props.rider.accept == false &&
                       <View style = {styles.viewcard}>
                            <View>
                            <View style={{padding:10}}>
                                        <Text style={{alignSelf:'center',marginTop:10,fontSize:15,color:'#007cc2'}}>Hi, {this.props.data.user_name}</Text>
                                        <Text style={{alignSelf:'center',marginTop:10,fontSize:15,color:'#877A80'}}>You have a new Trip Request.</Text>
                            </View>     
                            <CardView
                                    cardElevation={0.6}
                                    cardMaxElevation={0.6}
                                    cornerRadius={10}
                                    style = {{marginTop:7}}>
                                       
                                    <View style={{flexDirection:'row'}}>
                                    <View style= {{width:'22%',marginStart:10}}>
                                    
                                        {
                                            this.props.rider.rider_image != null && 
                                            <Image
                                            source={{uri: `https://smoothride.ng/taxi/images/${this.props.rider.rider_image}`}}
                                            style={{width:50,height:50,borderRadius:25, alignSelf:'center',margin:5}}
                                            />
                                        } 
                                        {
                                            this.props.rider.rider_image == null && 
                                            <Image
                                            source={require('../../asset/img/profile.jpg')}
                                            style={{width:50,height:50,borderRadius:25, alignSelf:'center',margin:5}}
                                            />
                                        }
                                    
                                    </View>
                                    <View style = {{width:'60%',marginLeft:5}}>
                                        <Text style={{fontSize:17,marginTop:1,color:'#877A80',fontWeight:'bold'}}> {this.props.rider.rider_name}</Text>
                                        {
                                            this.props.rider.company_name == null &&
                                            <Text style={{fontSize:16,fontWeight:'200',color:'#877A80',fontFamily: "Roboto-Regular"}}> Unknown </Text>
                                        }
                                        {
                                            this.props.rider.company_name != null &&
                                            <Text style={{fontSize:16,fontWeight:'800',color:'#007cc2',fontFamily: "Roboto-Regular"}}> {this.props.rider.company_name}</Text>
                                        }
                                                                                                            
                                    </View>
                                    <View>
                                        <View style={{borderColor:'#007cc2',borderWidth:2,borderRadius:17,width:35,height:35,marginTop:10}}>
                                            <Ionicons onPress={this.call} name='md-call' size={20} style={{color:'#007cc2',alignSelf:'center',marginTop:5}}/>
                                        </View>
                                        
                                    </View>
                                                
                                    </View>
                                </CardView>
                                  
                            </View>   
                            <View>
                               <View style={{flexDirection:'row'}}>
                                   <View style ={{width:'30%',justifyContent:'center'}}>
                                            {
                                                this.state.isrequesting == false &&
                                                <TouchableOpacity onPress={this.rejectTrip}  style={{marginTop:7, backgroundColor:'#a31225',padding:7,width:'100%',alignSelf:'center'}}>
                                                    <Text style={{alignSelf:'center',color:'#fff',fontSize:13,fontFamily:'Roboto-Regular'}}>Reject</Text> 
                                                </TouchableOpacity>
                                            }
                                           
                                           {
                                               this.state.isrequesting == true &&
                                               <TouchableOpacity style={{marginTop:7, backgroundColor:'#a31225',padding:7,width:'100%',alignSelf:'center'}}>
                                                  <ActivityIndicator color="#fff" size='small' />
                                               </TouchableOpacity> 
                                           }
                                    </View>
                                    <View style ={{width:'40%',justifyContent:'center'}}></View>
                                   <View style ={{width:'30%'}}>
                                      
                                           <TouchableOpacity onPress={this.acceptTrip}  style={{marginTop:7, backgroundColor:'#005091',padding:7,width:'100%',alignSelf:'center'}}>
                                            <Text style={{alignSelf:'center',color:'#fff',fontSize:13,fontFamily:'Roboto-Regular'}}>Accept</Text> 
                                           </TouchableOpacity>
      
                                   </View>
                               </View>
                            </View>   
                            
                        </View>
                      
                    }
               </View>    
               </ScrollView>

               </View>  
               </PTRView>
        );
    }
}
const styles = StyleSheet.create({
    header:{
        backgroundColor:'#005091',
        alignSelf:'center',
        width:'100%',
        padding:14,
        flexDirection:'row'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    actionbtn:{
        alignSelf:'center',color:'#fff',fontSize:18,
        fontFamily: "Roboto-Regular"
    },
    viewcard:{
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        padding:10,
        marginTop:10,
        borderRadius:5,
        borderColor:'#005091',
        borderWidth:1,
        margin:2
    },
    cardview:{
        padding:10,
        marginTop:10,
        backgroundColor:'#fff'
    },
    headerText:{
        fontSize:20,
        alignSelf:'center',
        textAlign:'center',
        color:'#fff',
        width:'90%',
        fontFamily: "Roboto-Regular",
        marginTop:status_bar_height
    },
    details:{
        padding:10,
        fontSize:14,
        fontFamily: "Roboto-Regular"
    },
    time:{
        color:'#877A80',
        fontSize:13
    }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer,
        rider:state.RiderReducer,
        drivertrip: state.TripReducer
    };
};
export default connect(mapStateToProps)(BookRideScreen);