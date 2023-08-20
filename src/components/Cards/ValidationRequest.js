import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";


export default function ValidationRequest({ validationRequest , tryAgain , loading}) {



    
  
    const [arabicStatus, setArabicStatus] = useState();

    useEffect(() => {
        if (validationRequest.status == "pending")
            setArabicStatus("قيد المراجعة");
        if (validationRequest.status == "approuved")
            setArabicStatus("مقبول");
        if (validationRequest.status == "rejected")
            setArabicStatus("مرفوض")

    }, [validationRequest]) ; 

    const onTryAgain= useCallback(() => { 
        tryAgain && tryAgain ( ) ; 
    } , [])

    return (
        <View style={styles.container}>
            <Text style={styles.fullname}>
                {validationRequest.name} {validationRequest.lastname}
            </Text>
            <Text style={styles.username}>
                {validationRequest.username}@
            </Text>
            <Text style={styles.text}>
                {validationRequest.fileType}
            </Text>
            {
                <Text style={[styles.status, validationRequest.status == "rejected" && styles.rejected]}>
                    {arabicStatus}
                </Text>
            }

            {
                validationRequest.status == "rejected" &&
                <Text style={styles.note}>
                    {validationRequest.note}
                </Text>

            }
            {
                validationRequest.status == "rejected" &&
                <PrimaryButton
                    style={styles.tryAgain}
                    title={ "اعادة الطلب"}
                    onPress={ onTryAgain}
                    loading = { loading} 
                    disabled={ loading }
                />
            }
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    fullname: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "right"
    },
    username: {
        fontSize: 12,
        textAlign: "right",
        color: "#555",
        marginTop: 8
    },
    text: {
        marginTop: 8,
    },
    status: {
        marginTop: 8,
        color: "#1A6ED8",
        fontWeight: "bold"
    },
    rejected: {
        color: "red"
    } , 
    note : { 
        marginTop : 8 , 
        color : "#555"
    } , 
    tryAgain : { 
        marginTop : 16 
    }
})