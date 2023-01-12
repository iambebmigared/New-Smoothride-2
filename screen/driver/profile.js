import React, { Component } from 'react';
import {View, Text,Alert, Image,StyleSheet,TextInput, TouchableOpacity, ScrollView,StatusBar} from 'react-native';
import {connect} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
const status_bar_height = Platform.OS == 'ios' ? 20 : 0;
class ProfileScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data:0,
            select:''
        }
    }
    static navigationOptions = {
        header:null
    };
    componentDidMount(){
        this._refresh();
    }
    select = (val) =>{
        this.setState({select:val})
     }
     logout = async () => {
        //await AsyncStorage.clear();
        AsyncStorage.clear((err, result) => {
             RNRestart.Restart();
            //this.props.navigation.navigate('login');
          });
        
    }
    _refresh = async() => {
        //this.setState({isFetching:true});
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
              this.setState({data:data.length});
          })
          .catch(err => {
            Alert.alert(err.toString());
          });
      }
      render(){
        return(
            <ScrollView showsVerticalScrollIndicator = {false} style= {styles.container}>
                <View style={{flexDirection:'row',padding:10,backgroundColor:'#005091',borderBottomEndRadius:20,borderBottomStartRadius:20}}>
                    <View style={{width:'25%'}}>
                    <Image
                             source={require('../../asset/img/profile.jpg')}
                             style={{width:80,height:80,borderRadius:40}}
                     />
                    </View>
                    
                    <View style={{width:'75%'}}>
                         <Text style={{color:'#fff', fontFamily:'Roboto-Bold',marginTop:10}}>{this.props.data.user_name}</Text>
                         <View style={{flexDirection:'row'}}>
                             <View style={{width:'50%'}}>
                                <Text style={{color:'#fff', fontFamily:'Roboto-Regular',marginTop:4,fontSize:13}}>Role</Text>
                                <Text style={{color:'#fff',fontWeight:'bold', fontFamily:'Roboto-Regular',marginTop:4,fontSize:13}}>Driver</Text>
                             </View>
                             <View style={{width:'50%'}}>
                                <Text style={{color:'#fff', fontFamily:'Roboto-Regular',marginTop:4,fontSize:13}}>Completed Trips</Text>
                                <Text style={{color:'#fff',fontWeight:'bold', fontFamily:'Roboto-Regular',marginTop:4,fontSize:13,marginLeft:'40%'}}>{this.state.data}</Text>
                             </View>
                         </View>
                     </View>
                </View>
                <View style={{marginTop:20,padding:10}}>
               
                    <View style={{flexDirection:'row'}}>
                            <View style={{width:'10%',marginTop:30}}>
                            <IonIcon name="md-headset" size={20} color="#000000"></IonIcon>
                            </View>
                            <View style={{flexDirection:'row', width:'90%',marginTop:30,borderBottomColor:'#c1c1c1',borderBottomWidth:1,paddingBottom:4}}>
                            
                            <Text onPress = {()=>this.select('support')} style={{fontFamily:'Roboto-Bold',fontSize:12,width:'90%'}}>Support Center</Text>
                            { 
                                this.state.select !== 'support' && 
                                <IonIcon name="ios-arrow-forward" size={20} color="#000000" style={{width:'5%'}}></IonIcon>
                            }
                            { 
                                this.state.select == 'support' && 
                                <IonIcon name="ios-arrow-down" size={20} color="#000000" style={{width:'5%'}}></IonIcon>
                            }
                            </View>
                    </View>
                    {
                      this.state.select == 'support' && 
                      <View> 
                        <View style={{flexDirection:'row',marginTop:-10}}>
                              <View style={{width:'10%',marginTop:0}}>
                                 
                              </View>
                              <View style={{flexDirection:'row', width:'90%',marginTop:30,paddingBottom:4}}>
                              <Image
                                          source={require('../../asset/img/email.png')}
                                          style={{width:20,aspectRatio:1.3,alignSelf:'center',width:'10%',margin:5}}
                                 />
                                 <Text style={{fontFamily:'Roboto-Bold',fontSize:12,color:'#000',width:'80%',marginTop:10,marginStart:10}}>info@smoothride.ng</Text>
                              </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:-10}}>
                              <View style={{width:'10%',marginTop:0}}>
                                 
                              </View>
                              <View style={{flexDirection:'row', width:'90%',marginTop:30,paddingBottom:4}}>
                              <Image
                                          source={require('../../asset/img/smartphone.png')}
                                          style={{width:20,aspectRatio:0.9,alignSelf:'center',width:'10%',margin:5}}
                                 />
                                 <Text style={{fontFamily:'Roboto-Bold',fontSize:12,color:'#000',width:'80%',marginTop:10,marginStart:10}}>08113975330</Text>
                              </View>
                        </View>
                    </View>
                   }
                   
                    <View style={{flexDirection:'row'}}>
                         <View style={{width:'10%',marginTop:30}}>
                            <IonIcon name="md-globe" size={20} color="#000000"></IonIcon>
                         </View>
                         <View style={{flexDirection:'row', width:'90%',marginTop:30,borderBottomColor:'#c1c1c1',borderBottomWidth:1,paddingBottom:4}}>
                         
                         <Text onPress = {() =>this.select('social')} style={{fontFamily:'Roboto-Bold',fontSize:12,width:'90%'}}>Socials</Text>
                         
                         { 
                            this.state.select !== 'social' && 
                            <IonIcon name="ios-arrow-forward" size={20} color="#000000" style={{width:'5%'}}></IonIcon>
                         }
                         { 
                            this.state.select == 'social' && 
                            <IonIcon name="ios-arrow-down" size={20} color="#000000" style={{width:'5%'}}></IonIcon>
                         }
                         </View>
                
                    </View>
                    
                    {
                       this.state.select == 'social' && 
                       <View> 
                         <View style={{flexDirection:'row'}}>
                               <View style={{width:'10%',marginTop:30}}>
                                  
                               </View>
                               <View style={{flexDirection:'row', width:'90%',marginTop:30,paddingBottom:4}}>
                               <Text style={{fontFamily:'Roboto-Regular',fontSize:15,width:'90%'}}>Follow us on</Text>
                               </View>
                      
                         </View>
                         <View style={{flexDirection:'row',marginTop:-10}}>
                               <View style={{width:'10%',marginTop:0}}>
                                  
                               </View>
                               <View style={{flexDirection:'row', width:'90%',marginTop:30,paddingBottom:4}}>
                                  <IonIcon name="logo-twitter" size={50} color="#00acee" style={{width:'20%'}}></IonIcon>
                                  <IonIcon name="logo-facebook" size={50} color="#3b5998" style={{width:'20%'}}></IonIcon>
                                 
                               </View>
                      
                         </View>
                     </View>
                    }
                    
                    
                    <View style={{flexDirection:'row',marginTop:50}}>
                         <View style={{width:'10%',marginTop:30}}>
                            <IonIcon name="md-log-out" size={20} color="#000000"></IonIcon>
                         </View>
                         <View style={{flexDirection:'row', width:'90%',marginTop:30}}>
                         
                         <Text onPress = {this.logout} style={{fontFamily:'Roboto-Bold',fontSize:12,width:'90%'}}>Log Out</Text>
 
                         </View>
                    </View>
                     
                </View>
            </ScrollView>
         );
    }
   
}
const styles = StyleSheet.create({
    container: {
        flex: 1
      },
      summary:{
        flexDirection:'row',
        width:'100%'
      },
      info:{
        width:'100%',
        borderBottomWidth:1,
        borderColor:'#C1C1C1'
      }, 
      header:{
        backgroundColor:'#007cc2',
        alignSelf:'center',
        width:'100%',
        padding:14
    },
    body:{
        height:'35%',
        backgroundColor:'#007cc2',
        justifyContent:'center',
        alignItems:'center'
    },
    headerText:{
        fontSize:20,
        alignSelf:'center',
        color:'#fff',
        fontFamily: "Roboto-Regular",
        marginTop:status_bar_height
    }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer
    };
};
export default connect(mapStateToProps)(ProfileScreen);