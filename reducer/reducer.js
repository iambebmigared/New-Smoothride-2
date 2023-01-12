const initial_state = {
    role:'',
    user_id:'',
    user_name:'',
    company_name:'',
    profile_image:'',
    user_email:'',
    user_id:'',
    user_phone:'',
    expiration_date:'',
    paymentType:'',
    isFetching:false,
    isLoggin:false,
    isError:false,
    access_token:'',
    expiration_date:'',
    profileImg:'',
    tripdistance:''
};

const DataReducer = (state = initial_state, action) => {
    switch(action.type){
        case 'LOGIN':
                return Object.assign({}, state, {
                    isFetching:true 
                });
        case 'RIDEREQUEST':
            return Object.assign({}, state, {
                        isFetching:false

            });
        case 'DISTANCE':
            return Object.assign({}, state, {
                tripdistance:action.data
    
        });                
        case 'USERDATA':
                return Object.assign({}, state, {
                    isFetching:false,
                    isLoggin:true,
                    access_token:action.data.access_token,
                    expiration_date:action.data.expires_at,
                    user_id:action.data.user.id,
                    role:action.data.user.userType,
                    user_name:action.data.user.name,
                    company_name:action.data.user.company,
                    paymentType:action.data.user.plan,
                    user_phone:action.data.user.phone,
                    user_email:action.data.user.email,
                    profileImg:action.data.user.profileUrl
                });
        case 'UPDATE_USER':
                return Object.assign({}, state, {
                    isFetching:false,
                    isLoggin:true,
                    access_token:action.data.access_token,
                    expiration_date:action.data.expiration_date,
                    user_id:action.data.user_id,
                    role:action.data.role,
                    user_name:action.data.user_name,
                    company_name:action.data.company_name,
                    paymentType:action.data.paymentType,
                    user_phone:action.data.user_phone,
                    user_email:action.data.user_email,
                    profileImg:action.data.profileImg
                });       
        case 'ERROR':
                return Object.assign({}, state,{
                    isFetching:false,
                    isLoggin:false,
                    isError:true
                });                
    }
    return state;
};
export default DataReducer;