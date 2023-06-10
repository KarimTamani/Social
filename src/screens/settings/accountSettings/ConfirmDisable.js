import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";
import { Ionicons } from '@expo/vector-icons';
import PrimaryInput from "../../../components/Inputs/PrimaryInput";
import { useContext, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function ConfirmDisable({ route, navigation }) {
    
    const { remove } = route.params;
    const [showPassword, setShowPassword] = useState(false);


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


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
                <PrimaryButton
                    title={!remove ? "تعطيل الحساب" : "حذف الحساب بشكل نهائي"}
                    style={styles.button}
                />
            </View>

        </View>
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
        marginTop: 56
    }
})


const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,
        

    },
    text: {
        color :  darkTheme.secondaryTextColor , 
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },
}