import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileNotFound({ }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <MaterialIcons name="error-outline" size={24} color="black" style={styles.notFoundIcon} />
            <Text style={styles.title}>
                خطأ في جلب الملف الشخصي
            </Text>
            <Text style={styles.message}>
                هذا الملف الشخصي غير متوفر ، اما تم حذفه من قبل صاحبه ، او تم حظره من قبل حظرتك .
            </Text>
        </View>
    )


};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    notFoundIcon: {
        color: "#1A6ED8",
        fontSize: 48
    },
    title: {
        fontSize: 14,
        color: "#212121",
        fontWeight: "bold",
        marginVertical: 12
    },
    message: {
        textAlign: "center",
        color: "#888888",
        width: "80%"
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        ...lightStyles.container,

        backgroundColor: darkTheme.backgroudColor
    } , 
    title: {
        fontSize: 14,
        color: darkTheme.textColor,
        fontWeight: "bold",
        marginVertical: 12
    },
    message: {
        textAlign: "center",
        color: darkTheme.secondaryTextColor , 
        width: "80%"
    }
}