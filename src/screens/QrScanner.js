import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { BarCodeScanner } from 'expo-barcode-scanner';
import { AuthContext } from "../providers/AuthContext";

const ERROR_MESSAGE = "لا يمكن قرائة رمز QR"

export default function QrScanner({ navigation }) {
    const [hasPermission, setHasPermission] = useState();
    const [error, setError] = useState();
    const [currentUser, setCurrentUser] = useState(false);


    const auth = useContext(AuthContext);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();


        (async () => {
            var userAuth = await auth.getUserAuth();
            if (userAuth) {

                setCurrentUser(userAuth.user);
            }
        })()
    }, [])


    const handleBarCodeScanned = useCallback((type, data) => {

        if (type && type?.data && !isNaN(type?.data)) {
            var id = type?.data;
            if (id != currentUser.id)
                navigation.navigate("Profile", {
                    userId: type?.data
                });

            else if (id == currentUser.id)
                navigation.navigate("AccountStack", { screen: "MyProfile" })

        } else {
            setError(ERROR_MESSAGE);
        }

    }, [navigation, currentUser])

    if (hasPermission === null) {
        return null
    }
    if (hasPermission === false) {
        return null
    }
    return (
        <View style={styles.container}>
            {
                <BarCodeScanner
                    onBarCodeScanned={handleBarCodeScanned}
                    style={StyleSheet.absoluteFill}
                />


            }
            {
                error &&

                <Text style={styles.error}>
                    {error}
                </Text>

            }
            <Image source={require("../assets/illustrations/subtract.png")} style={styles.subtract} />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "gray"
    },
    subtract: {
        flex: 1,
        resizeMode: "stretch",
        width: "100%",
    },
    error: {
        color: "red",
        position: "absolute",
        bottom: 16
    }
})