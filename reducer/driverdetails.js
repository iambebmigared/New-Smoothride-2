const initial_state = {
    role:'',
    driver_data:false,
    trip_id:'',
    driver_name:'',
    company_name:'',
    driver_image:'',
    driver_email:'',
    driver_phone:'',
    price_config:{},
    driver_currTripState:'',
    trip_submit_status:false
    
};

const DriverReducer = (state = initial_state, action) => {
    switch(action.type){       
        case 'DRIVERDETAILS':
                return Object.assign({}, state, {
                    driver_data:true,
                    trip_id:action.data.driverdetails.id,
                    company_name:action.data.driverdetails.company,
                    driver_name:action.data.driverdetails.name,
                    driver_phone:action.data.driverdetails.phone,
                    driver_email:action.data.driverdetails.email,
                    driver_image:action.data.driverdetails.profileUrl,
                    driver_currTripState:action.data.driverdetails.currTripState,
                    price_config:action.data.config
                }); 
        case 'CLEARDRIVER':
                    return Object.assign({}, state, {
                        driver_data:false,
                        trip_id:'',
                        company_name:'',
                        driver_name:'',
                        driver_phone:'',
                        driver_email:'',
                        driver_image:'',
                        price_config:''
        });                      
    }
    return state;
};
export default DriverReducer;