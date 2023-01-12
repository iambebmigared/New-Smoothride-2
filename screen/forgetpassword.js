import React, { Component } from 'react';
import {View,KeyboardAvoidingView,Image, Text,SafeAreaView, ImageBackground,StyleSheet,TextInput,Alert, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {user_login} from '../action/fetch';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

class ForgetScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            isFetching:false
        }
    }
    static navigationOptions = {
        header:null
    };
    componentDidMount() {
        
    }
    forget = async () => {
        let email = this.state.email;
        if(email == ''){
            Alert.alert('Email field is required');
            return false;
        }
        let d = {email:this.state.email};
        this.setState({isFetching:true});
        //let token = `Bearer ${this.props.data.access_token}`;
        await fetch(`https://www.smoothride.ng/taxi/api/forgotpassword`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(d)
        })
          .then(data => data.json())
          .then(data => {
            this.setState({isFetching:false});
               if(data.success == true){
                Alert.alert(
                    'Alert',
                    'Check your Email for your new Password',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
               }else {
                Alert.alert(
                    'Alert',
                    'User does not exist',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
               }
          })
          .catch(err => {
            this.setState({isFetching:false});
            Alert.alert(err.toString());
          });
            
    }
    render(){
        return (
            <SafeAreaView>
            <ImageBackground source={require('../asset/img/Smot.jpg')} style={{width: '100%', height: '100%'}}>
                <KeyboardAvoidingView behavior="padding" style={{flex:1,justifyContent:'center'}}> 
                 <View style={styles.container}>
                    <View style={{padding:10}}>
                       <Image
                        style={{width: 100, height: 80,alignSelf:'center'}}
                        source={require('../asset/img/smoothride.png')}
                        />
                    </View> 
                    <View>
                        <Text style={{fontSize:18,alignSelf:'center',padding:7, color:'#fff',fontWeight:'800',fontFamily: "Roboto-Bold"}}>RESET PASSWORD</Text>
                    </View>
                    <View>
                    <TextInput 
                            onChangeText={(text)=>this.setState({email:text})}
                            placeholder = 'Email'
                            placeholderTextColor="#fff"
                            style={{paddingStart:20,marginTop:20,borderColor: '#fff',height:45,color:'#fff', borderWidth: 1,borderRadius:30,fontSize:14,fontFamily: "Roboto-Regular"}}
                        /> 
                    <TouchableOpacity onPress = {this.forget}>
                        <View  style={{marginTop:20,backgroundColor:'#a31225',padding:7,borderRadius:30}}>
                          {
                              this.state.isFetching == true && <ActivityIndicator color="#fff" size='small' /> 
                          }
                          {
                              this.state.isFetching == false && <Text style={{alignSelf:"center",color:'#fff',fontSize:17,fontFamily: "Roboto-Regular"}}>RESET PASSWORD</Text> 
                          }
                        </View>       
                    </TouchableOpacity>     
                    <View>
                        <Text onPress = {()=> this.props.navigation.navigate('login')} style={{fontSize:15,alignSelf:'center',padding:7, color:'#fff',fontWeight:'800',fontFamily: "Roboto-Bold",marginTop:15}}>GO TO LOGIN </Text>
                    </View>   
                    </View>
               </View>
               </KeyboardAvoidingView>
            </ImageBackground>
            </SafeAreaView>
        

            
        );
    }
}
const styles = StyleSheet.create({
    SafeAreaView:{
        width:'100%',
        height:'100%'
    }, 
   ImageBackground:{
       padding:10
   },
   container:{
       flex:1,
       marginTop:'25%',
       marginBottom:'20%',
       marginLeft:'5%',
       marginRight:'5%'
   }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer
    };
};
export default connect(mapStateToProps)(ForgetScreen);