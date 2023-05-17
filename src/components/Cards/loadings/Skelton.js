import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { Easing, EasingNode } from "react-native-reanimated";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";


const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

export default function Skelton({ width = Dimensions.get("window").width, height = Dimensions.get("window").height, style }) {
    const animatedValue = new Animated.Value(0);

    const theme = useContext(ThemeContext) ; 

    var colors =  ["#eeeeee", "#eeeeee", "#ffff", "#eeeeee", "#eeeeee"]
    if (theme.getTheme() == "dark") { 
        colors = [
            darkTheme.backgroudColor ,
            darkTheme.backgroudColor ,
            darkTheme.secondaryBackgroundColor , 
            darkTheme.backgroudColor ,
            darkTheme.backgroudColor ,
        ]
    }

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {

                toValue: 1,
                duration: 1000,
                easing: EasingNode.in,
                useNativeDriver: true
            })
        ).start();



    }, []);





    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width]
    });

    return (

            <Animated.View
                style={{
                    height: height,
                    width: width,
                    overflow: "hidden",
                    backgroundColor: theme.getTheme() == "light" ? "#eee" : darkTheme.secondaryBackgroundColor,
                    ...style
                }}
            >
                <AnimatedLG

                    colors={colors}

                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}

                    style={{
                        //...StyleSheet.absoluteFill,
                        height: height  ,
                        width: width * 2,
                        transform: [{ translateX: translateX }],
                    }}
                />
            </Animated.View>
 
    )
}
