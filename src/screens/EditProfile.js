import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from "react";
import { textFonts } from "../design-system/font";
import ProfileInfoForm from "../components/Cards/profile/ProfileInfoForm";
import Header from "../components/Cards/Header";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import * as DocumentPicker from 'expo-document-picker';
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { getMediaUri } from "../api";
import { useEvent } from "../providers/EventProvider";
import { createRNUploadableFile } from "../providers/MediaProvider";

export default function EditProfile({ navigation, route }) {


    var { user } = route.params;
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [picture, setPicture] = useState((user.profilePicture) ? ({ uri: getMediaUri(user.profilePicture.path) }) : null);
    const [uploadPicture, setUploadPicture] = useState(null);

    const [loading  , setLoading] = useState(false) ; 


    const client = useContext(ApolloContext);
    const event = useEvent() ; 



    const pickImage = useCallback(() => {

        (async () => {
            let result = await DocumentPicker.getDocumentAsync({
                type: ["image/*"],
                multiple: true
            });
            if (result.type != "cancel") {
                setPicture(result);
                setUploadPicture(result);
            }
        })();
    }, []);


    const deletePicture = useCallback(() => {
        setPicture(null);
        setUploadPicture(null);

        user.pictureId = null;
    }, []);


    const editProfile = useCallback((values) => {
        (async () => {

            setLoading(true) ; 

            var socialMedia = null;
            if (values.facebook || values.twitter || values.snapshot || values.instagram) {
                socialMedia = {
                    facebook: (values.facebook) || null,
                    twitter: (values.twitter) || null,
                    snapshot: (values.snapshot) || null,
                    instagram: (values.instagram) || null
                }
            }
    
    
            var file = null;
            if (uploadPicture) {
                file = await createRNUploadableFile(uploadPicture.uri) ;
            }
    
    
            const userInput = {
                
                name: values.name,
                lastname: values.lastname,
                countryId: values.countryId,
                bio: values.bio,
                username: values.username,
                state : values.state , 
                pictureId: user.pictureId,
                profilePicture: file,
                socialMedia: socialMedia
            };
          
            
            client.mutate({
                mutation: gql`
                
                mutation EditProfile($userInput: EditUserInput) {
                    EditProfile(userInput: $userInput) {
                        id 
                        state
                    }
                }` ,
                variables: {
                    userInput
                }
            }).then(response => { 
                
                console.log (response) ; 
                setLoading(false) ; 
                event.emit("edit-profile") ; 
                navigation.goBack() ; 
                
            }).catch(error => {
                console.log(error);
                
                setLoading(false) ;
            });
    
    
    
    
        })() ; 

    }, [uploadPicture])



    return (
        <SafeAreaView style={styles.container}>
            <Header
                navigation={navigation}
            />
            <ScrollView>
                <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                    {
                        picture &&
                        <Image source={picture} style={styles.profilePicture} />
                    }
                    {
                        !picture &&
                        <Image source={require("../assets/illustrations/gravater-icon.png")} style={styles.profilePicture} />

                    }
                    {
                        !picture && <Entypo name="camera" style={styles.camera} />

                    }
                    {
                        picture &&
                        <TouchableOpacity style={styles.closeButton} onPress={deletePicture}>
                            <FontAwesome name="times" size={24} color="red" />

                        </TouchableOpacity>

                    }
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    اختر صورة
                </Text>
                <View style={styles.form}>
                    <ProfileInfoForm loading= { loading } user={user} onSubmit={editProfile} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    profileImageContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: 128,
        height: 128,
        alignSelf: "center"
    },
    profilePicture: {
        width: 128,
        height: 128,
        borderRadius: 128,
        resizeMode: "cover"
    },
    header: {
        alignItems: "flex-end",
        padding: 16,
        paddingTop: 32
    },
    backIcon: {
        fontSize: 24,

    },
    camera: {
        position: "absolute",
        fontSize: 32,
        color: "white",

    },
    headerText: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        textAlign: "center",
        fontSize: 18,
        marginVertical: 16
    },
    closeButton: {
        position: "absolute",

        backgroundColor: "white",
        width: 38,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        elevation: 6,
        top: 0,
        right: 0
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,

    },
    headerText: {
        fontFamily: textFonts.bold,
        fontWeight : "bold" , 
        textAlign: "center",
        fontSize: 18,
        marginVertical: 16,
        color: darkTheme.textColor
    }
}