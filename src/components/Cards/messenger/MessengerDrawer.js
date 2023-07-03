import { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, Switch } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import { AuthContext } from "../../../providers/AuthContext";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";

const WIDTH = Dimensions.get("screen").width;
const CLOSE = - WIDTH * 80 / 100;
const OPEN = 0


export default function MessengerDrawer({ toggleDrawer, navigation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const auth = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(false);

    const [showState, setShowState] = useState(false);
    const [mute, setMute] = useState(false);
    const [allowMessaging, setAllowMessaging] = useState(true);

    useEffect(() => {
        (async () => {
            const userAuth = await auth.getUserAuth();
            if (userAuth && userAuth.user) {
                setCurrentUser(userAuth.user);
                setShowState(userAuth.user.showState) ; 
                setMute(userAuth.user.mute) ; 
                setAllowMessaging(userAuth.user.allowMessaging) ; 
            }
        })();

    }, [])

   
    const client = useContext(ApolloContext);

    const options = [
        {

            text: "طلبات المراسلة",
            icon: require("../../../assets/icons/icons8-communic.png"),
            onPress: useCallback(() => {
                navigation.navigate("MessageRequests");
                toggleDrawer();
            }, [navigation])
        },
        {

            text: "الدردشات المؤرشفة",
            icon: require("../../../assets/icons/closeRectangle.png"),
            onPress: useCallback(() => {
                navigation.navigate("ArchivedConversations");
                toggleDrawer();
            }, [navigation])
        },
        {
            text: "حالة النشاط",
            icon: require("../../../assets/icons/icons8-toggle-i.png"),
            isToggling: true
        },

        {
            text: "عدم الازعاج",
            icon: require("../../../assets/icons/icons8-no-audio.png"),
            isToggling: true
        },
        {
            text: "إنشاء مجموعة",
            icon: require("../../../assets/icons/icons8-add-user.png"),
            onPress: useCallback(() => {
                navigation.navigate("CreateGroup");
                toggleDrawer();
            }, [navigation])
        },
        {
            text: "منع الرسائل",
            icon: require("../../../assets/icons/icons8-toggle-i.png"),
            isToggling: true
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

    const getSwitchValue = useCallback((index) => {
        switch (index) {
            case 2:
                return showState
            case 3:
                return mute
            case 5:
                return !allowMessaging
        }
    }, [showState, allowMessaging, mute]);


    const toggleMute = useCallback(() => {

        client.mutate({
            mutation: gql`
            mutation Mutation {
                toggleMute
            }`
        }).then(async response => {
            if (response) {

                var value = response.data.toggleMute
                setMute(value);
                currentUser.mute = value;

                await auth.updateUser(currentUser);
            }
        });

    }, [currentUser]);


    const toggleShowState = useCallback(() => {
        client.mutate({
            mutation: gql`
            mutation Mutation {
                toggleShowState
            }`
        }).then(async response => {
            if (response) {
                var value = response.data.toggleShowState;

                setShowState(value);
                currentUser.showState = value;
                await auth.updateUser(currentUser);
            }
        });
    }, [currentUser]);


    const toggleAllowMessaging = useCallback(() => {
        client.mutate({
            mutation: gql`
            mutation Mutation {
                toggleAllowMessaging
            }`
        }).then(async response => {
            if (response) {
                var value = response.data.toggleAllowMessaging
                setAllowMessaging(value);
                currentUser.allowMessaging = value;
                await auth.updateUser(currentUser);
            }
        });
    }, [currentUser]);


    const toggleSwitch = useCallback((index) => {

        switch (index) {
            case 2:
                toggleShowState();
                break;
            case 3:
                toggleMute()
                break;
            case 5:
                toggleAllowMessaging();
                break;
        }
    }, [showState, allowMessaging, mute, currentUser])

    return (
        <View style={styles.container} >
            <TouchableOpacity onPress={closeDrawer} activeOpacity={1} style={StyleSheet.absoluteFill}>
            </TouchableOpacity>
            <Animated.View style={[styles.content, drawerStyle]}>
                <View style={styles.options}>
                    {

                        options.map((option, index) => (
                            <TouchableOpacity style={styles.option} onPress={option.onPress}>


                                {

                                    option.isToggling &&
                                    <Switch
                                        trackColor={{ false: '#aaaa', true: '#1A6ED8aa' }}
                                        thumbColor={!getSwitchValue(index) ? '#eeee' : '#1A6ED8'}
                                        ios_backgroundColor="#3e3e3e"
                                        value={getSwitchValue(index)}
                                        onValueChange={() => toggleSwitch(index)}
                                        style={[styles.switcher, styles.icon]}
                                    />
                                }

                                {
                                    !option.isToggling &&
                                    <Image source={option.icon} style={styles.icon} />

                                }
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
        flexDirection: "row-reverse",
        alignItems: "center",
    },
    options: {
        padding: 16
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    switcher: {

        height: 24,


    },

})

const darkStyles = {
    ...lightStyles,

    content: {
        backgroundColor: darkTheme.backgroudColor,
        width: "80%",
        flex: 1,
        position: "absolute",
        height: "100%"
    },

    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: darkTheme.textColor
    }
}