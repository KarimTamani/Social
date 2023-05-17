import { useCallback } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
const simats = [
    require("../../../assets/illustrations/simats/1.jpg"),
    require("../../../assets/illustrations/simats/2.jpg"),
    require("../../../assets/illustrations/simats/3.jpg"),
    require("../../../assets/illustrations/simats/4.jpg"),
    require("../../../assets/illustrations/simats/5.jpg"),
    require("../../../assets/illustrations/simats/6.jpg"),
    require("../../../assets/illustrations/simats/7.jpg"),
    require("../../../assets/illustrations/simats/8.jpg"),
    require("../../../assets/illustrations/simats/9.jpg"),
    require("../../../assets/illustrations/simats/10.jpg"),
    require("../../../assets/illustrations/simats/11.jpg"),
    require("../../../assets/illustrations/simats/12.jpg"),
];

const HEIGHT = Dimensions.get("screen").height ; 

export default function SimaPicker({ onClose , onSelect}) {

    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity style={styles.sima} onPress = { () =>  onSelect(item)}>
                <Image source={item} style={styles.image} />
            </TouchableOpacity>
        )
    }, []);
    const keyExtractor = useCallback((item, index) => {
        return index;
    }, [])
    return (
        <View style={styles.container}>
            <FlatList
                data={simats}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns = { 3 }
                style = { styles.list}
            />
        </View>
    )

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    } , 
    sima : { 
        width : "33.33%" , 
        height : HEIGHT / 3 
    } , 
    image : { 
        width : "100%" , 
        height : "100%" , 
        resizeMode : "cover"
    } , 
    
    
})