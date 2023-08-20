import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Cards/Header";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { useCallback, useContext, useEffect, useState } from "react";
import { errorStyle } from "../design-system/errorStyle";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

export default function SubmitEmail({ navigation }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const [email, setEmail] = useState();
    const [validEmail, setValidEmail] = useState(true);
    const [isLoading , setIsLoading] = useState(false) ; 


    const client = useContext(ApolloContext) ; 
 

    const confirmEmail = useCallback(() => {
        setValidEmail(true);
     
        
        const valid = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if (!valid) {
            setValidEmail(false)
            return;
        }
        setIsLoading(true) ; 

        client.query({
            query : gql`
            
            query Query($email: String!) {
                checkEmailExists(email: $email)
            }
            ` , 
            variables : { 
                email : email 
            }
        }).then(response => { 
            if (response && response.data) { 
                const exists = response.data.checkEmailExists ; 

                setValidEmail(exists) ; 
                if (exists) {
                    navigation.navigate("SendEmailConfirmation" , { 
                        email : email , 
                        forgetPassword : true   
                    })
                } 

            }
            else 
                setValidEmail(false) ; 
            setIsLoading(false) ; 
        }).catch(error => {
            setValidEmail(false) ; 
            setIsLoading(false) ; 
        })
        

    }, [email]);


    return (
        <View style={styles.container}>
            <Header
                title={""}
                navigation={navigation}
            />

            <View style={styles.content}>

                <Text style={styles.text}>
                    قم بإدخال البريد الإلكتروني المربوط بحسابك لتغير كلمة السر
                </Text>
                <PrimaryInput
                    style={styles.emailInput}
                    placeholder={"البريد الإلكتروني"}
                    onChange={setEmail}
                    value={email}
                    error={!validEmail}

                />
                {
                    !validEmail &&

                    <Text style={[errorStyle.error , styles.errorText]}> 
                        البريد الإلكتروني غير صحيح
                    </Text>

                }
                <PrimaryButton
                    title={"تأكيد"}
                    style={styles.confirmationButton}
                    loading = { isLoading }
                    onPress={confirmEmail}
                />

            </View>
        </View>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"

    },
    content: {
        alignItems: "center",

        paddingHorizontal: 16,
    },
    bold: {
        fontWeight: "bold",
        color: "#212121"
    },
    text: {
        fontSize: 13,
        color: "#555",
        textAlign: "center",
        lineHeight: 24
    },
    emailInput: {
        height: 56,
        marginTop: 36
    },
    confirmationButton: {
        width: "100%",
        marginVertical: 36,

    },
    errorText : { 
        marginTop : 8 , 
        textAlign : "right" , 
        width : "100%"
    }
}); 

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    bold: {
        fontWeight: "bold",
        color: darkTheme.textColor
    },
    text: {
        fontSize: 13,
        color: darkTheme.textColor,
        textAlign: "center",
        lineHeight: 24
    },
}