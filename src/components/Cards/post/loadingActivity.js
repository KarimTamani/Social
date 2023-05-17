import { View, Text, ActivityIndicator, StyleSheet } from "react-native";


export default function LoadingActivity({style , color , size}) {

    if (!color) 
        color = "#FE0000" ; 

    if ( ! size) 
        size = 26 ; 
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})