import React, { Component } from 'react';
import {View, Text,Image,SafeAreaView,KeyboardAvoidingView,StatusBar,Dimensions, ImageBackground,Alert,ActivityIndicator,StyleSheet,TextInput, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PTRView from 'react-native-pull-to-refresh';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { continuetrip } from '../../action/fetch';
import {completedtrip} from '../../action/fetch';
import { ProgressDialog } from 'react-native-simple-dialogs';
import CardView from 'react-native-cardview';
import Modal from 'react-native-modal';

const status_bar_height = Platform.OS == 'ios' ? 20 : 0;

class pendingsScreen extends React.Component{
    static navigationOptions = {
        header:null
    };
    constructor(props){
        super(props);
        this.state = {
            isFetching:false,
            isSaving:false,
            unsync:[],
            getlocationmodal:false,
            locationFromGoogle:[]
        }
    }
      _refresh = async() => {
        //this.setState({isFetching:true});
        this.unsyncData();
      }
    componentDidMount(){
        this.unsyncData();
    }
    unsyncData = async () => {
        try {
            const data = await AsyncStorage.getItem('unsyncData');
            if (data !== null) {
                let datajson = JSON.parse(data);
                this.setState({unsync:datajson,isFetching:false,isSaving:false});
                //console.error(datajson);
            }
          } catch (error) {
            // Error retrieving data
            this.setState({isFetching:false,isSaving:false});
          }
        
    }
    saveData = async (data) =>{
        //console.error(this.props.data);
        //return false;
        this.setState({isSaving:true});
        if(data.isFirstTrip == true){
            await this.props.dispatch(completedtrip(data.state,this.props.data,data.propsrider));
            if(this.props.rider.trip_submit_status == true) {
            let index = this.state.unsync.findIndex(x => x.startTime === data.startTime);
            let unsync = this.state.unsync;
            unsync.splice(index,1);
            let alltripsjson = JSON.stringify(unsync);
            try {
                await AsyncStorage.setItem('unsyncData',alltripsjson);
                this.unsyncData();
                this.setState({isSaving:false});
                } catch (error) {}
            }else{
                Alert.alert('Error Saving Data');
                this.setState({isSaving:false});
            }    
        }else{
            await this.props.dispatch(continuetrip(data.state,this.props.data,data.propsrider));
            if(this.props.rider.trip_submit_status == true){
                let index = this.state.unsync.findIndex(x => x.startTime === data.startTime);
                let unsync = this.state.unsync;
                unsync.splice(index,1);
                let alltripsjson = JSON.stringify(unsync);
                try {
                    await AsyncStorage.setItem('unsyncData',alltripsjson);
                    this.unsyncData();
                    this.setState({isSaving:false});
                    } catch (error) {}
            }else{
                Alert.alert('Error Saving Data');
                this.setState({isSaving:false});
            }  
        }
    }
    openModal = () =>{
        this.setState({getlocationmodal:!this.state.getlocationmodal});
    }
    getaddressSpecified = (text) => {
        Alert.alert(text);
        const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU'; 
         fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=geocode&language=fr&key=${googleApiKey}`, {
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
        }).then(async data => data.json()).then(async data => {
              if(data.status == 'OK'){
                console.error(locationFromGoogle);  
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
            let position = {
                coords:{latitude:data.results[0].geometry.location.lat,longitude:data.results[0].geometry.location.lng}
            };  
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
      
    render(){
        return (
            <PTRView onRefresh={this._refresh}>  
            <Modal isVisible={this.state.getlocationmodal}>
                    <SafeAreaView style={{backgroundColor:'#fff',width:Dimensions.get('window').width,height:Dimensions.get('window').height,padding:15,paddingTop:5,marginRight:0,alignSelf:'center',marginTop:20 }}>
                    
                        <Text style={{color:'#000',fontSize:18,fontFamily:'Roboto-Bold',textAlign:'center',marginTop:20}}>Input your pickup and Destination Address</Text> 
                        <Text style={{color:'#000',fontSize:15,fontFamily:'Roboto-Regular',textAlign:'center',marginTop:5}}>
                            
                        </Text> 
                        <View style={{padding:10,alignSelf:'center',marginTop:5,width:'100%'}}>
                                <KeyboardAvoidingView>
                                <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5} style={styles.cardview}>    
                                        <TextInput onFocus = {this.resetaddress} onChangeText = {(text) => this.getaddressSpecified(text)} style={{width:'100%', height:40,borderColor:'gray'}} placeholder="Enter the pickup address"/>
                                </CardView>
                                <CardView
                                        cardElevation={2}
                                        cardMaxElevation={2}
                                        cornerRadius={5} style={styles.cardview}>    
                                        <TextInput onFocus = {this.resetaddress} onChangeText = {(text) => this.getaddressSpecified(text)} style={{width:'100%', height:40,borderColor:'gray'}} placeholder="Enter the Destination address"/>
                                </CardView>
                                </KeyboardAvoidingView>
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
                                          <TouchableOpacity value ={location.description} key = {location.description} onPress = {()=>this.convertAddressToPoint(location.description)} style={{height:40,width:'100%',borderWidth:1,borderColor:'#c1c1c1',marginTop:4,justifyContent:'center'}}>
                                              <Text style={{alignSelf:'flex-start',marginStart:5}}>{location.description}</Text>
                                          </TouchableOpacity>
                                        )
                                    }
                                </View>
                        </View>
                    </SafeAreaView>
                    
                   </Modal>
            <ScrollView> 
                <ProgressDialog
                    visible={false}
                    title="Saving Data to Server"
                    message="Please, wait..."
                />
                <View style={styles.container}>
                    <View style={styles.header}>
                    <Text style={styles.headerText}>Pending Trip Information</Text>
                    </View>
                    {
                        this.state.isFetching == true && <ActivityIndicator color="#007cc2" size='large' />
                    }
                    {
                        this.state.unsync.length == 0 && 
                        <View style={{padding:10}}><CardView

                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={5} style={styles.cardview}>
                            <Text style={{color:'#877A80',alignSelf:'center',fontSize:16}}>
                                    No Pending Information here
                            </Text>
                       </CardView></View>
                    }
                    {
                        this.state.unsync.map((d) =>
                        <View style={styles.body} key = {d.startTime.toString()} value={d.startTime}>
                            <View style= {styles.img}>
                                    <Image
                                    source={require('../../asset/img/profile.jpg')}
                                    style={{width:70,height:70, alignSelf:'center',margin:5}}
                                    />
                            </View>
                                <View style = {styles.info}>
                                <Text style={{marginTop:1,color:'#877A80',fontWeight:'bold'}}> {d.rider_name}</Text>
                                
                                
                                
                                <View>
                                   <Text style={{marginTop:1,color:'#877A80'}}> Distance Travelled <Ionicons name='md-pin' size={15} style={{color:'#a31225',marginTop:10}}/> {d.distance_covered} Meters</Text>
                                   <Text style={{marginTop:1,color:'#877A80'}}> NGN {d.cost}</Text>
                                </View>
                                {
                                    this.state.isSaving == false &&
                                    <Text onPress = {() => this.saveData(d)} style={{marginTop:5,borderTopRightRadius:3,borderTopLeftRadius:3,borderBottomRightRadius:3,borderBottomLeftRadius:3,color:'#fff',alignSelf:'flex-end',padding:3,backgroundColor:'#a31225'}}> Save </Text>

                                }
                                
                                
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
      cardview:{
        padding:10,
        marginTop:10,
        backgroundColor:'#fff'
    },
      img:{
          width:'22%'
      },
      info:{
          width:'75%',
          marginLeft:5
      },
      body:{
        flexDirection:'row',
        padding:10,
        paddingTop:5,
        borderBottomWidth:1,
        borderColor:'#C1C1C1'
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
    }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer,
        rider:state.RiderReducer
    };
};
export default connect(mapStateToProps)(pendingsScreen);