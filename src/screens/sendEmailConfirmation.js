import { View, Text, StyleSheet } from "react-native";
import Header from "../components/Cards/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import LoadingActivity from "../components/Cards/post/loadingActivity";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { errorStyle } from "../design-system/errorStyle";
import { AuthContext } from "../providers/AuthContext";



export default function SendEmailConfirmation({ route, navigation }) {


    const email = route?.params?.email;
    const forgetPassword = route?.params?.forgetPassword ; 
 

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const [otp, setOtp] = useState();
    const [timer, setTimer] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [sendingEmailError, setSendingEmailError] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const decreaseTimer = (time) => {
        if (time == 0) {
            setTimer(null);
            return;
        } else {
            setTimer(time);
            setTimeout(() => decreaseTimer(time - 1), 1000)
        }
    }

    useEffect(() => {
       
        if (email)
            sendEmail();
  
    }, [email])

    const confirmOtp = useCallback(() => {
        
        setIsLoading(true);
        setOtpError(false);
        client.mutate({
            mutation: gql`
            mutation ConfirmEmail($email: String!, $otpCode: String!) {
                confirmEmail(email: $email, otpCode: $otpCode) {
                    user {
                        profilePicture {
                            id
                            path
                          }
                          id
                          name
                          lastname
                          email
                          pictureId
                          username
                          birthday
                          gender
                          countryId
                          phone
                          isValid
                          state 
                          bio
                          private
                          disabled
                          numFollowers
                          numPosts
                          numFollowing
                          numVisits
                          validated
                          lastActiveAt
                          isActive
                          mute
                          allowMessaging
                          showState
                      }
                      token 
                                     
                }
            }` ,
            variables: {
                email: email,
                otpCode: otp
            }
        }).then(async response => {
            setIsLoading(false);
            
            if (forgetPassword) { 
 
                navigation.navigate( "ForgetPassword" , {
                    otp : otp ,
                    userAuth :   response.data.confirmEmail         
                }) ; 
                return ; 
            }
            if (response && response.data.confirmEmail) {
                await auth.logIn(response.data.confirmEmail);
                navigation.navigate("HomeNavigation");
            } else {
                setOtpError(true);
            }

        }).catch(error => {
            setIsLoading(false);
            setOtpError(true);
        })

    }, [email, otp])

    const sendEmail = useCallback(() => {
        setIsLoading(true);
        setSendingEmailError(false);

        client.mutate({
            mutation: gql`
            mutation ConfirmEmail($email: String!) {
                sendEmailConfirmation(email: $email)
            }` ,
            variables: {
                email
            }
        }).then(response => {
            setIsLoading(false);

            if (response && response.data.sendEmailConfirmation) {
                decreaseTimer(60)
            } else {
                setSendingEmailError(true);
            }
        }).catch(error => {
            setSendingEmailError(true);
        })
    }, [email]);

    return (
        <View style={styles.container}>
            {

                isLoading &&

                <View style={styles.loadingBackground}>
                    <LoadingActivity />
                </View>
            }
            <Header
                navigation={navigation}
                title={!forgetPassword ?  "تأكيد الحساب" : "نسيان كلمة السر"}
            />
            <View style={styles.content}>
                <Text style={styles.text}>
                    لقد قمنا بإرسال كود للإيميل : <Text style={styles.bold}>{email}</Text> قم بنسخة لتغير كلمة السر
                </Text>
                <PrimaryInput
                    style={styles.otpInput}
                    placeholder={"كود التفعيل"}
                    onChange={setOtp}

                    value={otp}
                    maxLength={4}
                    numeric={true}
                />
                <PrimaryButton
                    title={"تأكيد"}
                    style={styles.confirmationButton}
                    disabled={!(otp?.length == 4)}
                    onPress={confirmOtp}
                />

                {
                    otpError &&

                    <Text style={[errorStyle.errorMessage, { marginBottom: 16, width: "100%" }]}>
                        كود التفعيل غير صحيح
                    </Text>
                }
                {
                    sendingEmailError &&

                    <Text style={[errorStyle.errorMessage, { marginBottom: 16 }]}>
                        حصل خطأ في ارسال كود التفعيل ، جرب مرة ثانية من فضلك
                    </Text>

                }



                <Text style={styles.text} >
                    ان لم تستلم كود التفعيل {timer && <Text style={styles.clickableText}>بعد : {timer} </Text>}
                    قم <Text style={[styles.clickableText, timer && styles.disabledText]} onPress={sendEmail} disabled={timer}>
                        بإعادة الإرسال ٠
                    </Text>
                </Text>
            </View>
        </View>
    )

};



const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    loadingBackground: {
        backgroundColor: "rgba(0,0,0,.5)",
        position: "absolute",
        width: "100%", height: "100%",
        zIndex: 99,
        alignItems: "center",
        justifyContent: "center"
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
    otpInput: {
        height: 56,
        marginTop: 36
    },
    confirmationButton: {
        width: "100%",
        marginVertical: 36,

    },
    clickableText: {
        color: "#1A6ED8",
        fontWeight: "bold"
    },
    disabledText: {

        color: "#1A6ED844",

    }
});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,
    },
    text: {
        fontSize: 13,
        color: darkTheme.textColor,
        textAlign: "center",
        lineHeight: 24
    },
    bold: {
        fontWeight: "bold",
        color : darkTheme.textColor 
    },
}