import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { getMediaUri } from "../../../api";
import LoadingActivity from "../../Cards/post/loadingActivity";
import { MaterialIcons } from '@expo/vector-icons';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const HEIGHT = Dimensions.get("screen").height;

export default function SimaPicker({ onClose, onSelect }) {


    
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const client = useContext(ApolloContext);
    const [simats, setSimats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        client.query({
            query: gql`
            query GetSimats {
                getSimats {
                    id
                    path
                }
            }`
        }).then(response => {

            if (response) {
                var loadedSimats = response.data.getSimats ; 
                loadedSimats = loadedSimats.map(simat => ({ 
                    ...simat , 
                    uri : getMediaUri(simat.path)  
                })) ; 

                setSimats([{ type: "loading" }, ...loadedSimats])
            }


            setLoading(false);
        }).catch(error => {

            setLoading(false);
        })
    }, []);




    const renderItem = useCallback(({ item, index }) => {

        if (item.type != "loading")
            return (
                <TouchableOpacity style={styles.sima} onPress={() => onSelect(item)}>
                    <Image source={  item} style={styles.image} />
                </TouchableOpacity>
            )
        else 
        return (
            <TouchableOpacity style={styles.sima} onPress={() => onSelect(null)}>
               <MaterialIcons name="disabled-by-default" style={styles.noImageIcon} />
            </TouchableOpacity>
        )
        
    }, []);
    const keyExtractor = useCallback((item, index) => {
        return index;
    }, [])
    return (
        <View style={styles.container}>
            {
                loading &&
                <LoadingActivity />

            }
            {
                !loading && <FlatList
                    data={simats}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    numColumns={3}
                    style={styles.list}
                />

            }

        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    sima: {
        width: "33.33%",
        height: HEIGHT / 3 , 
        alignItems : "center" , 
        justifyContent : "center"
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    noImageIcon : { 
        color : "#555"  , 
        fontSize : 36 
    }

}) ; 


const darkStyles = {
    ...lightStyles , 
    container : { 
        flex : 1 , 
        backgroundColor : darkTheme.secondaryBackgroundColor
    } , 
    noImageIcon : { 
        color : darkTheme.secondaryTextColor   , 
        fontSize : 36 
    }
}