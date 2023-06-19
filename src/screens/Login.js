import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import { textFonts } from "../design-system/font";
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useContext, useState } from "react";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { Formik } from "formik";
import * as yup from "yup";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { errorStyle } from "../design-system/errorStyle";
import { AuthContext } from "../providers/AuthContext";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

const loginSchema = yup.object({
    identifier: yup.string()
        .required("البريد الإلكتروني / رقم الهاتف مطلوب")
        .test("identifier-not-valid", "البريد الإلكتروني / رقم الهاتف غير صالح", (identifier) => {


            if (identifier)
                return ((identifier.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) && identifier.length >= 8) || identifier.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));

        }),
    password: yup.string().required("كلمة المرور مطلوبة").min(6, "الحد الأدنى 6 أحرف").max(255, "255 حرفًا كحد أقصى")
});


export default function Login({ navigation }) {

    var values = {
        identifier: "",
        password: "",
    }

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    const [error, setError] = useState(null);


    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    const forgetPassword = useCallback(() => {
        console.log("forget password")
    }, []);




    const goSignup = useCallback(() => {
        navigation.navigate("Signup");
    }, []);


    const login = useCallback((values) => {
        setLoading(true);
        setError(null);

        client.query({
            query: gql`     
            query Login($identifier: String!, $password: String!) {
                Login(identifier: $identifier, password: $password) {
                  user {
                    id
                    name 
                    lastname 
                    username
                    validated
                    disabled
                    profilePicture { 
                        id path 
                    }
                    updatedAt 
                  }
                  token 
                }
              }
            ` ,
            variables: values
        }).then(async response => {

         
            if (response && response.data) {
                if (!response.data.Login.user.disabled) {
                    await auth.logIn(response.data.Login);
                    setLoading(false);
                    navigation.navigate("HomeNavigation");
                }
                else {
                     
                    setLoading( false ) ;
                    
                    navigation.navigate("ActivateAccount" , {
                        login : response.data.Login 
                    });
                }
            }else{
                setLoading(false);

                setError("لا يمكن تسجيل الدخول ، يرجى التحقق من البريد الإلكتروني / رقم الهاتف وكلمة المرور")
                    
            }
        }).catch(error => {
            console.log ( error ) ; 
            setLoading(false);

            setError("لا يمكن تسجيل الدخول ، يرجى التحقق من البريد الإلكتروني / رقم الهاتف وكلمة المرور")
        })

    }, []);


    return (
        <View style={styles.container}>

            <ScrollView>
                <View style={styles.content}>

                    <Text style={styles.loginMessage}>
                        من أجل المشاركة وإضافة الأصدقاء الرجاء تسجيل الدخول
                    </Text>

                    <Text style={styles.title}>
                        تسجيل الدخول
                    </Text>
                    <Formik
                        initialValues={values}
                        onSubmit={login}
                        validationSchema={loginSchema}
                    >
                        {
                            ({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (

                                <View>
                                    <PrimaryInput
                                        placeholder={"البريد الإلكتروني أو رقم الهاتف"}
                                        style={styles.input}
                                        value={values.identifier}
                                        onChange={handleChange("identifier")}
                                        onBlur={handleBlur("identifier")}
                                        error={touched.identifier && errors.identifier}
                                    />
                                    <Text style={errorStyle.error}> {touched.identifier && errors.identifier}</Text>

                                    <PrimaryInput
                                        placeholder={"كلمة المرور"}
                                        style={styles.input}
                                        secure={!showPassword}

                                        value={values.password}
                                        onChange={handleChange("password")}
                                        onBlur={handleBlur("password")}

                                        error={touched.password && errors.password}
                                        leftContent={
                                            <TouchableOpacity style={styles.showButton} onPress={togglePasswordVisibility}>
                                                {
                                                    !showPassword && <Ionicons name="eye-off" size={24} color="#666" />
                                                }
                                                {
                                                    showPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />
                                                }
                                            </TouchableOpacity>
                                        }
                                    />

                                    <Text style={errorStyle.error}> {touched.password && errors.password}</Text>

                                    <Text onPress={forgetPassword} style={styles.fogetPassword}>
                                        هل نسيت كلمة المرور الخاصة بك ؟

                                    </Text>


                                    <PrimaryButton
                                        title={"تسجيل الدخول"}
                                        style={styles.button}
                                        disabled={!isValid}
                                        onPress={handleSubmit}
                                        loading={loading}
                                    />
                                    {
                                        error &&
                                        <Text style={errorStyle.errorMessage}>
                                            {error}
                                        </Text>
                                    }

                                </View>

                            )

                        }

                    </Formik>
                    <Text style={styles.or}>_____   أو   _____</Text>

                    <View style={styles.socialMedia}>

                        <TouchableOpacity style={styles.socialButton}>
                            <Image source={require("../assets/icons/google.png")} style={styles.socialIcon} />

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton}>
                            <Image source={require("../assets/icons/facebook.png")} style={styles.socialIcon} />

                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>
                        ليس لديك حساب ؟ <Text style={styles.redClickable} onPress={goSignup}>
                            انشاء حساب جديد
                        </Text>
                    </Text>


                    <Text style={[styles.text, styles.footerText]}>
                        للمتابعة فانك توافق على شروط الخدمة الخاصة بنا وتقر بانك قرات <Text style={styles.blueClickable}>
                            سياسة الخصوصية
                        </Text> الخاصة بنا لتتعلم كيف تجمع بياناتك وتستخدمها وتشاركها
                    </Text>
                </View>

            </ScrollView>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    loginMessage: {
        fontFamily: textFonts.regular,
        color: "red",
        textAlign: "center",
        alignSelf: "center",
        width: "80%",
        marginBottom: 16
    },
    content: {
        padding: 16,
        paddingTop: 72,
    },
    title: {
        color: "#212121",
        fontFamily: textFonts.bold,
    },
    input: {
        marginVertical: 16,
        borderRadius: 4,
        height: 52,

    },
    showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: "#ddd",
        borderRightWidth: 1
    },
    inputStyle: {
        textAlign: "right"
    },
    fogetPassword: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular,
        fontSize: 12
    },
    button: {
        marginVertical: 16
    },
    or: {
        fontFamily: textFonts.regular,
        fontSize: 18,
        color: "#666",
        textAlign: "center"
    },
    socialMedia: {

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8
    },
    socialButton: {
        marginHorizontal: 16

    },
    text: {
        color: "#212121",
        textAlign: "center",
        fontFamily: textFonts.regular,
        marginVertical: 16
    },
    redClickable: {
        color: "#ff0000",
        fontFamily: textFonts.medium
    },
    footerText: {
        color: "#666",
        textAlign: "right",
        lineHeight: 24,
        fontSize: 12
    },
    blueClickable: {
        color: "#1A6ED8"
    },

});
const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        color: darkTheme.textColor,
        fontFamily: textFonts.bold,
    },
    showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: darkTheme.borderColor,
        borderRightWidth: 1
    },
    footerText: {
        color: darkTheme.secondaryTextColor,
        textAlign: "right",
        lineHeight: 24,
        fontSize: 12
    },
    text: {
        color: darkTheme.textColor,
        textAlign: "center",
        fontFamily: textFonts.regular,
        marginVertical: 16
    },
    or: {
        fontFamily: textFonts.regular,
        fontSize: 18,
        color: darkTheme.textColor,
        textAlign: "center"
    },
}