import {createSlice} from '@reduxjs/toolkit'

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    if (cookieValue) {
        const decodedValue = decodeURIComponent(cookieValue.pop());
        // Remove 'j:' prefix from the decoded value
        const cleanedValue = decodedValue.replace(/^j:/, '');
        // console.log(cleanedValue)
        return cleanedValue;
    }
    return '';
}


const initialState = {
    signupData: null,
    loading: false,
    token: (localStorage.getItem('token') || document.cookie.includes('token')) ? JSON.parse(localStorage.getItem('token')) || getCookie('token') : null, 
    buttonDisabled: false,
    resendTime: 60
};

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setToken (state, value) {
            state.token = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setButtonDisabled(state, value) {
            state.buttonDisabled = value.payload;
        },
        setResendTime(state, value) {
            state.resendTime = value.payload;
        },
        decrementResendTime(state){
            state.resendTime -=1;
        }
    }
});

export const {setToken, setLoading, setSignupData, setButtonDisabled, setResendTime, decrementResendTime} = authSlice.actions;
export default authSlice.reducer;