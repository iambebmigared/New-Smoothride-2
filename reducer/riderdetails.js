const initial_state = {
    role:'',
    rider_data:false,
    trip_id:'',
    rider_id:'',
    rider_name:'',
    company_name:'',
    rider_image:'',
    rider_email:'',
    rider_phone:'',
    price_config:{},
    trip_submit_status:false,
    startAddress:'',
    endAddress:'',
    isFirstTrip:true,
    accept:false
    
};

const RiderReducer = (state = initial_state, action) => {
    switch(action.type){       
        case 'RIDERDETAIL':
                return Object.assign({}, state, {
                    rider_data:true,
                    trip_id:action.data.data.id,
                    rider_id:action.data.data.staffId,
                    company_name:action.data.data.company,
                    rider_name:action.data.data.name,
                    rider_phone:action.data.data.phone,
                    rider_email:action.data.data.email,
                    rider_image:action.data.data.profileUrl,
                    price_config:action.data.config
        });
        case 'ACCEPTTRIP':
                return Object.assign({}, state, {
                    accept:action.data
        });
        case 'SAVEDRIDERDATA':
                return Object.assign({}, state, {
                    rider_data:true,
                    trip_id:action.data.trip_id,
                    rider_id:action.data.rider_id,
                    company_name:action.data.company_name,
                    rider_name:action.data.rider_name,
                    rider_phone:action.data.rider_phone,
                    rider_email:action.data.rider_email,
                    rider_image:action.data.rider_image,
                    price_config:action.data.price_config,
                    accept:action.data.accept
        });
        case 'RIDERDETAIL2':
                return Object.assign({}, state, {
                    rider_data:true,
                    rider_id:action.data.data.user.id,
                    company_name:action.data.data.user.company,
                    rider_name:action.data.data.user.name,
                    rider_phone:action.data.data.user.phone,
                    rider_email:action.data.data.user.email,
                    rider_image:action.data.data.user.profileUrl,
                    price_config:action.data.data.config
        });
        case 'CLEARRIDER':
                return Object.assign({}, state, {
                        rider_data:false,
                        trip_id:'',
                        rider_id:'',
                        company_name:'',
                        rider_name:'',
                        rider_phone:'',
                        rider_email:'',
                        rider_image:'',
                        price_config:'',
                        accept:false
        });        
        case 'TRIPDETAILS':
                return Object.assign({}, state,{
                    trip_submit_status : action.data.success
                });
        case 'STARTADDRESS':
                        return Object.assign({}, state,{
                            startAddress : action.data
                        });
        case 'ENDADDRESS':
                                return Object.assign({}, state,{
                                    endAddress : action.data
                                });                                        
    }
    return state;
};
export default RiderReducer;