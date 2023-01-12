import store from '../store/store';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
export const login = () => {
    return {
        type: 'LOGIN'
    }
};
export const update_user = (msg) => {
    return {
        type: 'UPDATE_USER',
        data:msg
    }
};

export const request = () => {
    return {
        type: 'RIDEREQUEST'
    }
};

export const cleardriver = () => {
    return {
        type: 'CLEARDRIVER'
    }
};
export const clearrider = () => {
    return {
        type: 'CLEARRIDER'
    }
};

export const trip_detail = (msg) => {
    return {
        type: 'TRIPDETAILS',
        data: msg
    }
};
export const driver_details = (msg) => {
    return {
        type: 'DRIVERDETAILS',
        data: msg
    }
};
export const update_driverstate = (msg) => {
    return {
        type: 'DRIVERSTATE',
        data: msg
    }
};
export const receive_endaddress = (msg) => {
    return {
        type: 'ENDADDRESS',
        data: msg
    }
};
export const receive_startaddress = (msg) => {
    return {
        type: 'STARTADDRESS',
        data: msg
    }
};
export const rider_details = (msg) => {
    return {
        type: 'RIDERDETAIL',
        data: msg
    }
};
export const rider_detailsB = (msg) => {
    return {
        type: 'RIDERDETAIL2',
        data: msg
    }
};

export const receive_data = (msg) => {
    return {
        type: 'USERDATA',
        data:msg
    }
};
export const receive_error = () => {
    return {
        type: 'ERROR'
    }
};
export const fetchAddress = (msg) =>{
    return {
        type: 'ADDRESS',
        data:msg
    }
};
export const update_triptimeDriver = (msg) => {
    return {
        type: 'TRIPTIME',
        data: msg
    }
};
export const update_tripPositionDriver = (msg) => {
    return {
        type: 'TRIPPOSITION',
        data: msg
    }
};


export const acceptTrip = (state) => {
    return {
        type: 'ACCEPTTRIP',
        data: state
    }
};

export const validatecurrentTrip = (msg) => {
    return {
        type: 'VALIDTRIP',
        data:msg
    }
}
export const updateMoreTripInformationDriver = (msg) => {
    return {
        type: 'UPDATETRIPINFORMATION',
        data: msg
    }
};
export const update_endtimeDriver = (msg) => {
    return {
        type: 'UPDATEENDTRIP',
        data: msg
    }
};
export const update_endPointsDriver = (msg) => {
    return {
        type: 'UPDATEENDPOINTTRIP',
        data: msg
    }
};
export const update_FinalDetailsDriver = (msg) => {
    return {
        type: 'UPDATEFINALDETAILS',
        data: msg
    }
};
export const update_clearTripDriver = () => {
    return {
        type: 'UPDATECLEARSTATE'
    }
};
export const update_resultDriver = (msg) => {
    return {
        type: 'UPDATERESULTONTRIP',
        data:msg
    }
};
export const save_rider_data = (msg) => {
    return {
        type: 'SAVEDRIDERDATA',
        data:msg
    }
};
export const save_rider_details = (msg) => {
    return {
        type: 'SAVEDRIDERDETAIL',
        data:msg
    }
};
export const resetTripDriver = () => {
    return {
        type: 'RESETTRIP'
    }
};
export const mydistance = (msg) => {
    return {
        type: 'DISTANCE',
        data:msg
    }
};
export const endWaitingTime = (msg) => {
    return {
        type: 'WAITINGEND',
        data:msg
    }
};
export const update_trip_saving_status = (msg) => {
    return {
        type: 'UPDATETRIPSAVINGSTATUS',
        data:msg
    }
};
export const endWaiting = (data) => {
    return function(dispatch, getState) {
        return dispatch(endWaitingTime(data));
    };
};
export const getSavedRiderInfo = (data) => {
    return function(dispatch, getState) {
        return dispatch(save_rider_data(data));
    };
};
export const getSavedTripInfo = (data) => {
    return function(dispatch, getState) {
        return dispatch(save_rider_details(data));
    };
};
export const resetTripCount = () => {
    return function(dispatch, getState) {
        return dispatch(resetTripDriver());
        //alert('aaaaa');
    };
};
export const updateResultTripInfo = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_resultDriver(data));
        //alert('aaaaa');
    };
};
export const clearTripState = () => {
    return function(dispatch, getState) {
        return dispatch(update_clearTripDriver());
    };
};
export const updateFinalTripInfo = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_FinalDetailsDriver(data));
    };
};
export const updatelastPoint = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_endPointsDriver(data));
    };
};
export const endTripTimeInfo = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_endtimeDriver(data));
    };
};
export const update_triptime = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_triptimeDriver(data));
        //alert('aaaa');
    };
};
export const updateMoreTripInformation = (data) => {
    return function(dispatch, getState) {
        return dispatch(updateMoreTripInformationDriver(data));
    };
};
export const update_tripPosition = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_tripPositionDriver(data));
    };
};
export const riderdetailTrip = (data) => {
    return function(dispatch, getState) {
        return dispatch(rider_detailsB(data));
    };
}
export const clear_driver = (token) => {
    let access_token = `Bearer ${token}`;
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/canceltrip`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': access_token
            }
        })
          .then(data => data.json())
          .then(data => {
              //console.error(token);
            if(data.success == true){
                dispatch(cleardriver());
                Alert.alert(
                    'Alert',
                    'Previous Approved Trip request has been Cancelled.',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
            }else if(data.success == false){
                dispatch(cleardriver());
                Alert.alert(
                    'Alert',
                    'You cannot cancel this trip',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
            }
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'},
                ],
                {cancelable: false},
              );  
            //Alert.alert("Error: Please check your internet");
            dispatch(receive_error());
          });
    };
}
export const clear_rider = (trip_id,access_token,rider_id) => {
   
    let data ={status:'offtrip',rider_id:rider_id};
    let token = `Bearer ${access_token}`;
    store.dispatch(login());
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/exittripwithrider`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization':token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              if(data.success == true){
                dispatch(clearrider());
                dispatch(request());
              }else{
                dispatch(request());  
                Alert.alert(
                'Alert',
                'Can not update Trip request',
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
              }
                
          })
          .catch(err => {
            //Alert.alert(err.toString());
            
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const startAddress = (latitude,longitude) => {
    //Alert.alert(latitude.toString());
    const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU';
    return function(dispatch, getState) {
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${googleApiKey}`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        })
          .then(data => data.json())
          .then(data => {
              //console.error(data.results[0].formatted_address);
              dispatch(receive_startaddress(`${data.results[0].formatted_address}`));
          })
          .catch(err => {
            Alert.alert(err.message.toString());
            dispatch(receive_error());
          });
    };
}
export const endAddress = (latitude,longitude) => {
    const googleApiKey = 'AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU';
    return function(dispatch, getState) {
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${googleApiKey}`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        })
          .then(data => data.json())
          .then(data => {
              dispatch(receive_endaddress(data.results[0].formatted_address));
          })
          .catch(err => {
            //Alert.alert(err.toString());
            dispatch(receive_error());
          });
    };
}
export const user_login = (email,password,device_token) => {
    //store.dispatch(login());
    const user_email = email.replace(/\s/g, "");
    const pass = password.replace(/\s/g, "");
    let data ={email:user_email,password:pass,pushToken:device_token};
    store.dispatch(login());
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/login`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              if(data.error == 'unauthorized'){
                  Alert.alert("Username and Password does not Match");
                  dispatch(receive_error());
              }else if(data.access_token !== undefined){
                  //Alert.alert(data.user.userType);
                  dispatch(receive_data(data));
              }else{
                dispatch(receive_error());
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            //Alert.alert(err.toString());
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const cancelRequest = (token) => {
    //let access_token = `Bearer ${token}`;
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/canceltrip`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
          .then(data => data.json())
          .then(data => {
            if(data.success == true){
                Alert.alert(
                    'Alert',
                    'Previous pending request has been deleted, you can proceed to make new request',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
            }else {
                Alert.alert(
                    'Alert',
                    'You have 0 pending trip request',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
            }
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
          });
    };
}
export const bookaRide = (user_id,access_token,purpose) => {
    let data = {user_id:user_id,purpose:purpose};
    let token = `Bearer ${access_token}`;
    store.dispatch(login());
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/requestride`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              if(data.success == false){
                  //Alert.alert("Trip request is Denied, try again later");
                  Alert.alert(
                    'Alert',
                    'Trip request is Denied, try again later',
                    [
                      {text: 'OK'}
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }else if(data.success == true){
                  //Alert.alert('Your trip request await approval');
                  Alert.alert(
                    'Alert',
                    'Your trip request await approval',
                    [
                      {text: 'OK'}
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }else if(data.success == 'pending'){
                  //Alert.alert('You have a pending approval');
                  Alert.alert(
                    'Alert',
                    'You cannot request for a trip because you have a pending trip request',
                    [
                      {text: 'OK'},
                      {text: 'Delete Pending Request', onPress: () => dispatch(cancelRequest(token)) },
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }else if(data.success == 'nodriver')
              {
                Alert.alert(
                    'Alert',
                    'No Driver Available',
                    [
                      {text: 'OK'}
                      
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }
              else if(data.success == 'approved')
              {
                Alert.alert(
                    'Alert',
                    'Trip Assigned to Driver..',
                    [
                      {text: 'OK'}
                      
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
                  dispatch(getDriver(user_id,access_token));
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            //console.error(err)
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
update_driver_status = async (val) => {
  try {
    await AsyncStorage.setItem('driver_status',val);
  } catch(e) {
    // error reading value
  }
}
export const driver_status = (param,access_token) => {
    let token = `Bearer ${access_token}`;
    //store.dispatch(login());
    let data = {isAvailable:param};
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/updatedriverstatus`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              if(data.success == false){
                  Alert.alert("Error Updating Driver Status");
                  dispatch(request());
              }else if(data.success == true){
                  this.update_driver_status(param);
                  Alert.alert('Driver Status Updated');

                  dispatch(request());
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const getDistance = (origin_latitude,origin_longitude,destination_latitude,destination_longitude) => {
    let googleApikey = "AIzaSyAsjKM16fbsmVRNU4jlrhn3yinTyu3z5JU";
    return function(dispatch, getState) {
        return fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metrics&origins=${origin_latitude},${origin_longitude}&destinations=${destination_latitude},${destination_longitude}&key=${googleApikey}`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json'
            }
        })
          .then(data => data.json())
          .then(data => {
             //console.error(data);
             if(data.status == 'OK'){
                if(data.rows.length > 0){
                        if(data.rows[0].elements.length > 0){
                            if(data.rows[0].elements[0].distance.text !== undefined)
                                {
                                    let distance = data.rows[0].elements[0].distance.text.split('km')[0];
                                    dispatch(mydistance(distance));
                                    //console.error(distance);
                                }
                                
                        }
                        
                        //console.error(data.rows[0].elements[0].distance.text.split('km')[0]);
                }
             }
             
          })
          .catch(err => {
           
          });
    };
}
export const getTrip = (user_id,access_token) => {
    let data = {user_id:user_id};
    let token = `Bearer ${access_token}`;
    store.dispatch(login());
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/getlastassigntrip`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              //console.error(data);
              if(data.success == true && data.data != null){
                  //Alert.alert(data.data.email);
                  dispatch(request());
                  dispatch(rider_details(data));
              }else {
                // Alert.alert(
                //     'Alert',
                //     'No Ride Request Assigned Yet',
                //     [
                //       {text: 'OK'},
                //     ],
                //     {cancelable: false},
                //   );
                  //Alert.alert('No Ride Request Assigned Yet');
                  dispatch(request());
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const getDriver = (user_id,access_token) => {
    let data = {user_id:user_id};
    let token = `Bearer ${access_token}`;
    //console.error(token);
    //store.dispatch(login());
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/getassigneddriver`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              //console.error(data.driverdetails);
              if(data.success == true && data.data != null){
                  //console.error(data.driverdetails.currTripState);
                  //Alert.alert(data.data.email);
                  
                  dispatch(driver_details(data));
                  dispatch(request());
                  //Alert.alert(data.driverdetails.currTripState);
                  
              }else {
                //Alert.alert('No Driver Assin Request Assigned Yet');
                dispatch(cleardriver());
                dispatch(request());
               }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const completedtrip = (tripdetails,user,rider) => {
    let flag = 0;
    if(tripdetails.unformattedcost > 5000)
    {
        flag = 1;
    }
    if(tripdetails.travelTime < 60)
    {
        flag = 1;
    }
    let data = {
        srcLat:tripdetails.firstLat,srcLong:tripdetails.firstLng,trip_start_time:tripdetails.startTime,
        driverId:user.user_id,destLat:tripdetails.lastLat,destLong:tripdetails.lastLng,flag:flag,
        pickUpAddress:tripdetails.startAddress,destAddress:tripdetails.stopAddress,tripPoints:JSON.stringify(tripdetails.waypoints),
        tripAmt:tripdetails.unformattedcost,tripEndTime:tripdetails.endTime,travelTime:tripdetails.travelTime,tripDist:tripdetails.distance_covered
    };
    //console.error(data);
    let token = `Bearer ${user.access_token}`;
    return function(dispatch, getState) {
        var instance = axios.create();
        instance.defaults.timeout = 15000;
        let option = {
            timeout:15000,
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
        };
        return axios.post(`https://www.smoothride.ng/taxi/api/updatetripcompleted/${rider.trip_id}`, data, option)
          .then(response => {
              //console.error(data);
              let data = response.data;
              if(data.success == true){
                  //Alert.alert('Data Saved Successfully');
                  dispatch(update_trip_saving_status(data.success));
                  Alert.alert(
                    'Alert',
                    'Data Saved Successfully',
                    [
                      {text: 'Ok'},
                    ],
                    {cancelable: false},
                  );
                  dispatch(trip_detail(data));
                  dispatch(request());
              }else if(data.success == false){
                  //console.error(data);
                  Alert.alert('Trip details can not be updated');
                  dispatch(request());
                  dispatch(update_trip_saving_status(data.success));
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            dispatch(update_trip_saving_status(false));
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            //console.log(err);
            dispatch(receive_error());
            dispatch(request());
              //dispatch(receive_network())
          });
    };
}

export const validateTrip = (access_token,tripId) => 
{
    let token = `Bearer ${access_token}`;
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/gettripstatus/${tripId}`,{
            method:'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            }
        })
          .then(data => data.json())
          .then(data => {
              //console.error(data);
              dispatch(validatecurrentTrip(data.success));
              //return data.success;
          })
          .catch(err => {
             
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
              dispatch(validatecurrentTrip('unknown'));
              
          });
    };
}
export const declinetrip = (tripdetails,user,rider) => {
    let data = {
        trip_id:rider.trip_id
    };
    let token = `Bearer ${user.access_token}`;
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/declinetrip/${rider.trip_id}`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              //console.error(data);
              if(data.success == true){
                  //Alert.alert(data.data.email);
                  dispatch(clearrider());
              }else if(data.success == false){
                  //Alert.alert('Trip details can not be updated');
                  Alert.alert(
                    'Alert',
                    'Trip details can not be updated',
                    [
                      {text: 'OK'}
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
              //dispatch(receive_network())
          });
    };
}
export const continuetrip = (tripdetails,user,rider) => {
    let flag = 0;
    if(tripdetails.unformattedcost > 5000)
    {
        flag = 1;
    }
    let data = {
        srcLat:tripdetails.firstLat,srcLong:tripdetails.firstLng,
        driverId:user.user_id,destLat:tripdetails.lastLat,destLong:tripdetails.lastLng,flag:flag,
        pickUpAddress:tripdetails.startAddress,destAddress:tripdetails.stopAddress,tripPoints:JSON.stringify(tripdetails.waypoints),
        tripAmt:tripdetails.unformattedcost,tripEndTime:tripdetails.endTime,travelTime:tripdetails.travelTime,tripDist:tripdetails.distance_covered,wait_time_start:tripdetails.startwaitingTime,
        wait_time_end:tripdetails.endwaitingTime,wait_time:tripdetails.waitingTime,cost_wait:tripdetails.totalwaitingcost,trip_start_time:tripdetails.startTime
    };
    let token = `Bearer ${user.access_token}`;
    return function(dispatch, getState) {
        var instance = axios.create();
        instance.defaults.timeout = 15000;
        let option = {
            timeout:15000,
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': token
            },
        };
        return instance.post(`https://www.smoothride.ng/taxi/api/subsequenttrip/${rider.rider_id}`, data, option)
          .then(response => {
               //console.error(user);
               let data = response.data;
              if(data.success == true){
                dispatch(update_trip_saving_status(data.success));
                  //Alert.alert(data.data.email);
                  //Alert.alert('Data Saved Successfully');
                  Alert.alert(
                    'Alert',
                    'Data Saved Successfully',
                    [
                      {text: 'Ok'},
                    ],
                    {cancelable: false},
                  );
                  dispatch(trip_detail(data));
                  dispatch(request());
              }else if(data.success == false){
                dispatch(update_trip_saving_status(data.success));
                  Alert.alert(
                    'Alert',
                    'Trip details can not be updated',
                    [
                      {text: 'Ok'},
                    ],
                    {cancelable: false},
                  );
                  dispatch(request());
              }
                //console.error(data);
                //Alert.alert(data.access_token);
                //
          })
          .catch(err => {
            dispatch(update_trip_saving_status(false));
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
            dispatch(request());
              //dispatch(receive_network())
          });
    };
}
export const user_update = (data) => {
    return function(dispatch, getState) {
        return dispatch(update_user(data));
    };
}
export const updatetripstatus = (trip_id,access_token) => {
    //store.dispatch(login());
    let data ={trip_id:trip_id, status: 'ontrip'};
    let token = `Bearer ${access_token}`;
    store.dispatch(login());
    let value = {success:false};
    store.dispatch(trip_detail(value));
    return function(dispatch, getState) {
        return fetch(`https://www.smoothride.ng/taxi/api/updatetripstatus`,{
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization':token
            },
            body: JSON.stringify(data)
        })
          .then(data => data.json())
          .then(data => {
              if(data.success == true){
                dispatch(request());
              }else{
                  Alert.alert(
                  'Alert',
                  'Can not update Trip request',
                  [
                    {text: 'OK'}
                  ],
                  {cancelable: false},
                );
                dispatch(request());
              }
                
          })
          .catch(err => {
            Alert.alert(
                'Alert',
                err.message.toString(),
                [
                  {text: 'OK'}
                ],
                {cancelable: false},
              );
            //Alert.alert(err.toString());
            dispatch(receive_error());
            dispatch(request());
              //dispatch(receive_network())
          });
    };
}
