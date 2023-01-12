import React, { Component } from 'react';
import {View, Text,Dimensions,AppState,StatusBar, ImageBackground,Alert,ActivityIndicator,PermissionsAndroid,StyleSheet,TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PTRView from 'react-native-pull-to-refresh';
import {connect} from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import haversine  from 'haversine-distance';
import Modal from "react-native-modal";
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker,Polyline } from 'react-native-maps';
import CardView from 'react-native-cardview';
import { updatetripstatus,rider_details,updateResultTripInfo } from '../../action/fetch';
const { width, height  } = Dimensions.get('window');
import { ProgressDialog } from 'react-native-simple-dialogs';
import { continuetrip } from '../../action/fetch';
import {riderdetailTrip} from '../../action/fetch';
import {startAddress} from '../../action/fetch';
import Timeline from 'react-native-timeline-flatlist';
import uuid from 'uuid-random';
const ASPECT_RATIO = width / height;

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU';
const LATITUDE_DELTA = 0.006339428281933124;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let mapheight = height;
const mapviewheight = parseInt(mapheight);
const status_bar_height = Platform.OS == 'ios' ? 20 : 0;

class TripScreen extends React.Component{
    static navigationOptions = {
        header:null
    };
    constructor(props){
        super(props);
        this.watchID;
        this.state = {
            isFetching:false,
            isSaving:false,
            getlocisSaving:false,
            data:[],
            startTime:'',
            showModal:false,
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
             isSavingAvailability:false,
             routeCoordinates:[],
             appState:AppState.currentState,
             price_config:{},
             rider:{},
             Address:[],
            coordinate: new AnimatedRegion({
                latitude: 23,
                longitude: 90,
                latitudeDelta:LATITUDE_DELTA,
                longitudeDelta:LONGITUDE_DELTA
            })
        }
    }
      _refresh = async() => {
        this.setState({isFetching:true});
        let token = `Bearer ${this.props.data.access_token}`;
        fetch(`https://www.smoothride.ng/taxi/api/getdrivertrip`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
          .then(data => data.json())
          .then(data => {
              if(data.length > 0){
                  this.setState({data:data,isFetching:false});
              }else if(data.length == 0){
                this.setState({isFetching:false,data:[]});
                //Alert.alert('Error getting data from Server');
              }
               
          })
          .catch(err => {
            Alert.alert(err.toString());
          });
      }
      getconfig = async (d) =>{
        this.setState({isSaving:true});  
        let token = `Bearer ${this.props.data.access_token}`;
        await fetch(`https://www.smoothride.ng/taxi/api/getuserwithconfig/${d.staffId}`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
          .then(data => data.json())
          .then(data => {
              this.setState({isSaving:false});
              let values = {data:data};
              this.setState({price_config:data.config,rider:data.user});
              //this._getState();
              this.props.dispatch(riderdetailTrip(values));
              //console.error(this.props.rider);
              //this.props.navigation.navigate('tripmap',{price_config:this.state.price_config,rider:this.state.rider});
              //console.error(this.state.rider);
               //console.error(this.state.price_config);
          })
          .catch(err => {
            Alert.alert(err.toString());
            //console.error(err.toString());
          });  
      }
    componentDidMount(){
        this.setState({isFetching:true});
        AppState.addEventListener('change', this._handleAppStateChange);
        let token = `Bearer ${this.props.data.access_token}`;
        fetch(`https://www.smoothride.ng/taxi/api/getdrivertrip`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
          .then(data => data.json())
          .then(data => {
              if(data.length > 0){
                  this.setState({data:data,isFetching:false});
              }else if(data.length == 0){
                this.setState({isFetching:false,data:[]});
                //Alert.alert('Error getting data from Server');
              }
               
          })
          .catch(err => {
            Alert.alert(err.toString());
          });
    }
    _handleAppStateChange = (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
            //Alert.alert(this.state.appState);
            //console.log('App has come to the foreground!');
        }
        this.setState({appState: nextAppState});
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    savedetails = async (d) =>{
        //this.setState({showModal:!this.state.showModal});
            this.props.navigation.navigate('tripmap', {
              data:d
            });
    }
    
    toHHMMSS = (secs) => {
        var sec_num = parseInt(secs, 10)
        var hours   = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60
    
        return [hours,minutes,seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v,i) => v !== "00" || i > 0)
            .join(":")
    } 
    startTimeAgain = (d) => {
        //console.error(d);
        if(this.props.rider.rider_id != '') return false;
        Alert.alert(
            'Alert',
            `Do you want to continue trip with this rider (${d.name}) ?`,
            [
              {text: 'Yes', onPress: () => this.createTripInstance(d)},
              {
                text: 'No',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
    }
    createTripInstance = async (d) => {
        let date = Date.parse(d.tripEndTime);
        let datenow =  Date.parse(new Date(Date.now()));
        let diff = (datenow - date) / 1000;
        //Alert.alert(diff.toString());
        if(diff < 7200)
         {
            let data  = {
                data:{
                    id:d.id,
                    staffId:d.staffId,
                    company_name:d.company,
                    name:d.name,
                    phone:d.phone,
                    email:d.email,
                    profileUrl:d.profileUrl
                },
                config:{
                    basefare:d.basefare,
                    perkm:d.perkm,
                    permin:d.permin,
                    waitpermin:d.waitpermin
                }
            }; 
            await this.props.dispatch(rider_details(data));
            
            const update_result = {
                alltrips:[],
                isStarted:false,
                isEnded:false,
                getAddress:false,
                isFirstTrip:false
            };
            await this.props.dispatch(updateResultTripInfo(update_result));
            this.props.navigation.navigate('Book');
         }
         else {
            Alert.alert(
                'Alert',
                `You cannot continue trip with ${d.name}`,
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
         }
        
    }
    
    render(){
        return (
            <PTRView onRefresh={this._refresh}>  
            <ScrollView>  
                <View style={styles.container}>
                    <View style={styles.header}>
                    <Text style={styles.headerText}>All Trips</Text>
                    </View>
                    <Modal isVisible={this.state.showModal} style={{width:width,backgroundColor:'#fff',margin: 0}}>
                      <View style={{backgroundColor:'#fff',width:width,height:height,marginLeft:0 }}>
                        <Timeline
                          data={this.state.Address}
                        />
                      </View>
                   </Modal> 
                  
                    {
                        this.state.isFetching == true && <ActivityIndicator color="#007cc2" size='large' />
                    }
                    {
                        this.state.data.length == 0 && this.state.isFetching == false && <Text style={{marginTop:1,color:'#877A80',alignSelf:'center',fontSize:15}}>No previous trip information</Text>
                    }
                    {
                        this.state.data.map((d) =>
                        <TouchableOpacity  key = {uuid()} value={uuid()} onPress = {() => this.startTimeAgain(d)}>
                        {/*    
                        <View style={styles.body}>
                            <View style= {styles.img}>
                                    <Ionicons name='md-car' size={30} style={{color:'#007cc2',marginTop:10}}/>
                            </View>
                                <View style = {styles.info}>
                                <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'green',marginTop:10}}/> {d.pickUpAddress}</Text>
                                <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'red',marginTop:10}}/> {d.destAddress}</Text>
                                <Text style={{marginTop:1,color:'#877A80'}}> NGN {parseFloat(d.tripAmt).toFixed(2)}</Text>
                                </View>
                                
                        </View>
                        */}
                        <View style={{borderWidth:1,borderColor:'#005091',margin:7,borderBottomLeftRadius:5,borderBottomRightRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5}} key = {d.id} value = {d.id}>
                        <View style={{backgroundColor:'#005091',padding:7}}>
                            <View style = {{flexDirection:"row"}}>
                                <View style={{width:'70%'}}>
                                   <Text style={{color:'#fff'}}>{d.name}</Text>
                                   <Text style={{color:'#fff',fontSize:12}}>Travel Time: {this.toHHMMSS(d.travelTime)}</Text>
                                   
                                </View>
                                
                                <View style={{width:'30%'}}>
                                    <Text style={{alignSelf:'flex-end',color:'#fff',fontSize:12}}>NGN {parseFloat(d.tripAmt).toFixed(2)}</Text>
                                    <View style={{width:'60%',backgroundColor:'#007cc2',alignSelf:'flex-end',borderRadius:5}}>
                                       <Text onPress = {()=>this.savedetails(d)} style={{borderRadius:1,color:'#fff',padding:2,alignSelf:'center'}}>ROUTE</Text>
                                    </View>
                                    
                                </View>
                            </View>
                            <View>
                            <Text style={{color:'#fff',fontSize:12}}>Start Time: {d.tripEndTime}</Text>
                            </View>
                        </View>
                        <View style={{borderBottomColor:'#005091',borderBottomWidth:1,marginBottom:7}}>
                            <View style = {{paddingTop:5,paddingBottom:5}}>  
                            <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'green',marginTop:10}}/> {d.pickUpAddress}</Text>
                            
                            </View>
                        </View>
                        <View style={{marginBottom:7}}>
                            <View style = {{paddingTop:5,paddingBottom:5}}>  
                            <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'red',marginTop:10}}/> {d.destAddress}</Text>
                            
                            </View>
                        </View>
                    </View> 
                        </TouchableOpacity>
                    )}   
                </View>
            </ScrollView>
            </PTRView>
            
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
      },
      img:{
          width:'10%'
      },
      body:{
        flexDirection:'row',
        padding:10,
        paddingTop:5
      },
      header:{
        backgroundColor:'#005091',
        alignSelf:'center',
        width:'100%',
        padding:14
    },
    headerText:{
        fontSize:20,
        alignSelf:'center',
        color:'#fff',
        marginTop:status_bar_height
    },
    cardview2:{
        padding:10,
        position:"absolute",
        bottom:5,
        zIndex:6,
        width:'100%'
    },
    cardview:{
        padding:10,
        position:"absolute",
        top:10,
        zIndex:6,
        width:'100%'
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
        color:'#877A80',
        fontSize:13
    }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer,
        rider:state.RiderReducer
    };
};
export default connect(mapStateToProps)(TripScreen);