import { View, Text, StyleSheet, TouchableOpacity , Linking} from "react-native";
import { FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function SocialMedia({ socialMedia }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const openLink = useCallback((link) => {
        Linking.openURL(link) ; 
    } , [socialMedia])
    return (
        <View style={styles.container}>
            {
                socialMedia && socialMedia.facebook &&
                <TouchableOpacity style={styles.button} onPress={() => openLink(socialMedia.facebook)} >
                    <Entypo name="facebook-with-circle" style={[styles.icon, { color: "#4267B2" }]} />
                </TouchableOpacity>
            }
            {

                socialMedia && socialMedia.twitter &&

                <TouchableOpacity style={styles.button} onPress={() => openLink(socialMedia.twitter)} >
                    <FontAwesome5 name="twitter" style={[styles.icon, { color: "#00f2ea" }]} />
                </TouchableOpacity>
            }

            {
                socialMedia && socialMedia.snapshot &&
                <TouchableOpacity style={styles.button} onPress={() => openLink(socialMedia.snapshot)} >
                    <FontAwesome name="snapchat-ghost" style={[styles.icon, { color: "#FFFC00" }]} />
                </TouchableOpacity>
            }
            {
                socialMedia && socialMedia.instagram &&

                <TouchableOpacity style={styles.button} onPress={() => openLink(socialMedia.instagram)} >
                    <Entypo name="instagram" style={[styles.icon, { color: "#C13584" }]} />
                </TouchableOpacity>
            }
        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {

        width: 48,
        backgroundColor: "white",
        elevation: 26,
        borderRadius: 26
    },

    icon: {
        fontSize: 24,
    },
    button: {
        width: "100%",

        height: 48,
        alignItems: "center",
        justifyContent: "center",

    }
})

const darkStyles = {
    ...lightStyles,
    container: {

        width: 48,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        elevation: 26,
        borderRadius: 26
    },
}