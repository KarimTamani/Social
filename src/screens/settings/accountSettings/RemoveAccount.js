
import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Header from "../../../components/Cards/Header";
import { textFonts } from "../../../design-system/font";

import { Feather, AntDesign } from '@expo/vector-icons';
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import ThemeContext from "../../../providers/ThemeContext";
import { ApolloContext } from "../../../providers/ApolloContext"
import darkTheme from "../../../design-system/darkTheme";
import { gql } from "@apollo/client";
import PrimaryInput from "../../../components/Inputs/PrimaryInput"

import LoadingActivity from "../../../components/Cards/post/loadingActivity";
export default function RemoveAccount({ navigation }) {



    const [reasons, setReasons] = useState([]);
    const client = useContext(ApolloContext);
    const [reason, setReason] = useState(null);


    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [text, setText] = useState();
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        setLoading(true);
        client.query({
            query: gql`
            query GetRemoveReasons {
                getRemoveReasons {
                  id
                  reason
                }
              }
            
            `
        }).then(response => {

            if (response && response.data) {
                setReasons(response.data.getRemoveReasons);
            }
            setLoading(false);
        }).catch(error => {
            setLoading(false);
        })
    }, [])

    const openConfirmation = useCallback(() => {
        navigation.navigate("ConfirmDisable", {
            remove: true,
            removeRequest: {
                reasonId: reason?.id,
                reason: showText ? text : null
            }
        });

    }, [navigation, showText, reason, text]);


    useEffect(() => {

        if (!reason) {
            setIsDisabled(true);
            return;
        }

        if (reason && reasons) {

            if (showText && (!text || text.trim().length == 0)) {
                setIsDisabled(true)
                return;
            }
        }
        setIsDisabled(false);
    }, [showText, reasons, reason, text])

    const chooseReason = useCallback((removeReason, index) => {
        setShowText(index == reasons.length - 1)
        setReason(removeReason);

    }, [reason, reasons])


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <ScrollView style={styles.content}>

                <Text style={styles.title}>
                    لماذا ستغادر ... ؟

                </Text>
                <Text style={styles.text}>
                    نأسف لرؤيتك تغادر نود أن نعرف سبب رغبتك في حذف حسابك حتى نتمكن من تحسي التطبيق ودعم مجتمعنا
                </Text>


                {

                    loading &&
                    <LoadingActivity />

                }

                {

                    !loading && reasons.map((item, index) => (
                        <TouchableOpacity style={styles.reason} onPress={() => chooseReason(item, index)} >
                            {
                                (reason == null || (reason.id != item.id)) &&
                                <Feather name="circle" style={styles.icon} />
                            }
                            {
                                reason && (reason.id == item.id) &&
                                <AntDesign name="checkcircle" style={[styles.icon, styles.blueIcon]} />
                            }
                            <Text style={styles.reasonText}>
                                {item.reason}
                            </Text>
                        </TouchableOpacity>
                    ))

                }

                {

                    showText &&

                    <PrimaryInput
                        placeholder={"اكتب ملخص لسبب الحذف"}
                        style={styles.reasoonInput}
                        onChange={setText}
                        multiline={true}
                        inputStyle={styles.inputStyle}
                    />
                }


                <PrimaryButton
                    title={"متابعة"}
                    style={styles.button}
                    onPress={openConfirmation}
                    disabled={isDisabled}
                />

            </ScrollView>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    content: {
        padding: 16
    },
    title: {
        fontFamily: textFonts.bold,
        color: "#212121",
        fontSize: 16,


    },
    text: {
        color: "#706D6D",
        fontFamily: textFonts.regular,
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        marginVertical: 52,
        marginBottom: 32

    },
    reasonText: {
        fontFamily: textFonts.regular,
        color: "#212121",
        fontSize: 14,
        flex: 1,

    },
    reason: {
        marginTop: 16,
        flexDirection: "row",
    },
    icon: {
        fontSize: 24,
        color: "#666"
    },
    blueIcon: {
        color: "#1A6ED8"
    },

    reasoonInput: {
        borderRadius: 4,
        height: 160,
        marginTop: 16

    },
    inputStyle: {
        textAlignVertical: "top",
        padding: 4,
        paddingVertical: 16
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    title: {
        fontFamily: textFonts.bold,
        color: darkTheme.textColor,


    },
    text: {
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.regular,
        fontSize: 12,
        marginTop: 8
    },

    reasonText: {
        fontFamily: textFonts.regular,
        color: darkTheme.textColor,
        fontSize: 14,
        flex: 1,

    },
}