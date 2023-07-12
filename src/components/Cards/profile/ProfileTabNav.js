
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function ProfileTabNav({ navigation, activePage }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileNotes")}>
                <MaterialCommunityIcons name="note-edit-outline" style={[styles.tabIcon, activePage == "ProfileNotes" && styles.activeIcon]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileVideos")}>
                <Foundation name="play-video" style={[styles.tabIcon, activePage == "ProfileVideos" && styles.activeIcon]} />

            </TouchableOpacity>

            <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileImages")}>
                <Ionicons name="images-outline" style={[styles.tabIcon, activePage == "ProfileImages" && styles.activeIcon]} />
            </TouchableOpacity>

            {
                /*
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("WorkAndServices")}>
                    <MaterialIcons name="storefront" style={[styles.tabIcon, activePage == "WorkAndServices" && styles.activeIcon]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("ProfileCourses")}>
    
                    <Ionicons name="ios-eye-off-outline" style={[styles.tabIcon, activePage == "ProfileCourses" && styles.activeIcon]} />
                </TouchableOpacity>
                    */
            }
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#eee",
        marginHorizontal: 16,
        borderRadius: 50,
        marginVertical: 16,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 4
    },
    tabIcon: {
        color: "#333",
        fontSize: 24,
        width: 42,
        height: 42,
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: 38

    },
    activeIcon: {
        color: "#4348D2",

    }
});
const darkStyles = {
    ...lightStyles,
    tabIcon: {
        ...lightStyles.tabIcon,
        color: darkTheme.secondaryTextColor

    },
    container: {
        ...lightStyles.container,
        borderColor: darkTheme.borderColor
    },
}