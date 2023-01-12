import { AnimatedRegion } from 'react-native-maps';
import { Dimensions } from 'react-native';
const { width, height  } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.006339428281933124;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const initial_state = {
        startTime:'',
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
        appState:'',
        startwaitingHour:'',
        startwaitingMin:'',
        startwaitingSec:'',
        endwaitingHour:'',
        endwaitingMin:'',
        endwaitingSec:'',
        totalwaitingTime:0,
        totalwaitingcost:0,
        startwaitingDate:'',
        endwaitingDate:'',
        waitingTime:0,
        startwaitingTime:'',
        endwaitingTime:'',
        firstLocationTime:'',
        tripSavingStatus:false,
        isEndingTrip:false,
        isValidTrip:'',
       coordinate: new AnimatedRegion({
           latitude: 23,
           longitude: 90,
           latitudeDelta:LATITUDE_DELTA,
           longitudeDelta:LONGITUDE_DELTA
       })

};

const TripReducer = (state = initial_state, action) => {
    switch(action.type){      
        case 'UPDATETRIPSAVINGSTATUS':
                return Object.assign({}, state, {
                    tripSavingStatus:action.data
        });
        case 'VALIDTRIP':
                return Object.assign({}, state, {
                    isValidTrip:action.data
        });  
        case 'TRIPTIME':
                return Object.assign({}, state, {
                    startHour:action.data.startHour,
                    startMin:action.data.startMin,
                    startSec:action.data.startSec,
                    startTime:action.data.startTime,
                    isStarted:action.data.isStarted
        });        
        case 'TRIPPOSITION':
                return Object.assign({}, state, {
                    prevposition:action.data.prevposition,
                    firstLat:action.data.firstLat,
                    firstLng:action.data.firstLng,
                    position:action.data.position,
                    firstLocationTime:action.data.firstLocationTime
        });        
        case 'UPDATETRIPINFORMATION':
                return Object.assign({}, state, {
                    position:action.data.position,
                    waypoints:action.data.waypoints,
                    prevposition:action.data.prevposition,
                    routeCoordinates:action.data.routeCoordinates,
                    distance_covered:action.data.distance_covered
        });     
        case 'UPDATEENDTRIP':
                return Object.assign({}, state, {
                    isEnded:action.data.isEnded,
                    isEndingTrip:action.data.isEndingTrip,
                    getAddress:action.data.getAddress
        });
        case 'WAITINGEND':
                return Object.assign({}, state, {
                    waitingTime:action.data.waitingTime,
                    startwaitingTime:action.data.startwaitingTime,
                    endwaitingTime:action.data.endwaitingTime
        });
        case 'UPDATEENDPOINTTRIP':
                return Object.assign({}, state, {
                    lastLat:action.data.lastLat,
                    lastLng:action.data.lastLng,
                    distance_covered:action.data.distance_covered
        }); 
        case 'UPDATEFINALDETAILS':
                return Object.assign({}, state, {
                    stopAddress:action.data.stopAddress,
                    cost:action.data.cost,
                    unformattedcost:action.data.unformattedcost,
                    travelTime:action.data.travelTime,
                    endTime:action.data.endTime,
                    totalwaitingcost:action.data.totalwaitingcost,
                    getAddress:action.data.getAddress

        });
        case 'UPDATERESULTONTRIP':
                return Object.assign({}, state, {
                    alltrips:action.data.alltrips,
                    isStarted:action.data.isStarted,
                    isEnded:action.data.isEnded,
                    getAddress:action.data.getAddress,
                    isFirstTrip:action.data.isFirstTrip
        });
        case 'SAVEDRIDERDETAIL':
                return Object.assign({}, state, {
                        startTime:action.data.startTime,
                        endTime:action.data.endTime,
                        isStarted:action.data.isStarted,
                        distance_covered:action.data.distance_covered,
                        position:action.data.position,
                        prevposition:action.data.prevposition,
                        waypoints:action.data.waypoints,
                        firstLat:action.data.firstLat,
                        firstLng:action.data.firstLng,
                        lastLat:action.data.lastLat,
                        lastLng:action.data.lastLng,
                        cost:action.data.cost,
                        unformattedcost:action.data.unformattedcost,
                        lasttrip:action.data.lasttrip,
                        alltrips:action.data.alltrips,
                        getAddress:action.data.getAddress,
                        startAddress:action.data.startAddress,
                        stopAddress:action.data.stopAddress,
                        startHour:action.data.startHour,
                        startMin:action.data.startMin,
                        startSec:action.data.startSec,
                        endHour:action.data.endHour,
                        endMin:action.data.endMin,
                        endSec:action.data.endSec,
                        travelTime:action.data.travelTime,
                        isFetching:action.data.isFetching,
                        device_token:'',
                        isEnded:action.data.isEnded,
                        showDialog: false,
                        showDialogforExit:false,
                        driver_mode:'Online',
                        isFirstTrip:action.data.isFirstTrip,
                        isSavingAvailability:false,
                        routeCoordinates:action.data.routeCoordinates,
                        appState:'',
                        coordinate: action.data.coordinate,
                        startwaitingTime:action.data.endTime,
                        endwaitingTime:action.data.startTime,
                        waitingTime:action.data.waitingTime,
                        totalwaitingcost:action.data.totalwaitingcost

        });
        case 'UPDATECLEARSTATE':
                return Object.assign({}, state, {
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
                        isrequesting:false,
                        isSavingAvailability:false,
                        routeCoordinates:[],
                        decline:false,
                        mode_num:0,
                        reasonfordecline:'',
                        getlocationmodal:false,
                        locationFromGoogle:[],
                        gettingInputLocation:false,
                        tripSavingStatus:false,
                        firstLocationTime:'',
                        isEndingTrip:false,
                        coordinate: new AnimatedRegion({
                        latitude: 23,
                        longitude: 90,
                        latitudeDelta:LATITUDE_DELTA,
                        longitudeDelta:LONGITUDE_DELTA
                    })

        }); 
        case 'RESETTRIP':
                return Object.assign({}, state, {
                    isFirstTrip:true
        }); 
    }
    return state;
};
export default TripReducer;