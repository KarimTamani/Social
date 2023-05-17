import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../../components/Cards/Header";
import { Ionicons } from '@expo/vector-icons';
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";


export default function Password({ navigation }) {

    const [showPreviousPassword, setShowPreviousPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    return (
        <View style={styles.container}>
            <Header
                title={"كلمة المرور"}
                navigation = { navigation }
            />
            <View style={styles.form}>

                <PrimaryInput
                    placeholder={"كلمة المرور الحالية"}
                    style={styles.input}
                    secure={!showPreviousPassword}
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

                <PrimaryInput

                    placeholder={"كلمة المرور الجديدة"}
                    style={styles.input}
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
                <PrimaryInput
                    placeholder={"تأكيد كلمة المرور"}
                    style={styles.input}
                    secure={!showConfirmPassword}
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
                <PrimaryButton
                    title={"حفظ"}
                    style={styles.sendButton}
                />
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
    }
}) ; 


const darkStyles = { 
    ...lightStyles  , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
}