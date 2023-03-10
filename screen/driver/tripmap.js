import React,{ Component } from 'react';

import {View, Text, ScrollView, Image,StyleSheet,ActivityIndicator, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Timeline from 'react-native-timeline-flatlist';
import {startAddress} from '../action/fetch';

class PointsScreen extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            Address:[],
            waypoints:[],
            isFetching:false,
            position:0
        }
    }

    static navigationOption = {
        header:null
    }
    componentDidMount(){
        let data = this.props.navigation.getParam('data');
        this.setState({isFetching:true});
        this.getaddress(data);
        
    }
    getaddress = async (data) =>{
        let waypoints = [];
        if(data.tripPoints !== null) waypoints = JSON.parse(data.tripPoints);
        this.setState({waypoints:waypoints});

        Address = [];
        Address.push({time: 'Start', title: 'Initial', description:`${data.pickUpAddress}`});
        for(let r = 0; r < waypoints.length; r++){
            await this.props.dispatch(startAddress(waypoints[r].latitude,waypoints[r].longitude));
            let res = {time: `${r+1}`, title: `Point ${r+1}`, description:`${this.props.rider.startAddress}`};
            this.setState({position:(r+1)});
            Address.push(res);
            //Alert.alert(this.props.rider.startAddress);
        }
        Address.push({time: 'End', title: 'Final', description:`${data.destAddress}`});
        this.setState({Address:Address});
        this.setState({isFetching:false});
        //console.error(Address);
    }

    render(){
        return (
            <ScrollView style={styles.container}>
                <View>
                    <View style={{backgroundColor:'#005091',padding:15}}>
                         <View style={{flexDirection:'row',padding:10,marginBottom:20}}>
                          <IonIcon onPress={() => this.props.navigation.goBack()} name="ios-arrow-back" size={26} color="#fff" style={{width:'6%'}}></IonIcon>
                          <Text style={{color:'#fff',width:'92%', fontSize:20,textAlign:'center',marginLeft:'-2%',fontFamily:'Roboto-Bold'}}>Way Points</Text>
                         </View>
                    </View>
                    {
                        this.state.isFetching == true &&
                        <View style ={{marginTop:'45%'}}>
                            <Text style={{alignSelf:'center',fontFamily:'Roboto-Regular',fontSize:15}}>Getting address of Point {this.state.position} / {this.state.waypoints.length} </Text>
                           <ActivityIndicator color="#007cc2" size='large' />
                        </View>
                    }
                    {
                        this.state.isFetching == false &&
                        <Timeline
                           innerCircle={'dot'}
                           lineColor='#005091'
                           circleColor='#007cc2'
                           timeContainerStyle={{minWidth:52, marginTop: 0}}
                           descriptionStyle={{color:'gray'}}
                           data={this.state.Address}
                           titleStyle = {{color:'gray',fontSize:14}}
                           timeStyle={{textAlign: 'center', backgroundColor:'#005091', color:'white', padding:2, borderRadius:13}}
                           options={{
                            style:{marginTop:15}
                          }}
                        />
                    }
                </View>
            </ScrollView>
        )
    }

}
const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:0,
        backgroundColor:'#fff'
    }
});
const mapStateToProps = state => {
    return {
        data: state.DataReducer,
        rider:state.RiderReducer
    };
};
export default connect(mapStateToProps)(PointsScreen);
//export default TipScreen;