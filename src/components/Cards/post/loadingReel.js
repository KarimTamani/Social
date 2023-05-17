import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function LoadingReel({ }) {


    return (
        <View style={styles.container}>
                <ActivityIndicator size={58} color={"#ffffff88"}/>

            <LinearGradient
                colors={["#00000000", "#000000"]}
                locations={[0, 0.8]}
                style={styles.reelInfo}

            >

            </LinearGradient>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative" , 
        alignItems : "center" , 
        justifyContent : "center"
    },
    reelInfo: {
        position: "absolute",
        minWidth: "100%",

        zIndex: 999,
        bottom: 0,
        right: 0,


        padding: 16,
        alignItems: "flex-start",
        height: "25%"

    },
})