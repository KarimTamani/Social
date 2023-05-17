import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Keyboard, ScrollView } from "react-native";
import PrimaryInput from "./PrimaryInput";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { textFonts } from "../../design-system/font";
import { Audio } from 'expo-av';
import RecordPlayer from "../Cards/RecordPlayer";
import * as ImagePicker from 'expo-image-picker';


import * as DocumentPicker from 'expo-document-picker';
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
const NO_PERMISSION_ERROR = "يرجى السماح بالميكروفون";

export default function ConversartionInput({ onSend }) {


    const [recording, setRecording] = useState(false);
    const [message, setMessage] = useState(null);
    const [record, setRecord] = useState(null);
    const [text, setText] = useState(null);
    const [media, setMedia] = useState([]);
    const inputRef = useRef();

    
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    useEffect(() => {


        const subs = Keyboard.addListener("keyboardDidHide", () => {
            inputRef.current?.blur();
            //  console.log(inputRef) ; 
        });
        return subs.remove;
    }, [])

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status == "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );



                setRecording(recording);

            } else {
                showError(NO_PERMISSION_ERROR);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const stopRecording = async () => {
        await recording.stopAndUnloadAsync();
        setRecord(recording.getURI());

        setRecording(null);

    }

    const showError = (message) => {
        setMessage(message);
        setTimeout(() => {
            setMessage(null)
        }, 1000)
    }


    const deleteRecord = () => {
        setRecord(null);
    }

    const onChange = useCallback((value) => {


        setText(value.trim());

    }, [text]);

    const onSubmit = useCallback(() => {
        onSend(text, record, media)
        setText("")
        setRecord(null);
        setMedia([])
    }, [text, record, media]);


    const pickImage = useCallback(() => {

        (async () => {


            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 0.2
            });
            if (result.canceled != "cancel") {
                setMedia([...media, ...result.assets]);
            }
        })();
    }, [media]);



    const deleteMedia = useCallback((uri) => {
        setMedia(media.filter((image) => image.uri != uri));
    }, [media]);


    return (
        <View style={styles.container}>
            {
                message &&
                <Text style={styles.errorMessage}>
                    {message}
                </Text>
            }
            {

                (record) &&
                <View style={styles.mediaAndSound}>
              

                    {

                        record &&
                        <View style={styles.recordContainer}>
                            <RecordPlayer uri={record} />

                        </View>

                    }
                </View>
            }
            {
                (media.length > 0) &&
                <ScrollView style={styles.mediaContent} horizontal>
                    {
                        media.map((image, index) => (
                            <View style={styles.mediaContainer} key={index}>
                                <TouchableOpacity style={styles.closeButton} onPress={() => deleteMedia(image.uri)}>
                                    <FontAwesome name="times" size={24} color="red" />

                                </TouchableOpacity>
                                <Image source={image} style={styles.media} />
                            </View>
                        ))
                    }
                </ScrollView>


            }

            <View style={{ marginTop: 12, flexDirection: "row" }}>
                <PrimaryInput
                    placeholder={"محتوى الرسالة"}
                    style={styles.input}
                    onChange={onChange}
                    value={text}
                    inputRef={inputRef}
                    multiline={true}
                    leftContent={
                        <TouchableOpacity style={styles.inputButton} onPress={pickImage}>
                            <Ionicons name="images-outline" style={styles.buttonIcon} />
                        </TouchableOpacity>
                    }
                    rightContent={
                        !record ?
                            <TouchableOpacity style={styles.inputButton} onPress={!recording ? startRecording : stopRecording}>
                                <FontAwesome name="microphone" style={[styles.buttonIcon, recording && { color: "red" }]} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.inputButton} onPress={deleteRecord}>
                                <FontAwesome name="trash-o" style={[styles.buttonIcon, { color: "red" }]} />
                            </TouchableOpacity>
                    }
                />
                {
                    ((text && text.length > 0) || record || media.length > 0) &&
                    <TouchableOpacity style={styles.sendButton} onPress={onSubmit}>
                        <Ionicons name="send" style={styles.send} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 0, 
        elevation : 16 , 
        justifyContent : "flex-end" , 
        position : "relative"
 
        
    },
    input: {
        flex: 1,
        height: 48,
        
    },
    inputButton: {
        paddingHorizontal: 16
    },
    errorMessage: {
        color: "red",

        textAlign: "center",
        fontSize: 12,
        fontFamily: textFonts.regular
    },
    buttonIcon: {
        fontSize: 20,
        color: "#666"
    },
    sendButton: {

        width: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    send: {
        fontSize: 24,
        color: "#00D0CD",
        transform: [
            {
                rotateZ: "-90deg"
            }
        ]
    },

    mediaAndSound: {

        flexDirection: "row",
        marginTop: 16
    },
    recordContainer: {
        flex: 1 , 
        
    },

    mediaContent: {
        paddingVertical: 8,
        width: "100%",
        height: 72
    },
    mediaContainer: {
        width: 48,
        height: "100%",
        justifyContent: "center",
        marginRight: 8
    },
    media: {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        borderRadius: 8
    },
    closeButton: {
        position: "absolute",
        zIndex: 99,
        alignSelf: "center",
        borderRadius: 24,
        backgroundColor: "white",
        width: 24,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4
    },
})


const darkStyles = { 
    ...lightStyles , 
    buttonIcon: {
        fontSize: 20,
        color : darkTheme.textColor 
    },
}