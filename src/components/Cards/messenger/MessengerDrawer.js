import { useCallback, useContext, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

const WIDTH = Dimensions.get("screen").width;
const CLOSE = - WIDTH * 80 / 100;
const OPEN = 0

/*


*/

export default function MessengerDrawer({ toggleDrawer , navigation }) {


    const themeContext = useContext(ThemeContext) ;
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  
    
    const options = [
        {
            text: "طلبات المراسلة",
            icon: require("../../../assets/icons/icons8-communic.png") , 
            onPress : useCallback(() => { 
                navigation.navigate("MessageRequests") ;
                toggleDrawer() ;  
            } , [ navigation ]) 
        },
        {
            text: "الدردشات المؤرشفة",
            icon: require("../../../assets/icons/closeRectangle.png")
        },
        {
            text: "حالة النشاط",
            icon: require("../../../assets/icons/icons8-toggle-i.png")
        },
        {
            text: "أصوات الاشعارات",

            icon: require("../../../assets/icons/icons8-speaker-.png")
        },
        {
            text: "عدم الازعاج",
            icon: require("../../../assets/icons/icons8-no-audio.png")
        },
        {
            text: "إنشاء مجموعة",
            icon: require("../../../assets/icons/icons8-add-user.png"), 
            onPress : useCallback(() => { 
                navigation.navigate("CreateGroup") ;  
                toggleDrawer() ; 
            } , [ navigation ]) 
        },
        {
            text: "منع الرسائل",
            icon: require("../../../assets/icons/icons8-toggle-i.png")
        },
    ]


    const translateX = useSharedValue(CLOSE);
    const drawerStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: translateX.value
        }]
    }));

    useEffect(() => {
        translateX.value = CLOSE
        translateX.value = withTiming(OPEN, {
            duration: 300
        })
    }, []);

    const closeDrawer = useCallback(() => {
        translateX.value = withTiming(CLOSE, { duration: 300 });
        setTimeout(toggleDrawer, 300)

    })


    return (
        <View style={styles.container} >
            <TouchableOpacity onPress={closeDrawer} activeOpacity={1} style={StyleSheet.absoluteFill}>
            </TouchableOpacity>
            <Animated.View style={[styles.content, drawerStyle]}>
                <View style={styles.options}>
                    {

                        options.map(option => (
                            <TouchableOpacity style={styles.option} onPress = { option.onPress }>
                                <Image source={option.icon} style={styles.icon} />
                                <Text style={styles.text}>
                                    {option.text}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </Animated.View>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,.75)"
    },
    content: {
        backgroundColor: "white",
        width: "80%",
        flex: 1,
        position: "absolute",
        height: "100%"
    },
    option: {
        flexDirection : "row-reverse" , 
        alignItems : "center" , 
    },
    options: {
        padding: 16
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8
    }
})

const darkStyles = {
    ...lightStyles , 
 
    content: {
        backgroundColor: darkTheme.backgroudColor ,
        width: "80%",
        flex: 1,
        position: "absolute",
        height: "100%"
    },
 
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8 , 
        color : darkTheme.textColor 
    }
}