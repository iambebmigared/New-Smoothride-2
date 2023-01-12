import { createStore, applyMiddleware,combineReducers } from 'redux';
import DataReducer from '../reducer/reducer';
import RiderReducer from '../reducer/riderdetails';
import DriverReducer from '../reducer/driverdetails';
import thunk from 'redux-thunk';


const reducer = combineReducers({
    DataReducer:DataReducer,
    RiderReducer:RiderReducer,
    DriverReducer:DriverReducer

});
const store = createStore(reducer, applyMiddleware(thunk));

export default store;