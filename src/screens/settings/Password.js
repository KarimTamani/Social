import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../components/Cards/Header";
import { Ionicons } from '@expo/vector-icons';
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import { errorStyle } from "../../design-system/errorStyle";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { AuthContext } from "../../providers/AuthContext";


export default function Password({ navigation }) {

    const [showPreviousPassword, setShowPreviousPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [newPassword, setNewPassword] = useState();

    const [passwordError, setPasswordError] = useState();
    const [newPasswordError, setNewPasswordError] = useState();
    const [confirmPasswordError, setConfirmPasswordError] = useState();


    const [confirmError, setConfirmError] = useState(false);
    const [error, setError] = useState(true);
    const [loading , setLoading] = useState( false ) ; 

    const client = useContext(ApolloContext) ; 
    const auth = useContext(AuthContext)

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    useEffect(() => {
        setError(false);
        if (!password)
            return;
        setPasswordError(password.trim().length < 6 || password.trim().length > 56 || password.includes(" "))
    }, [password]);


    useEffect(() => {
        setError(false);
        if (!newPassword)
            return;
        setNewPasswordError(newPassword.trim().length < 6 || newPassword.trim().length > 56 || newPassword.includes(" "))
    }, [newPassword]);

    useEffect(() => {
        setError(false);
        if (!confirmPassword)
            return;
        setConfirmPasswordError(confirmPassword.trim().length < 6 || confirmPassword.trim().length > 56 || confirmPassword.includes(" "))
    }, [confirmPassword]);



    useEffect(() => {
        setConfirmError(newPassword != confirmPassword);
    }, [newPassword, confirmPassword])



    const changePassword = useCallback(() => {
        setError(false) ; 
        setLoading(true) ;

        client.mutate({
            mutation : gql`
            mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
                changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
            }` , 
            variables : { 
                oldPassword : password , 
                newPassword : newPassword 
            }
        }).then(async response => { 
            console.log (response) ; 
            if (response) { 
                var token = response.data.changePassword ; 
                await auth.updateToken(token)
                navigation.navigate("MyProfile")
            }else {
                setError(true)
            }
            setLoading(false) ; 

        }).catch(error => {

            setLoading(false) ; 
            setError(true) ; 
        })

    }, [password, newPassword ])
    return (
        <View style={styles.container}>
            <Header
                title={"كلمة المرور"}
                navigation={navigation}
            />
            <View style={styles.form}>

                <PrimaryInput
                    placeholder={"كلمة المرور الحالية"}
                    style={styles.input}
                    secure={!showPreviousPassword}
                    onChange={setPassword}
                    value={password}
                    error={passwordError}
                    leftContent={
                        <TouchableOpacity style={styles.showButton} onPress={() => setShowPreviousPassword(!showPreviousPassword)}>
                            {
                                !showPreviousPassword && <Ionicons name="eye-off" size={24} color="#666" />

                            }
                            {
                                showPreviousPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />

                            }
                        </TouchableOpacity>
                    }
                />
                {
                    passwordError &&
                    <Text style={[errorStyle.error, styles.error]}> كلمة السر تكون بين 6 - 56 وخالية من الفراغات </Text>
                }

                <PrimaryInput

                    placeholder={"كلمة المرور الجديدة"}
                    style={styles.input}
                    secure={!showPassword}
                    onChange={setNewPassword}
                    value={newPassword}
                    error={newPasswordError}
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
                    newPasswordError &&
                    <Text style={[errorStyle.error, styles.error]}> كلمة السر تكون بين 6 - 56 وخالية من الفراغات </Text>
                }

                <PrimaryInput
                    placeholder={"تأكيد كلمة المرور"}
                    style={styles.input}
                    secure={!showConfirmPassword}
                    onChange={setConfirmPassword}
                    value={confirmPassword}
                    error={confirmPasswordError || confirmError}
                    leftContent={
                        <TouchableOpacity style={styles.showButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {
                                !showConfirmPassword && <Ionicons name="eye-off" size={24} color="#666" />

                            }
                            {
                                showConfirmPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />

                            }
                        </TouchableOpacity>
                    }
                />
                {
                    confirmPasswordError &&
                    <Text style={[errorStyle.error, styles.error]}> كلمة السر تكون بين 6 - 56 وخالية من الفراغات </Text>
                }
                {
                    confirmError &&
                    <Text style={[errorStyle.error, styles.error]}> كلمة السر غير متطابقة </Text>


                }
                <PrimaryButton
                    title={"حفظ"}
                    style={styles.sendButton}
                    disabled={!password || !newPassword || !confirmPassword || passwordError || newPasswordError || confirmPasswordError || confirmError}
                    onPress={changePassword}
                    loading={loading}
                />


                {
                    error &&
                    <Text style={[errorStyle.errorMessage, { marginVertical: 16 }]}>
                        حدث خطأ من فضلك تأكد من ادخال كلمة سر صحيحة

                    </Text>
                }

            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    form: {
        padding: 16
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

    sendButton: {
        marginVertical: 56
    },
    error: {
        marginBottom: 8
    }
});


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
}