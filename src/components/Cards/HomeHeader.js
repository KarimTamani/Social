import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import AuthButton from "../Buttons/AuthButton";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { useEvent } from "../../providers/EventProvider";
import { useRealTime } from "../../providers/RealTimeContext";
import { AuthContext } from "../../providers/AuthContext";
export default function HomeHeader({ navigation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const realTime = useRealTime();


    const onMessenger = useCallback(() => {
        navigation.navigate("Messenger")
    }, [navigation]);

    const openExplore = useCallback(() => {
        navigation.navigate("ExploreRoute");
    }, [navigation]);


    const [unReadConversations, setUnReadConversations] = useState([]);
    const client = useContext(ApolloContext);
    const event = useEvent();
    const auth = useContext(AuthContext);

    useEffect(() => {

 
        (async () => {
  
            var userAuth = await auth.getUserAuth();
            if (userAuth) {
                client.query({
                    query: gql`
                    query Query {
                        getUnReadConversations {
                            id     
                          
                        }
                    }`
                }).then(response => {
                 
                    if (response && response.data)
                        setUnReadConversations(response.data.getUnReadConversations);

                }).catch(error => {
                  
                })
            }
        })()


    }, []);


    useEffect(() => {
        const conversationSeen = (conversationId) => {
       
            const index = unReadConversations.findIndex(conversation => conversation.id == conversationId);
            if (index >= 0) {
 

                var cloneConversations = [...unReadConversations];
                cloneConversations.splice(index, 1);
             
                setUnReadConversations( cloneConversations );
            }
        };

        const onNewMessage = (newMessage) => {
            console.log (newMessage)
            const conversationId = newMessage.conversationId;
            const index = unReadConversations.findIndex(conversation => conversation.id == conversationId);
            if (index < 0)
                setUnReadConversations([...unReadConversations, { id: conversationId }]);
        }

        event.addListener("conversation-seen", conversationSeen);
        realTime.addListener("NEW_MESSAGE", onNewMessage);

        return () => {
            event.removeListener("conversation-seen", conversationSeen);
            realTime.removeListener("NEW_MESSAGE", onNewMessage);

        }

    }, [unReadConversations , event , realTime])

    return (
        <View style={styles.container}>
            <View style={styles.section}>

                <AuthButton onPress={onMessenger} navigation={navigation} style={styles.massengerButton}>
                    <Feather name="message-circle" style={styles.headerIcon} />
                    {

                        unReadConversations.length != 0 &&
                        <Text style={styles.unseenNotifications}>
                            {unReadConversations.length < 10 ? unReadConversations.length : "+9"}
                        </Text>
                    }
                </AuthButton>
                <Text style={styles.appName}>

                </Text>
            </View>
            <View style={styles.section}>
                <AuthButton onPress={openExplore} navigation={navigation}>
                    <AntDesign name="search1" style={styles.headerIcon} />
                </AuthButton>
            </View>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 16,
        paddingVertical: 10,
        paddingTop: 36,
        justifyContent: "space-between",
        backgroundColor: "white",
        elevation: 12,
        position: "relative",
        zIndex: 99


    },
    appName: {
        color: "#666",
        marginLeft: 16,
        textAlignVertical: "center"

    },
    section: {
        flexDirection: "row",
    },
    headerIcon: {
        fontSize: 24,
        backgroundColor: "#eee",
        padding: 8,
        borderRadius: 24
    },
    unseenNotifications: {
        position: "absolute",
        backgroundColor: "#FF3159",
        color: "white",
        fontSize: 10,
        width: 22,
        height: 22,
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: 26,
        bottom: -4,
        right: -8
    },
    massengerButton: {

        position: "absolute",
    }
});
const darkStyles = {
    ...lightStyles,
    container: {
        flexDirection: "row",
        padding: 16,
        paddingVertical: 10,
        paddingTop: 36,
        justifyContent: "space-between",
        backgroundColor: darkTheme.backgroudColor,
        elevation: 12,
        position: "relative",
        zIndex: 99


    },

    headerIcon: {
        fontSize: 24,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        padding: 8,
        borderRadius: 24,
        color: "white"
    }
}