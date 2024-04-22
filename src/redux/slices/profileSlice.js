import {createSlice} from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    console.log("cookie Value",cookieValue);
    if (cookieValue) {
        const decodedValue = decodeURIComponent(cookieValue.pop());
        // Remove 'j:' prefix from the decoded value
        const cleanedValue = decodedValue.replace(/^j:/, '');
        return cleanedValue;
    }
    return '';
}

function getParsedCookie(name){
    const userCookieValue = getCookie(name);
    if(userCookieValue === ""){return null}
    try {
        const finalCookie = JSON.parse(userCookieValue);
        console.log("user cookie value", finalCookie);
        return finalCookie;
    } catch (error) {
        // console.error('Error parsing JSON:', error);
        toast.error('Error in login')
        return null
    }
}

const initialState = {
    user: (localStorage.getItem("user") || document.cookie.includes('user'))? JSON.parse(localStorage.getItem("user")) || getParsedCookie('user') : null,
    loading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState: initialState,
    reducers: {
        setUser (state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        }
    }
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;
