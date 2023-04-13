import React, { useCallback, useEffect, useState, createContext } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";


const AUTH_COOKIE = "AUTH_COOKIE";
const AuthCookieContext = createContext(null);
export default AuthCookieContext;

export function AuthCookieProvider({ children }) {
    const [authCookie, setAuthCookie] = useState(null);
    const [token, setToken] = useState(null);
    const [toggle, setToggle] = useState(true);
    const [userID, setUserID] = useState(null);
    useEffect( async() => {
        let isSubscribed = true;
        let user = await AsyncStorage.getItem('token')
        if (!user)
        {
            setToken(null);
        }
        else
        {
        user = JSON.parse(user);
        setToken(user.userName);
        setUserID(user.id);
        console.log("hello")
        }
        return () => (isSubscribed = false)
    }, [toggle]);

    useEffect(() =>{
        const getAuthCookie = async () => {
            const result = await AsyncStorage.getItem(AUTH_COOKIE);
            if (!result) {
                return;
            }
            setAuthCookie(result);
        };
        getAuthCookie();
    }, [setAuthCookie]);

    

    const saveAuthCookie = useCallback(
        async (cookie) => {
            await AsyncStorage.setItem(AUTH_COOKIE, cookie, (error) => {
            });
            setAuthCookie(cookie);
        },
        [setAuthCookie]
    );

    const context = {
        authCookie,
        saveAuthCookie,
        token,
        toggle,
        setToggle,
        userID,
        setToken
    };

    return (
        <AuthCookieContext.Provider value={context}>
            {children}
        </AuthCookieContext.Provider>
    );
}