import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useMemo, useState } from "react";
import { useEvent } from "./EventProvider";
import * as Updates from 'expo-updates';

const AuthContext = createContext();

export const AuthProvider = ({ children, onAuthChange }) => {

    const [checkingAuth, setCheckingAuth] = useState(true);
    const event = useEvent() ; 


    const authContext = useMemo(() => ({

        logIn: async (cridentials) => {
            await AsyncStorage.setItem("user", JSON.stringify(cridentials));
            onAuthChange && onAuthChange(cridentials) ; 
            event.emit("auth-changed") ; 
        },
        logOut: async () => {
            await AsyncStorage.removeItem("user");
            onAuthChange && onAuthChange(null);
            await Updates.reloadAsync(); 
        },
        getUserAuth: async () => {
            const userAuth = await AsyncStorage.getItem("user");

            if (userAuth)
                return JSON.parse(userAuth);
            else
                return null;

        },
        updateUser: async (user) => {
            try {
                const userAuth = JSON.parse(await AsyncStorage.getItem("user"));
                (userAuth).user = user;

                await AsyncStorage.setItem("user", JSON.stringify(userAuth));
 
            } catch (error) {
                console.log(error);

            }
        },

        updateToken : async(token) => { 
            try {
                const userAuth = JSON.parse(await AsyncStorage.getItem("user"));
                (userAuth).token = token;

                await AsyncStorage.setItem("user", JSON.stringify(userAuth));
 
            } catch (error) {
                console.log(error);

            } 
        }
    }), [])



    useEffect(() => {
        
        (async () => {
            const userAuth = await AsyncStorage.getItem("user");
            if (userAuth)
                onAuthChange && onAuthChange(JSON.parse(userAuth));
            else
                onAuthChange && onAuthChange(null);
            setCheckingAuth(false)
        })()
    }, [])

    if (checkingAuth)
        return;

    return (

        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    )

}

export {
    AuthContext
}