import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import exploreData from "../assets/explore";
import { textFonts } from "../design-system/font"
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
import ExploreHeader from "../components/Cards/explore/ExploreHeader";
export default function Explore({ navigation }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    const [explore, setExplore] = useState();
    useEffect(() => {
        setExplore(exploreData.sort((a, b) => 0.5 - Math.random()))
    }, []);



    const renderItem = useCallback(({ item }) => {

        if (item.type == "video") {
            return (
                <TouchableOpacity style={[styles.item]}>
                    <AntDesign name="play" style={styles.playIcon} />
                    <Image source={{ uri: item.content.thumbnail }} style={styles.image} />
                </TouchableOpacity>
            )
        } else if (item.type == "note") {
            return (
                <TouchableOpacity style={[styles.item]}>
                    <Text style={styles.note} numberOfLines={4} ellipsizeMode={"tail"}>
                        {item.content.text}
                    </Text>
                </TouchableOpacity>
            )
        }
        else {

            return (

                <TouchableOpacity style={styles.item}>
                    <Image source={{ uri: item.content.images[0] }} style={styles.image} />
                </TouchableOpacity>
            )
        }

    }, [])

    const keyExtractor = useCallback((item, index) => {
        return index.toString();
    }, [explore]);

    return (
        <View style={styles.container}>
            
            <ExploreHeader navigation={navigation} activePage={"Explore"} />
            <FlatList
                data={explore}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={3}
            />
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: -2
    },
    item: {
        height: 128,
        width: "33.333%",
        padding: 0.5,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: "100%",
        height: "100%",

    },
    note: {
        fontFamily: textFonts.regular,

        height: "100%",
        textAlignVertical: "center",
        paddingHorizontal: 12,
        fontSize: 12,

        color: "#212121",
        lineHeight: 18

    },
    playIcon: {
        color: "white",
        position: "absolute",
        zIndex: 9,
        fontSize: 24
    }

})

const darkStyles = { 
    ...lightStyles ,
    container: {
        flex: 1,
        margin: -2 , 
        backgroundColor : darkTheme.secondaryBackgroundColor , 
    },
    note: {
        fontFamily: textFonts.regular,

        height: "100%",
        textAlignVertical: "center",
        paddingHorizontal: 12,
        fontSize: 12,

        color: darkTheme.textColor ,
        lineHeight: 18

    },
}