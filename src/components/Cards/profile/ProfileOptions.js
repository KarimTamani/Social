import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import Confirmation from "../Confirmation";
import { useEvent } from "../../../providers/EventProvider";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";



const BLOCK_TITLE = "حظر المستخدم";
const BLOCK_MESSAGE = "هل انت متأكد من حضر";


export default function ProfileOptions({ onClose, toggleProfileSender, user, onUnFollow }) {

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [operation, setOperation] = useState(null);
    const event = useEvent();
    const client = useContext(ApolloContext);




    const toggleConfirmation = useCallback(() => {
        setShowConfirmation(!showConfirmation);
    }, [showConfirmation])


    const showBlockMessage = useCallback(() => {

        setTitle(BLOCK_TITLE);
        setMessage(BLOCK_MESSAGE + " " + user.name + " " + user.lastname + " ؟ ");
        setOperation("BLOCK");
        toggleConfirmation();

    }, [user, showConfirmation]);

    const block = useCallback(() => {

        setIsLoading(true);
        client.mutate({
            mutation: gql`
            mutation Mutation($userId: ID!) {
                toggleBlock(userId: $userId)
            }`,
            variables: {
                userId: user.id
            }
        }).then(response => {

            if (response) {

                event.emit("blocked-user", user);
                toggleConfirmation();
                onClose && onClose();
                setIsLoading(false);
            }
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });




    }, [user, onClose]);


    const toggleFollow = useCallback(() => {

        onClose();
        client.mutate({
            mutation: gql`
                mutation ToggleFollow($userId: ID!) {
                    toggleFollow(userId: $userId)
                }
            ` ,
            variables: {
                userId: user.id
            }
        }).then(response => {
            if (response) {
                event.emit("new-following", {
                    userId: user.id,
                    state: response.data.toggleFollow
                });
                if (!response.data.toggleFollow)
                    onUnFollow && onUnFollow();

               
            }
        }).catch(error => {

        })
    }, [user]);



    const handleConfirmation = useCallback(() => {
        if (operation == "BLOCK")
            block();
    }, [user, operation])

    const options = [
        {
            text: "حظر",
            onPress: showBlockMessage
        },
        {
            text: "ابلاغ",
            onPress: useCallback(() => {

            }, [])

        },
        {
            text: "للملف الشخصي UR نسخ عنوان",
            onPress: useCallback(() => {

            }, [])

        },
        {
            text: "مشاركة هذا الملف الشخصي",
            onPress: useCallback(() => {
                toggleProfileSender();
                onClose();
            }, [])

        },
        {
            text: "رمز QR",
            onPress: useCallback(() => {

            }, [])

        },
    ];
    
    if (user.isFollowed) {
        options.push({
            text: "الغاء المتابعة",
            onPress: toggleFollow
        })
    }
    



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onClose}>
            <View style={styles.options}>

                {
                    options.map(option => (
                        <TouchableOpacity style={styles.option} onPress={option.onPress}>
                            <Text style={styles.text}>
                                {option.text}
                            </Text>
                        </TouchableOpacity>
                    ))
                }


                {
                    showConfirmation &&
                    <Modal
                        transparent
                        onRequestClose={toggleConfirmation}
                    >
                        <Confirmation
                            title={title}
                            message={message}
                            loading={isLoading}
                            onConfirm={handleConfirmation}
                            onClose={toggleConfirmation}
                        />
                    </Modal>
                }
            </View>
        </TouchableOpacity>

    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)"
    },
    options: {
        backgroundColor: "white",
        minWidth: "60%",

        maxWidth: "80%",
        marginTop: 64,
        marginLeft: 16,
        elevation: 12
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8
    }
})


const darkStyles = {
    ...lightStyles,
    options: {
        ...lightStyles.options,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },
    text: {
        fontFamily: textFonts.regular,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: darkTheme.textColor
    }
}

/*










*/


/*

*/

/*
حظر
ابلاغ
الوسائط
حذف المحادتة
تغيير السمة
زيارة الملف الشخصي
كتم الاشعارات

*/