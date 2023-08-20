import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState , memo } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Audio } from "expo-av"
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";

function RecordPlayer({ uri }) {
 
     
    const [sound, setSound] = useState(null);
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

  

    const [playing, setPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(null);

    const width = useSharedValue(0);

    useEffect(() => {
 
        if (sound)
            sound.setOnPlaybackStatusUpdate((soundStatus) => {

                setCurrentPosition(soundStatus.positionMillis);

                if (soundStatus.didJustFinish) {
           
                    setPlaying(false);
                    setCurrentPosition(0);
                    if (sound) {
                        sound.unloadAsync();
                        setSound(null);
                    }

                }
            });


        return sound
            ? () => {
                
                sound.unloadAsync();
            }
            : undefined;

    }, [sound]);

    useEffect(() => {

        if (duration !== null) 
            width.value = withTiming(currentPosition / duration * 100)
        
        else
            width.value = 0 

    }, [currentPosition])

    const progressStyle = useAnimatedStyle(() => ({
        width: width.value + "%"
    }))

    const togglePlaying = useCallback(() => {

        (async () => {


            if (sound && playing) {

                sound.pauseAsync();
                setPlaying(false);

            } else if (sound && !playing) {


                sound.playAsync();
                setPlaying(true)
            } else {

                const sound = new Audio.Sound();
                await sound.loadAsync({
                    uri
                })
                const status = await sound.getStatusAsync();

              

             
                setPlaying(true)
                setDuration(status.durationMillis)
                setSound(sound);
                sound.playAsync();
            }


        })();


    }, [playing, sound, uri]);

    return (
        <View style={styles.container}>


            <TouchableOpacity onPress={togglePlaying} style={styles.playingButton}>
                {
                    !playing &&
                    <FontAwesome name="play" style={styles.playingIcon} />
                }
                {
                    playing &&
                    <FontAwesome name="pause" style={styles.playingIcon} />
                }
            </TouchableOpacity>
            <View style={styles.waves}>
                { 
                    themeContext.getTheme() == "light"&&
                    <ImageBackground style={styles.background} source={require("../../assets/illustrations/waves.jpeg")}>
                        <Animated.View style={[styles.progress, progressStyle]}>
                        </Animated.View>
                    </ImageBackground> 
                }
                { 
                    themeContext.getTheme() == "dark"&&
                    <ImageBackground style={styles.background} source={require("../../assets/illustrations/darkwaves.png")}>
                        <Animated.View style={[styles.progress, progressStyle]}>
                        </Animated.View>
                    </ImageBackground> 
                
                
                }
            </View>


        </View>

    )
}

export default memo(RecordPlayer) ; 
const lightStyles = StyleSheet.create({
    container: {
        height: 42,
        
        width: "100%",
        flexDirection: "row"

    },
    background: {
        width: "100%",
        height: "100%" ,  
        backgroundColor : "#aaa"
    },
    waves: {
        flex: 1,
        borderRadius: 26,
        overflow: "hidden",

    },
    playingButton: {
        width: 28,
        alignItems: "flex-start",
        justifyContent: "center" , 

    },
    playingIcon: {
        fontSize: 18,
        color: "#555"
    },
    progress: {
        backgroundColor: "rgba(0,0,0,.5)",
        height: "100%",
        width: "25%"
    }
})

const darkStyles = { 
    ...lightStyles , 
    background: {
        width: "100%",
        height: "100%" ,  
        backgroundColor : darkTheme.secondaryBackgroundColor
    },
    progress: {
        backgroundColor: "#1A6ED822",
        height: "100%",
        width: "25%"
    } , 
    playingIcon: {
        fontSize: 18,
        color: darkTheme.textColor 
    },
}