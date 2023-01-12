import React, { Component } from 'react';
import {View, Text,StatusBar, Dimensions,PermissionsAndroid, Image,AppState,Linking,StyleSheet,TextInput,Alert,ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native';
import CardView from 'react-native-cardview';
import {bookaRide} from '../../action/fetch';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {user_update} from '../../action/fetch';
import {getDriver} from '../../action/fetch';
import { clear_driver,getDistance, user_login } from '../../action/fetch';
import PTRView from 'react-native-pull-to-refresh';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Dialog from "react-native-dialog";
import Modal,{ BottomModal,ModalContent } from "react-native-modal";
import DialogInput from 'react-native-dialog-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Modal from 'react-native-modal';
const status_bar_height = Platform.OS == 'ios' ? 20 : 0;

const { width, height  } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.006339428281933124;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let mapheight = height;
const mapviewheight = parseInt(mapheight) - 80;

class BookRideScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rider_update:false,
            isFetching: false,
            isFetchingCompleted:false,
            showDialog: false,
            position:{},
            appState:'',
            drivers:[],
            number_of_drivers:0,
            isDialogVisible:false,
            isrequestingdrivers:false,
            reason:'',
            driverontrip: false,
            costAvailable:false,
            msgTitle:'',
            TripInfo:'',
            ontrip: false
        }
    }
    static navigationOptions = {
        header:null
    };

    async componentDidUpdate(previousProps,previousState)
    {
        const { title, body } = this.props.screenProps;
        if(previousProps.screenProps != this.props.screenProps)
        {
              if(title == 'On Trip') this.setState({ontrip:true});
              if(title == 'Trip Completed') this.setState({ontrip:false});
              if(title == 'Trip Reassigned') this.fetchData();
              if(title != null && body != null)
              {
                await this.setState({costAvailable:true,msgTitle:title,TripInfo:body});
              }
            
        }
       
       
    }
    getride = async (purpose) =>{
        //Alert.alert(text);
        if(purpose == '') {
            //if(Platform.OS == 'android') 
            Alert.alert(
                'Alert',
                'Please state the reason for the trip',
                [
                  {text: 'OK' },
                ],
                {cancelable: false},
              );
              return false;
        }
        let token = this.props.data.access_token;
        let user_id = this.props.data.user_id;
        //Alert.alert(token);
        this.setState({isDialogVisible:false});
        const user = await this.props.dispatch(bookaRide(user_id,token,purpose));
        this.setState({reason:''});
    }
    showInput = () => {
        this.setState({isDialogVisible:true});
    }
    dismissmodal = () => {
        this.setState({isDialogVisible:!this.state.isDialogVisible});
    }
    call = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${this.props.driver.driver_phone}`;
          }
          else {
            phoneNumber = `telprompt:${this.props.driver.driver_phone}`;
          }
          Linking.openURL(phoneNumber);
    }
    oncompleted = async () => {
        this.setState({showDialog:true});
    }
    exitthistrip = async () => {
        this.setState({isFetching:true});
        //Alert.alert(this.props.data.access_token);
        this.setState({showDialog:false});
        await this.props.dispatch(clear_driver(this.props.data.access_token));
        this.setState({isFetching:false});
        this.listofdriver();
        
    }
    _backgroundState(state) {
        return state.match(/inactive|background/);
      }
      fetchData = async () =>{
        let user_id = this.props.data.user_id;
        let token = this.props.data.access_token;
        //console.error(this.props.data);
        this.setState({isFetching:true});
        const trip = await this.props.dispatch(getDriver(user_id,token));
        if(this.props.driver.trip_id == '') this.listofdriver();
        this.setState({isFetching:false});
        //Alert.alert(this.props.driver.driver_email);
      }
      listofdriver = async () => {
        this.setState({isrequestingdrivers:true});
        await fetch('https://www.smoothride.ng/taxi/api/listofdrivers', {
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer ${this.props.data.access_token}`
            }
        }).then(async data => data.json()).then(data => {
              //console.error(data);
              this.setState({isrequestingdrivers:false}); 
              if(data.success == true){
                 let drivers = [];
                 for(let i = 0; i < data.drivers.length; i++){
                     if(drivers.length > 2) break;  
                     drivers.push(data.drivers[i]);
                 }
                 this.setState({drivers:drivers,number_of_drivers:data.drivers.length});
                 //console.error(this.state.drivers);
              }      
          }).catch(err => {
              
          });
}
      setData = async () => {
            let tripinformation = await AsyncStorage.getItem('tripinformation');
            if(tripinformation){

            }
      }
    _handleAppStateChange = (nextAppState) => {
        //Alert.alert(nextAppState);
        if (this._backgroundState(nextAppState)) {
          //console.log("App is going background");
          //this.setData();
          //Alert.alert("Going Background");
          
        } else if (this._backgroundState(this.state.appState) && (nextAppState === 'active')) {
          this.fetchData(); 
        }
        this.setState({appState: nextAppState});
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    /*
    getDist = async () =>{
        let origin_latitude = "6.4942339";
        let origin_longitude = "3.3574042";
        let destination_latitude = "6.4919899";
        let destination_longitude = "3.356483";
        //console.error('oopp');
        await this.props.dispatch(getDistance(origin_latitude,origin_longitude,destination_latitude,destination_longitude));
        //console.error(this.props.data.tripdistance);
    }
    */
    updateToken = async () => {
      let formdata = await AsyncStorage.getItem('formdata');
      const device_token = await AsyncStorage.getItem('device_token');
      if(formdata != null){
         formdata = JSON.parse(formdata);
         this.props.dispatch(user_login(formdata.email,formdata.password,device_token));
      }
    }
    componentDidMount(){
        //Alert.alert(AppState.currentState);
        //this.getDist();
        AppState.addEventListener('change', this._handleAppStateChange);
        //this._getState();
        this.updateToken();
        if(Platform.OS === 'android'){
          this.grantedPermission();
        }else{
          this._getState();
          this.getLocation();
        }
        
    }
    grantedPermission = async () => {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this._getState();
                this.getLocation();
                } else {
                this._getState();
                Alert.alert("Access Denied");
            }
    }
    getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                //console.error(position);
                this.setState({position:position});
                //Alert.alert('aaa');
                //this.state.coordinate.timing({latitude:position.coords.latitude,longitude:position.coords.longitude}).start();
            },
            (error) => {
                // See error code charts below.
                console.error(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
      _getState = async () =>{  
        let data = {};  
        let user_data = await AsyncStorage.getItem('user_data');
        let device_token = await AsyncStorage.getItem('device_token');
        let information = await AsyncStorage.getItem('tripinformation');
        if(information == true) this.setState({rider_update:true});
        if(user_data != null) data = JSON.parse(user_data);
        if(this.props.data.user_id == '' && Object.keys(data).length > 0)
          await  this.props.dispatch(user_update(data));
          this.fetchData();
          //console.error(this.props.data);
          
     }
     _refresh = async () => {
        this.fetchData();
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
        .then(data => {
            this._getState();
            this.getLocation();
            //Alert.alert('aaaa');
        }).catch(err => {
           Alert.alert('Access Denied');
        });
        return new Promise((resolve) => {
         
          setTimeout(()=>{resolve()}, 2000)
        });
      };
      getMapRegion = () => ({
        latitude: this.state.position.coords.latitude,
        longitude: this.state.position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
    render(){
        return (
            <PTRView onRefresh={this._refresh}>
               <ScrollView keyboardShouldPersistTaps='always'>
                   {/*<View style={styles.header}>
                       <Text style={styles.headerText}>Book a Ride</Text>
                   </View>
                    */}
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
                   <Modal isVisible={this.state.isDialogVisible}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:300,padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    <Image
                                source={require('../../asset/img/request.png')}
                                style={{width:40,height:40, alignSelf:'center',marginTop:20,marginBottom:15}}
                                />
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}>Trip Request</Text> 
                    
                        <TextInput
                        style={{ height: 50, borderColor: '#c1c1c1',marginTop:10,paddingStart:8, borderWidth: 1,borderRadius:5,width:'94%',alignSelf:'center' }}
                        onChangeText={text => this.setState({reason:text})}
                        placeholder = "State your reason"
                        value={this.state.reason}
                        />  
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                            <TouchableOpacity onPress = {() => this.getride(this.state.reason)} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {this.dismissmodal} style={{width:'100%',backgroundColor:'#a31225',marginTop:10,borderRadius:5}}>
                                <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </Modal>
                    <Modal isVisible={this.state.showDialog}>
                    <View style={{backgroundColor:'#fff',width:'98%',height:220,padding:15,paddingTop:5,marginRight:0,alignSelf:'center' }}>
                    
                        <Text style={{color:'#000',fontSize:17,fontFamily:'Roboto-Bold',textAlign:'center',marginTop:20}}>Cancel Trip Request</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Bold',textAlign:'center'}}>Do you really want to cancel the trip ?</Text>
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                            <TouchableOpacity onPress = {this.exitthistrip} style={{width:'100%',backgroundColor:'#fff',borderWidth:1,borderColor:'#005091',backgroundColor:'#005091',marginTop:2,borderRadius:5}}>
                                <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({showDialog:false})}} style={{width:'100%',backgroundColor:'#a31225',marginTop:10,borderRadius:5}}>
                                <Text style={{color:'#fff',alignSelf:'center',fontSize:13,padding:12,marginRight:5,fontFamily:'Roboto-Regular'}}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </Modal>
                   
                   <View>
                       
                   {
                       Object.keys(this.state.position).length > 0 &&    
                       <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={{height:mapviewheight}}
                        showUserLocation
                        followUserLocation
                        loadingEnabled
                        region={this.getMapRegion()}
                        ></MapView>  
                    }      
                       {
                           this.props.driver.trip_id == '' && this.state.isFetching == false && 
                           <View style = {styles.viewcard}>
                            <View>
                                    <View style={{padding:10}}>
                                        <Text style={{alignSelf:'center',marginTop:10,fontSize:15,color:'#007cc2'}}>Hi, {this.props.data.user_name}</Text>
                                    </View>    
                                    <TouchableOpacity style={{backgroundColor:'#ededed',padding:1}}> 
                                   {
                                       this.state.isrequestingdrivers == true &&
                                       <Text style={styles.driverbtn}>Getting available drivers....</Text>
                                   }
                                   {
                                       this.state.isrequestingdrivers == false &&
                                       <Text style={styles.driverbtn}>{this.state.number_of_drivers} driver(s) available</Text>
                                   }
                                     
                                    
                                    </TouchableOpacity>
                                    {
                                        this.state.drivers.map((driver) =>
                                    <CardView
                                        cardElevation={0.6}
                                        cardMaxElevation={0.6}
                                        cornerRadius={10}
                                        key = {driver.id}
                                        value = {driver.id}
                                        style = {{marginTop:7}}>
                                        <View style={{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#ededed'}}>
                                            <View style= {{width:'15%',marginStart:10}}> 
                                                <Image
                                                source={require('../../asset/img/profile.jpg')}
                                                style={{width:40,height:40,borderRadius:20,alignSelf:'center',margin:5}}
                                                />   
                                            </View>
                                            <View style = {{width:'60%',marginLeft:5}}>
                                                <Text style={{fontSize:14,marginTop:10,color:'#877A80',fontWeight:'400'}}> {driver.name}</Text>
                                               
                                                                                                      
                                            </View>
                                            
                                                
                                        </View>
                                    </CardView>
                                        )
                                    }
                                    
                                    
                                    
                            </View>   
                               {
                                   this.props.data.isFetching == true && 
                                   <TouchableOpacity style={{marginTop:7, backgroundColor:'#005091',padding:10,width:'100%',borderRadius:10,alignSelf:'center'}}>
                                      <ActivityIndicator color="#fff" size='small' /> 
                                   </TouchableOpacity>
                               }
                               {
                                   this.props.data.isFetching == false && 
                                   <TouchableOpacity onPress={this.showInput} style={{marginTop:7, backgroundColor:'#005091',padding:10,width:'100%',borderRadius:10,alignSelf:'center'}}>
                                      <Text style={styles.actionbtn}>REQUEST A RIDE</Text> 
                                   </TouchableOpacity>
                               }
                            
                           </View>
                       }
                       {
                           this.state.isFetching == true &&
                           <CardView
                           cardElevation={2}
                           cardMaxElevation={2}
                           cornerRadius={5} style={styles.cardview}>
                             <ActivityIndicator color="#007cc2" size='small' />
                           </CardView>
                           
                       }
                    {
                       (this.props.driver.trip_id != '' && this.props.driver.currTripState != "") &&
                       <View style = {styles.viewcard}>
                            <View>
                            <View style={{padding:10}}>
                                <Text style={{alignSelf:'center',marginTop:10,fontSize:15,color:'#007cc2'}}>Hi, {this.props.data.user_name}</Text>
                            </View>    
                            <CardView
                                    cardElevation={0.6}
                                    cardMaxElevation={0.6}
                                    cornerRadius={10}
                                    style = {{marginTop:7}}>
                                    <View style={{flexDirection:'row'}}>
                                    <View style= {{width:'22%',marginStart:10}}>
                                    {
                                        this.props.driver.driver_image != null && 
                                        <Image
                                        source={{uri: `https://smoothride.ng/taxi/images/${this.props.driver.driver_image}`}}
                                        style={{width:50,height:50, alignSelf:'center',margin:5,borderRadius:25}}
                                        />
                                    } 
                                    {
                                        this.props.driver.driver_image == null && 
                                        <Image
                                        source={require('../../asset/img/profile.jpg')}
                                        style={{width:50,height:50, alignSelf:'center',margin:5,borderRadius:25}}
                                        />
                                    }   
                                    </View>
                                    <View style = {{width:'60%',marginLeft:5}}>
                                        <Text style={{fontSize:14,marginTop:1,color:'#877A80',fontWeight:'500'}}> {this.props.driver.driver_name}</Text>
                                        {
                                            this.props.driver.company_name == null &&
                                            <Text style={{fontSize:16,fontWeight:'200',color:'#877A80',fontFamily: "Roboto-Regular"}}> Unknown </Text>
                                        }
                                        {
                                            this.props.driver.company_name != null &&
                                            <Text style={{fontSize:16,fontWeight:'800',color:'#007cc2',fontFamily: "Roboto-Regular"}}> {this.props.driver.company_name}</Text>
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
                                   <View style ={{width:'60%',justifyContent:'center'}}>
                                   </View>
                                   <View style ={{width:'40%'}}>
                                       {
                                           this.state.isFetching == false && this.props.driver.driver_currTripState == 'assign' && this.state.ontrip == false &&
                                           <TouchableOpacity onPress={this.oncompleted}  style={{marginTop:7, backgroundColor:'#005091',padding:10,width:'100%',borderRadius:10,alignSelf:'center'}}>
                                            <Text style={{alignSelf:'center',color:'#fff',fontSize:13,fontFamily:'Roboto-Regular'}}>CANCEL REQUEST</Text> 
                                           </TouchableOpacity>
                                       }
                                       {
                                           this.state.isFetching == true && 
                                           <TouchableOpacity  style={{marginTop:7, backgroundColor:'#005091',padding:10,width:'100%',borderRadius:10,alignSelf:'center'}}>
                                              <ActivityIndicator size="small" color="#fff"/>
                                           </TouchableOpacity>
                                       }
                                        
                                   </View>
                               </View>
                            </View>   
                            
                        </View>
                      
                   }
                   </View>
               </ScrollView>
            </PTRView> 
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
    driverbtn:{
        marginStart:5,color:'#000',fontSize:15,alignSelf:'center',
        fontFamily:'Roboto-Regular',color:'#c1c1c1'
    },
    viewcard:{
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        padding:10,
        marginTop:10,
        borderRadius:5,
        position:"absolute",
        bottom:0,
        backgroundColor:'#fff',
        width:'100%'
    },
    cardview:{
        padding:10,
        marginTop:10,
        position:"absolute",
        bottom:0,
        backgroundColor:'#fff',
        width:'94%',
        marginLeft:'3%',
    },
    headerText:{
        fontSize:20,
        alignSelf:'center',
        color:'#fff',
        fontFamily:'Roboto-Regular',
        marginTop:status_bar_height
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