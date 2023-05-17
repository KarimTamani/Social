import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import ThemeContext from "../providers/ThemeContext";
export default function Search({ navigation }) {

    const [filter, setFilter] = useState("people");



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    return (
        <View style={styles.container}>

            <View style={styles.filter}>
                <TouchableOpacity style={styles.tab} onPress={() => setFilter("people") }>
                    <Text style={[styles.tabText, filter == "people" && styles.activeText]}>
                        أشخاص

                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.tab} onPress={() => setFilter("posts")}>
                    <Text style={[styles.tabText, filter == "posts" && styles.activeText]}>
                        مشاركات

                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.tab} onPress={() => setFilter("images")}>
                    <Text style={[styles.tabText, filter == "images" && styles.activeText]}>
                        الصور
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.tab} onPress={() => setFilter("videos")}>
                    <Text style={[styles.tabText, filter == "videos" && styles.activeText]}>
                        فيديو
                    </Text>
                </TouchableOpacity>


            </View>

        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,

    },
    filter: {
        flexDirection: "row-reverse"
    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: "#666",
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
    activeText: {
        color: "#1A6ED8",
        borderBottomColor: "#1A6ED8",
        borderBottomWidth: 4,
        fontWeight: "bold"

    }
}) 

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor  : darkTheme.secondaryBackgroundColor 

    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: darkTheme.secondaryTextColor,
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
}