import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";
import { Ionicons } from '@expo/vector-icons';
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import { useCallback, useContext, useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { errorStyle } from "../../../design-system/errorStyle";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { AuthContext } from "../../../providers/AuthContext";


const NOT_VALID_PASSWORD_ERROR = "يرجى التحقق من كلمة المرور الخاصة بك";

export default function ConfirmDisable({ route, navigation }) {

    const { remove } = route.params;
    var removeRequest  = route.params?.removeRequest ; 
    
    
    const [showPassword, setShowPassword] = useState(false);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const client = useContext(ApolloContext) ; 
    const auth = useContext(AuthContext) ; 

    useEffect(() => {
        setError(null);
        setLoading(false);
    }, []) ; 


    const logout = () => { 
        client.mutate({
            mutation: gql`
            mutation Mutation {
                logOut {
                  id 
                }
            }`
        }).then(async response => {

            if (response.data) {
                await auth.logOut();
                navigation.navigate("HomeNavigation", { screen: "Home" })
            }
        })

    }

    const disable_account = () => {
        client.mutate({
            mutation : gql`
            mutation DisableAccount($password: String!) {
                disableAccount(password: $password) {
                id  
                disabled
                }
            }
            
            ` , 
            variables :{
                password  : password 
            }
        }).then(response => { 
    
            setLoading(false)
            if (response && response.data?.disableAccount && response.data?.disableAccount?.disabled) { 
              
                setLoading(true) ; 
                logout() ; 
            }else {
                setError(NOT_VALID_PASSWORD_ERROR ) ; 
                 
            }

        }).catch((err) => {

            setLoading( false )  ; 
            setError(NOT_VALID_PASSWORD_ERROR ) ; 
        }) 
        
    };

    const remove_account = () => {
        client.mutate({
            mutation : gql`
            mutation Mutation($removeRequest: RemoveRequestInput!, $password: String!) {
                removeAccount(removeRequest: $removeRequest, password: $password) {
                    id 
                }
              }` , 
            variables :{
                password  : password , 
                removeRequest
            }
        }).then(response => { 
         
            setLoading(false)
            if (response && response.data?.removeAccount && response.data?.removeAccount) {  
                setLoading(true) ; 
                logout() ; 
            }else {
                setError(NOT_VALID_PASSWORD_ERROR ) ;                  
            }
      
        }).catch((err) => {

            
            setLoading( false )  ; 
            setError(NOT_VALID_PASSWORD_ERROR ) ; 
        })
        
    }





    const apply = useCallback(() => {
        setLoading(true);
        setError(null) ;

        if (remove) {
            remove_account();
        } else {
            disable_account();
        }
    }, [password, remove]);


    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <View style={styles.content}>

                <Text style={styles.title}>
                    أدخل كلمة المرور

                </Text>
                <Text style={styles.text}>
                    للمتابعة أدخل كلمة المرور للتأكد من ان الحساب لك

                </Text>
                <PrimaryInput
                    placeholder={"كلمة المرور"}
                    style={styles.input}

                    inputStyle={styles.inputStyle}
                    secure={!showPassword}
                    onChange={setPassword}
                    error={error}

                    leftContent={
                        <TouchableOpacity style={styles.showButton} onPress={() => setShowPassword(!showPassword)}>
                            {
                                !showPassword && <Ionicons name="eye-off" size={24} color="#666" />
                            }
                            {
                                showPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />
                            }
                        </TouchableOpacity>
                    }
                />
                {
                    error &&
                    < Text style={errorStyle.errorMessage}>
                        {error}
                    </Text>
                }
                <PrimaryButton
                    title={!remove ? "تعطيل الحساب" : "حذف الحساب بشكل نهائي"}
                    style={styles.button}
                    disabled={!password || password.length == 0}
                    onPress={apply}
                    loading={loading}
                />

            </View>

        </View >
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontFamily: textFonts.bold,
        color: "#212121",
        fontSize: 16,


    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    },
    content: {
        padding: 16
    },
    input: {
        marginVertical: 16,
        borderRadius: 4,
        height: 52,
        marginTop: 32

    },
    showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: "#ddd",
        borderRightWidth: 1
    },
    button: {
        marginTop: 56,
        marginBottom: 16

    }
})


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,


    },
    text: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
}