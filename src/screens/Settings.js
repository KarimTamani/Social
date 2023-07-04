import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Switch } from "react-native";
import Header from "../components/Cards/Header";
import { Entypo } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import Slider from "../components/Cards/Slider";
import PrivateAccount from "./settings/PrivateAccount";
import { useCallback, useContext, useState } from "react";
import ThemeContext from "../providers/ThemeContext";
import { AuthContext } from "../providers/AuthContext";
import darkTheme from "../design-system/darkTheme";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../providers/EventProvider";



export default function Settings({ navigation, route }) {

    var user = route.params?.user;
    const [isPrivate, setIsPrivate] = useState(route.params?.user?.private);
    const [showPrivateAccount, setShowPrivateAccount] = useState(false);

    const client = useContext(ApolloContext);
    const event = useEvent() ; 

    const togglePrivateAccount = useCallback(() => {
        setShowPrivateAccount(!showPrivateAccount);
    }, [showPrivateAccount]);

    const auth = useContext(AuthContext);

    const routes = [
        {
            name: "اضافة رقم الهاتف",
            icon: require("../assets/icons/email.png"),
            onPress: useCallback(() => {
                navigation.navigate("AddCredentials" , { 
                     user 
                })
            }, [navigation])
        },
        {
            name: "الرصيد",
            icon: require("../assets/icons/coin.png"),
            onPress: useCallback(() => {
                navigation.navigate("WalletRoute")
            }, [navigation])

        },
        /*
        {
            name: "ترويج",
            icon: require("../assets/icons/tag.png"), 
            onPress : useCallback(() => { 
                navigation.navigate("")
            } , [navigation])
        },
        */
        {
            name: "طلب توثيق الحساب",
            icon: require("../assets/icons/checkmark-fille.png"),
            onPress: useCallback(() => {
                navigation.navigate("VertifyAccount")
            }, [navigation])


        },

        {
            name: "كلمة المرور",
            icon: require("../assets/icons/padlock.png"),
            onPress: useCallback(() => {
                navigation.navigate("Password")
            }, [navigation])


        },

        {
            name: "حساب خاص",
            icon: require("../assets/icons/CompositeLayer.png"),
            onPress: togglePrivateAccount,
            isToggling: true , 


        },


        {
            name: "شروط الاستخدام",
            icon: require("../assets/icons/privacy.png"),
            onPress: useCallback(() => {
                navigation.navigate("")
            }, [navigation])


        },
        {
            name: "حسابي",
            icon: require("../assets/icons/user.png"),
            onPress: useCallback(() => {
                navigation.navigate("AccountSettings")
            }, [navigation])
        },
        {
            name: "الاتصال بالدعم",
            icon: require("../assets/icons/customer-servic.png"),
            onPress: useCallback(() => {
                navigation.navigate("ContactUs")
            }, [navigation])
        },
        {
            name: "خروج",
            icon: require("../assets/icons/exit.png"),
            onPress: useCallback(() => {
                (async () => {
                    client.mutate({
                        mutation: gql`
                        mutation Mutation {
                            logOut {
                              id 
                            }
                        }`
                    }).then(async response => {

                        if (response.data) {
                            await auth.logOut();
                            navigation.navigate("HomeNavigation", { screen: "Home" })
                        }
                    })

                })()
            }, [navigation])
        }
    ]
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const togglePrivacy = useCallback(() => { 
        
        setShowPrivateAccount( false ) ; 

        client.query({
            query : gql`
            mutation Mutation {
                togglePrivate {
                  id  
                  private  
                }
              }`
        }).then(response => {

    
            if ( response && response.data.togglePrivate) {
                console.log( response.data.togglePrivate.private) ; 
                setIsPrivate(response.data.togglePrivate.private  ) ;
                event.emit("edit-profile") ; 
            }
        }) 
              

    } , [isPrivate , user ])

    return (
        <View style={styles.container}>
            <Header
                title={"الاعدادات"}
                navigation={navigation}
            />
            <ScrollView style={styles.routes}>
                {
                    routes.map((route, index) => (
                        <TouchableOpacity style={styles.route} onPress={route.onPress} key={index}>
                            {

                                route.isToggling &&
                                <Switch
                                    trackColor={{ false: '#aaaa', true: '#1A6ED8aa' }}
                                    thumbColor={!isPrivate ? '#eeee' : '#1A6ED8'}
                                    ios_backgroundColor="#3e3e3e"
                                    value={isPrivate}
                                    onValueChange={togglePrivacy}
                                    style={styles.switcher}
                                />
                            }
                            {
                                !route.isToggling &&
                                <Image source={route.icon} style={styles.icon} />

                            }
                            <Text style={styles.routeText}>
                                {route.name}
                            </Text>
                            <Entypo name="chevron-left" size={24} color="#666" />
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
            {
                showPrivateAccount && !isPrivate && 
                <Modal
                    transparent
                    onRequestClose={togglePrivateAccount}
                >
                    <Slider
                        onClose={togglePrivateAccount}
                        percentage={0.4}
                    >
                        <PrivateAccount 
                            togglePrivate={togglePrivacy}
                        />
                    </Slider>
                </Modal>
            }
        </View>

    )
};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    routes: {

    },
    route: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        marginBottom: 8,
        paddingBottom: 8,
        alignItems: "center",
        paddingHorizontal: 8

    },
    routeText: {

        flex: 1,
        fontFamily: textFonts.regular,
        textAlignVertical: "center",
        color: "#666"

    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        marginLeft: 16,
        marginRight: 8
    } , 
    switcher : { 

        height: 24,
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    routeText: {

        flex: 1,
        fontFamily: textFonts.regular,
        textAlignVertical: "center",
        color: darkTheme.textColor

    }
    ,
    route: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        marginBottom: 8,
        paddingBottom: 8,
        alignItems: "center",
        paddingHorizontal: 8

    },
}