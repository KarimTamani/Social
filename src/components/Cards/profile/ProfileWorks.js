import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image , Dimensions} from "react-native";
import works from "../../../assets/works";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";


const WIDTH = Dimensions.get("screen").width;

export default function ProfileWorks({ navigation }) {
 


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    const openWork = useCallback((work) => { 
        navigation.navigate("WorkDetails" , { 
            work : work
        })
    } , [ navigation])

    const renderItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity style={styles.service}  onPress={() => openWork(item)}>
                <View style={styles.imageView}>
                    <Image source={{ uri: item.content.image }} style={styles.image} />
                </View>
                <View style={styles.body}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                        {item.content.title}
                    </Text>
                    <Text style={styles.category}>
                        {item.content.category}
                    </Text>  
                </View>
            </TouchableOpacity>
        )
    }, []);

    const keyExtractor = useCallback((item) => {
        return item;
    }, []) ; 


    return (
        <View style={styles.container}>
            <FlatList
                data={works}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={2}
            />
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1
    } , 

    service: {
        width: "50%",
        padding: 1,

    },
    imageView: {
        width: "100%",
        height: WIDTH / 3,

    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    body: {
        
        padding: 8,

    },
    title: {
        fontFamily: textFonts.regular,

        fontSize: 12,

    } , 
    category : { 
        fontSize : 12 , 
        color :"#1A6ED8" , 
        fontFamily : textFonts.regular
    } , 
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,
    },
    title: {

        fontFamily: textFonts.regular,

        fontSize: 12,
        color: darkTheme.textColor,
    },

    ratingValue: {
        fontSize: 12,
        color: darkTheme.textColor,

    },
}