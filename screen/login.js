import React, { Component } from 'react';
import {View,KeyboardAvoidingView,Image, Text,SafeAreaView, ImageBackground,StyleSheet,TextInput,Alert, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {user_login} from '../action/fetch';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

class LoginScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            isFetching:false
        }
    }
    static navigationOptions = {
        header:null
    };
    componentDidMount() {
       
        if(this.props.data.role == 'driver'){
            this.props.navigation.navigate('Drivertab');
        }
    }
    componentWillUnmount(){
        //this.setState({email:'',password:''});
    }
    login = async () => {
        let email = this.state.email;
        let password = this.state.password;
        //Alert.alert(email);
        if(email == '' || password == ''){
            //Alert.alert('Email and Password field is required');
            Alert.alert(
                'Alert',
                'Email and Password field is required',
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            return false;
        }
        //this.setState({isFetching:true});
        const device_token = await AsyncStorage.getItem('device_token');
        //this.setState({email:'',password:''});
        const user = await  this.props.dispatch(user_login(email,password,device_token));
        //console.error(this.props.data);
        if(this.props.data.role == 'staff'){
            //this.setState({email:"",password:""});
            let user_data = await AsyncStorage.setItem('user_data',JSON.stringify(this.props.data));
            let formdata = await AsyncStorage.setItem('formdata',JSON.stringify({email:email,password:password}));
            //this.setState({email:"",password:""});
            this.props.navigation.navigate('Ridertab');
            
        }
        else if(this.props.data.role == 'driver'){
            //this.setState({email:"",password:""});
            let user_data = await AsyncStorage.setItem('user_data',JSON.stringify(this.props.data));
            let formdata = await AsyncStorage.setItem('formdata',JSON.stringify({email:email,password:password}));
            this.props.navigation.navigate('Drivertab');
            
        } 
        else{
            Alert.alert(
                'Alert',
                'User cannot be Identified',
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert("User cannot be Identified");
        }
            
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
                        <Text style={{fontSize:20,alignSelf:'center',padding:7, color:'#fff',fontWeight:'800',fontFamily: "Roboto-Bold"}}>LOGIN</Text>
                    </View>
                    <View>
                    <TextInput 
                            onChangeText={(text)=>this.setState({email:text})}
                            placeholder = 'Email'
                            placeholderTextColor="#fff"
                            style={{paddingStart:20,color:'#fff',borderColor: '#fff', borderWidth: 1,height:45,borderRadius:30,fontSize:14,fontFamily: "Roboto-Regular"}}
                        />
                    <TextInput 
                            onChangeText={(text)=>this.setState({password:text})}
                            placeholder = 'Password'
                            secureTextEntry={true}
                            placeholderTextColor="#fff"
                            style={{paddingStart:20,color:'#fff',height:45,borderColor: '#fff',marginTop:20,fontSize:14,borderRadius:30, borderWidth: 1,fontFamily: "Roboto-Regular"}}
                        />  
                    <TouchableOpacity onPress = {this.login}>
                        <View  style={{marginTop:40,backgroundColor:'#a31225',borderRadius:30,padding:7}}>
                          {
                              this.props.data.isFetching == true && <ActivityIndicator color="#fff" size='small' /> 
                          }
                          {
                              this.props.data.isFetching == false && <Text style={{alignSelf:"center",color:'#fff',fontSize:17,fontFamily: "Roboto-Bold"}}>LOGIN</Text> 
                          }
                        </View>  
                    </TouchableOpacity>  
                    <View>
                        <Text onPress = {()=> this.props.navigation.navigate('forget')} style={{fontSize:15,alignSelf:'center',padding:7, color:'#fff',fontWeight:'800',fontFamily: "Roboto-Bold",marginTop:15}}>RESET PASSWORD?</Text>
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
export default connect(mapStateToProps)(LoginScreen);