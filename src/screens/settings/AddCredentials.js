import { View, Text, StyleSheet } from "react-native";
import Header from "../../components/Cards/Header";
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useContext } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
export default function AddCredentials({ navigation }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    

    return (
        <View style={styles.container}>
            <Header
                title={"إضافة البريد الإلكتروني"}
                navigation = { navigation }
            />
            <View style={styles.form}>
                <PrimaryInput
                    placeholder={"البريد الإلكتروني"}
                    style={styles.input}

                    leftContent={
                        <Entypo name="email" style={styles.icon} />
                    }
                />
                <PrimaryInput
                    placeholder={"رقم الهاتف"}
                    style={styles.input}

                    leftContent={
                        <Feather name="smartphone" style={styles.icon} />

                    }
                />

                <PrimaryButton
                    title = { "إرسال"}
                    style = { styles.sendButton}
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
    input: {
        marginVertical: 16,
        borderRadius: 4,
        height: 52,

    },
    form: {
        padding: 16
    },
    icon: {
        fontSize: 20,
        color: "#666",
        paddingLeft: 16,
    } , 
    sendButton : { 
        marginVertical : 56 
    }
})

const darkStyles = { 
    ...lightStyles  , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
}