import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Video } from 'expo-av';


export default function VideoPlayer({ route }) {

    const { uri } = route.params ; 

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"transparent"} barStyle='light-content' />
            {
                uri && 
                <Video
                    style={styles.videoContainer}
                    resizeMode="cover"
                    isLooping
                    source={{ uri: uri }}
                    shouldPlay
                    onLoad={() => {
                        console.log("video loaded")
                    }}
                    useNativeControls={true}
                />
            }
        </View>
    )
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333"
    },
    videoContainer: {
        height: "100%",
        width: "100%",
        //    borderRadius : 8 

    }
})