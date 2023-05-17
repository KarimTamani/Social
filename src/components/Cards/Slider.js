
import { useContext, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from "react-native-reanimated";
import darkTheme from "../../design-system/darkTheme";
import ThemeContext from "../../providers/ThemeContext";

const HEIGHT = Dimensions.get("screen").height;

export default function Slider({ children, percentage = 0.2, onClose }) {

    const height = HEIGHT - percentage * HEIGHT;
    const context = useSharedValue(0);
    const translateY = useSharedValue(height);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    useEffect(() => {
        
        //translateY.value = height
        translateY.value = withTiming(0, {
            duration: 500
        })

    }, [])



    const gesture = Gesture.Pan()
        .activeOffsetY( [-200 , 50] )
        
        .onStart((event) => {
            context.value = translateY.value
        })
        .onUpdate((event) => {
            
            
            translateY.value = context.value + event.translationY;
            if (translateY.value < 0)
                translateY.value = 0;
        })
        .onEnd((event) => {
            if (translateY.value > 0.1 * height) {
                translateY.value = withTiming(height, {
                    duration: 500
                }, () => {
                    
                    runOnJS(onClose)()
                });

            } else
                translateY.value = withTiming(0);

        });


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: translateY.value
                }
            ]
        }
    })

    return (
        <GestureHandlerRootView style={StyleSheet.absoluteFill}  >
            <View style={styles.container}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.contentContainer, { height: height }, animatedStyle]}>
                        <View style={styles.line}></View>
                        {children}

                    </Animated.View>
                </GestureDetector>
            </View>
        </GestureHandlerRootView>

    )
};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.5)",

    },
    contentContainer: {
        backgroundColor: "white",
        position: "absolute",
        width: "100%",
        bottom: 0,
        borderTopRightRadius: 16,

        borderTopLeftRadius: 16,
    },
    line: {
        backgroundColor: "#aaa",
        height: 6,
        width: 48,
        alignSelf: "center",
        marginVertical: 12,
        borderRadius: 20
    }
}) ; 
const darkStyles = { 
    ...lightStyles , 
    contentContainer: {
        backgroundColor : darkTheme.backgroudColor , 
        position: "absolute",
        width: "100%",
        bottom: 0,
        borderTopRightRadius: 16,

        borderTopLeftRadius: 16,
    },
    
}