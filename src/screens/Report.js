import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Header from "../components/Cards/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "../components/Cards/post/loadingActivity";

import { Feather, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { Octicons } from '@expo/vector-icons';
export default function Report({ navigation , route }) {


    const {userId, postId, conversationId} = route?.params ; 
     

    const [reasons, setReasons] = useState([]);
    const [reason, setReason] = useState();

    const client = useContext(ApolloContext);
    const [loading, setLoading] = useState(false);

    const [details, setDetails] = useState();
    const [sending, setSending] = useState(false);


    const [showSuccess, setShowSuccess] = useState(false);

    

    useEffect(() => {
        setLoading(true);
        client.query({
            query: gql`
            query GetReportReasons {
                getReportReasons {
                  id
                  reason
                }
            }`
        }).then(response => {
            setLoading(false);
            if (response) {
                setReasons(response.data.getReportReasons);
            }

        }).catch(error => setLoading(false));
    }, [])

    const chooseReason = useCallback((selectedReason) => {
        setReason(selectedReason);
    }, []);


    const sendReport = useCallback(() => {

        setSending(true);
        client.mutate({
            mutation: gql`
            mutation SendReport($reportInput: ReportInput!) {
                sendReport(reportInput: $reportInput) {
                  id 
                  
                }
              }`
            , variables: {
                reportInput: {
                    reasonId: reason?.id,
                    userId: userId,
                    details: details,
                    postId: postId,
                    conversationId: conversationId
                }
            }
        }).then(response => {
            setSending(false);
            if (response) {
                setShowSuccess(true) ; 
            }
        }).catch(error => {
            setSending(false);
        })




    }, [details, reason, postId, userId, conversationId])



    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                title={"ابلاغ"}
            />
            {
                !showSuccess &&
                <ScrollView style={styles.content}>
                    {
                        loading &&
                        <LoadingActivity />
                    }
                    {
                        !loading && reasons.map((item, index) => (
                            <TouchableOpacity key={item.id} style={styles.reason} onPress={() => chooseReason(item)} >
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
                    <PrimaryInput
                        placeholder={"تفاصيل عن المشكلة"}
                        style={styles.reasoonInput}
                        onChange={setDetails}
                        multiline={true}
                        inputStyle={styles.inputStyle}
                    />
                    <PrimaryButton
                        title={"ارسال"}
                        style={styles.button}
                        onPress={sendReport}
                        disabled={!reason || !details || details.trim().length == 0}
                        loading={sending}
                    />
                </ScrollView>
            }
            {
                showSuccess &&
                <View style={[styles.content, styles.successContent]}>
                    <Octicons name="report" size={48} color="#1A6ED8" />
                    <Text style={styles.successMessage}>
                        لقد تم ارسال ابلاغك بنجاح .
                        ستتم مراجعته و اخذ التدابير اللازمة .
                        شكرا على تعاونكم
                    </Text>
                </View>
            }
        </View>
    )

};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
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
    content: {
        padding: 16
    },
    reasoonInput: {
        borderRadius: 4,
        height: 160,
        marginTop: 36

    },
    inputStyle: {
        textAlignVertical: "top",
        padding: 4,
        paddingVertical: 16
    },
    button: {
        marginVertical: 52,
        marginBottom: 32,
        borderRadius: 4
    },

    successContent : { 
        alignItems : "center" , 
        justifyContent : "center" , 
        paddingTop : 48 
    }, 
    successMessage : { 
        color : "#666" , 
        marginTop : 16 , 
        width : "80%" , 
        textAlign  : "center" , 
        fontSize : 14 , 
        lineHeight : 22  
    }
})