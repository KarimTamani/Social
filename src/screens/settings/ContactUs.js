import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ConversationHeader from "../../components/Cards/messenger/ConversationHeader";
import Message from "../../components/Cards/messenger/Message";
import ConversartionInput from "../../components/Inputs/ConversationInput";
import darkTheme from "../../design-system/darkTheme";
import ThemeContext from "../../providers/ThemeContext";

const receiver = {

    id: 4,
    name: "الدعم الفني",
    image: require("../../assets/icons/support.png"),
    active: true

}

const sender = {
    id: 3,
    name: "خير الله غازي",
    image: require("../../assets/illustrations/uknown.png"),
    active: true

}

const MESSAGES = [ 
{
    sender: receiver,
    content: [
        {
            type: "text",
            text: "أهلا بك , معك الدعم الفني سيتم مراجعة طلبك والرد بأقرب وقت ، تحياتي"
        },
        
    ]
},



]

export default function ContactUs({ navigation }) {

    var [messages, setMessages] = useState();

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


    useEffect(() => {
        setMessages(MESSAGES)
    }, [])
    const renderItem = useCallback(({ item }) => {
        return (
            <Message
                message={item}
                openImage = { openImage} 
                openVideo = { openVideo }
                
            />
        )
    }, []);


    const keyExtractor = useCallback((item, index) => {
        return index;
    }, []);


    const openImage = useCallback((url ) => { 
        navigation.navigate("ImageViewer" , { 
            images : [ {uri : url} ]
        }) 
    } , [ ]) ; 

    const openVideo = useCallback((url) => { 
        navigation.navigate("VideoPlayer" , { 
            uri : url 
        })
    } , [ ])  

    const onSend = useCallback((text, record, media) => {
        var clone = [...messages];
        var lastMessage = clone[clone.length - 1];


      

        if (lastMessage.send) {
            if (text)
                lastMessage.content.push(
                    {
                        type: "text",
                        text
                    }
                )

            if (record)
                lastMessage.content.push(
                    {
                        type: "record",
                        record: record
                    }
                )

            if (media)
                lastMessage.content.push(
                    {
                        type: "media",
                        media: media
                    }
                )
            clone[clone.length - 1] = lastMessage;

        } else {

            var content = [];
            if (text)
                content.push(
                    {
                        type: "text",
                        text
                    }
                )

            if (record)
                content.push(
                    {
                        type: "record",
                        record: record
                    }
                )


            if (media)
                content.push(
                    {
                        type: "media",
                        media: media
                    }
                )
                
            clone.push({
                sender: sender,
                send: true,
                content: content
            })

        }

        setMessages(clone);
    }, [messages]) ; 


 

    return (
        <View style={styles.container}>
            <ConversationHeader user={receiver} allowPhone = { true } />
            <View style={styles.body}>
                <FlatList
                    data={messages}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                />
            </View>

            <View style={styles.input}>
                <ConversartionInput onSend={onSend} />
            </View>


        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    body: {
        flex: 1,

        marginBottom: 86
    },
    input: {



        position: "absolute",
        bottom: 0,
        width: "100%",

    },

})

const darkStyles = {
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
}