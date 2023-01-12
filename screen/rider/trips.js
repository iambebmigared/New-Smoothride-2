import React, { Component } from 'react';
import {View, Text,Dimensions,StatusBar,TouchableHighlight,Alert, ImageBackground,SafeAreaView,ActivityIndicator,StyleSheet,TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import PTRView from 'react-native-pull-to-refresh';
import Modal from "react-native-modal";
import MapViewDirections from 'react-native-maps-directions';
import MapView, { PROVIDER_GOOGLE, AnimatedRegion, Marker,Polyline } from 'react-native-maps';
import CardView from 'react-native-cardview';
import ReactInterval from 'react-interval';
const { width, height  } = Dimensions.get('window');
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
        this.state = {
            isFetching:false,
            data:[],
            showModal:false,
            price:'',
            pickUpAddress:'',
            destAddress:'',
            traveltime:'',
            lat:23,
            Lng:90,
            origin:{},
            destination:{},
            waypoints:[],
            routeCoordinates:[],
            alldata:[],
            curr:0

        }
    }
    _refresh = async() => {
        this.setState({isFetching:true});
        let token = `Bearer ${this.props.data.access_token}`;
        fetch(`https://www.smoothride.ng/taxi/api/getridertrip`,{
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
      savedetails = async (d) =>{
        //this.setState({showModal:!this.state.showModal});
            this.props.navigation.navigate('tripmap', {
              data:d
            });
      }
    /*savedetails = (d) => {
        //console.error(d);
        //return false;
         this.setState({showModal:true});
         //let waypoints = d.tripPoints == null ?  [] : JSON.parse(d.tripPoints);
         //let convertpoints = [];
         this.setState({lat:parseFloat(d.srcLat),Lng:parseFloat(d.srcLong),alldata:JSON.parse(d.tripPoints)});
         const newCoordinate = {latitude:parseFloat(d.srcLat), longitude:parseFloat(d.srcLong),latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA }
         this.setState({routeCoordinates: this.state.routeCoordinates.concat([newCoordinate])});
         
    }*/
    goback = () => {
        this.setState({showModal:false,price:'',destAddress:'',pickUpAddress:'',traveltime:''});

    }
    componentDidMount(){
        this.setState({isFetching:true});
        let token = `Bearer ${this.props.data.access_token}`;
        fetch(`https://www.smoothride.ng/taxi/api/getridertrip`,{
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
    
    getMapRegion = () => ({
        latitude: this.state.lat, 
        longitude: this.state.Lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
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
    showmap = () => {
        this.setState({showModal:true});
    } 
    updateview = () =>{
        //console.error(this.state.alldata); 
        if(this.state.alldata.length > this.state.curr && this.state.showModal == true){
            //console.error('yes'); 
          const newCoordinate = {latitude:this.state.alldata[this.state.curr].latitude, longitude:this.state.alldata[this.state.curr].longitude,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA }
          this.setState({routeCoordinates: this.state.routeCoordinates.concat([newCoordinate])});
          let curr = this.state.curr + 1;
          this.setState({curr:curr});
        }
        
    }
    render(){
        return (
            <PTRView onRefresh={this._refresh}>  
            <ScrollView>
            <View style={styles.container}>
                              
                <Modal isVisible={this.state.showModal} style={{width:width,backgroundColor:'red',margin: 0}}>
                        <View style={{backgroundColor:'#fff',width:width,height:height,marginLeft:0 }}>
                          
                        <CardView
                        cardElevation={2}
                        cardMaxElevation={2}
                        cornerRadius={5} style={styles.cardview2}>
                        <TouchableOpacity onPress={this.goback} style={{backgroundColor:'#a31225',padding:10}}>
                        <Text style={{alignSelf:'center',color:'#fff',fontSize:18}}>
                            GO BACK
                        </Text>
                        </TouchableOpacity>     
                        </CardView> 
                        <ReactInterval timeout={10} enabled={true}
                           callback={this.updateview} /> 
                        {
                            this.state.Lng != '' &&
                            <MapView
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={{height:mapviewheight}}
                            showUserLocation
                            followUserLocation
                            loadingEnabled
                            region={this.getMapRegion()}
                            >
                            <Polyline coordinates={this.state.routeCoordinates} strokeWidth={2} />
                            
                            </MapView>
                        } 
                        
                        </View>
                </Modal>
                {
                    this.state.isFetching == true && <ActivityIndicator color="#007cc2" size='large' />
                }
                {
                    this.state.data.length == 0 && this.state.isFetching == false && <Text>No Trip History record</Text>
                }
                {
                    this.state.data.map((d) =>
                    <View style={{borderWidth:1,borderColor:'#005091',margin:7,borderBottomLeftRadius:5,borderBottomRightRadius:5}} key = {d.id} value = {d.id}>
                        <View style={{backgroundColor:'#005091',padding:7}}>
                            <View style = {{flexDirection:"row"}}>
                                <View style={{width:'50%'}}>
                                   <Text style={{color:'#fff',alignSelf:'flex-start',fontSize:12}}> {d.name}</Text>
                                   <Text style={{color:'#fff',alignSelf:'flex-start',fontSize:12}}> Travel Time: {this.toHHMMSS(d.travelTime)}</Text>
                                </View>
                                
                                <View style={{width:'50%'}}>
                                    <Text style={{alignSelf:'flex-end',color:'#fff',fontSize:12}}>NGN {parseFloat(d.tripAmt).toFixed(2)}</Text>
                                    <View style={{width:'60%',backgroundColor:'#007cc2',alignSelf:'flex-end',borderRadius:5}}>
                                       <Text onPress = {()=>this.savedetails(d)} style={{borderRadius:2,color:'#fff',padding:2,alignSelf:'center'}}>ROUTE</Text>
                                    </View>
                                    
                                </View>
                            </View>
                        </View>
                        <View style={{borderBottomColor:'#005091',borderBottomWidth:1,marginBottom:7}}>
                            <View style = {styles.info}>  
                            <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'green',marginTop:10}}/> {d.pickUpAddress}</Text>
                            
                            </View>
                        </View>
                        <View style={{marginBottom:7}}>
                            <View style = {styles.info}>  
                            <Text style={{marginTop:1,color:'#877A80'}}> <Ionicons name='md-pin' size={15} style={{color:'red',marginTop:10}}/> {d.destAddress}</Text>
                            
                            </View>
                        </View>
                    </View>    
                    
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
      info:{
          width:'100%',
          padding:10
      }, 
      endarrow:{
          width:'5%'
      },
      body:{
        flexDirection:'row',
        padding:10,
        paddingBottom:2,
        paddingTop:5
      },
      header:{
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
    cardview:{
        padding:10,
        marginTop:10,
        position:"absolute",
        top:0,
        backgroundColor:'transparent',
        width:'100%'
    },
    cardview2:{
        padding:10,
        marginTop:10,
        position:"absolute",
        bottom:5,
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
        data:state.DataReducer
    }
}
export default connect(mapStateToProps)(TripScreen);