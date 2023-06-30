import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function StoriesViewOrAdd({ onAdd, onView, onClose }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onClose}>

            <View style={styles.options}>
                <TouchableOpacity style={styles.option} onPress={onAdd}>
                    <AntDesign name="pluscircleo" style={styles.optionIcon} />
                    <Text style={styles.optionText}>
                        اضافة قصة جديدة
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={onView}>
                    <Ionicons name="images-outline" style={styles.optionIcon} />
                    <Text style={styles.optionText}>
                        قصصي
                    </Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)",
        padding: 26,
        justifyContent: "flex-end"
    },
    options: {
        backgroundColor: "white",
        borderRadius: 4,
        elevation: 16
    },
    option: {
        flexDirection: "row-reverse",
        padding: 16
    },
    optionIcon: {
        fontSize: 18,
        marginLeft: 8
    }
});


const darkStyles = {
    ...lightStyles,
    options: {
        borderRadius: 4,
        elevation: 16,
        backgroundColor: darkTheme.backgroudColor
    },

    option: {
        flexDirection: "row-reverse",
        padding: 16,
        color: darkTheme.textColor
    },
    optionText : { 
        color: darkTheme.textColor

    } , 
    optionIcon: {
        fontSize: 18,
        marginLeft: 8,
        color: darkTheme.textColor
    }
}