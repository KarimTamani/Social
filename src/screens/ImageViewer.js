import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import ImageView from "react-native-image-viewing";



export default function ImageViewer({ route, navigation }) {

    const images = route.params.images;



    var imageIndex = 0;
    if (route.params.imageIndex)
        imageIndex = route.params.imageIndex;


        
    const onClose = useCallback(() => {
        navigation.canGoBack() && navigation.goBack();
    }, [navigation])
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={"black"}
                barStyle={"dark-content"}
            />
            <ImageView

                images={images}
                imageIndex={imageIndex}
                visible={true}
                onRequestClose={onClose}
            />
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    }
})