import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from "react-native";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import courses from "../../../assets/courses";
import StarRating from 'react-native-star-rating-widget';
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const WIDTH = Dimensions.get("screen").width;

export default function ProfileCourses({ navigation }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const openViewPosts = useCallback((postId) => {
        navigation.navigate("ViewPosts", {
            getPosts: () => courses,
            focusPostId: postId,
            title: "المحتوى المدفوع"
        })
    }, [navigation]);

    const renderItem = useCallback(({ item }) => {
        return (

            <TouchableOpacity style={styles.service} onPress={() => openViewPosts(item.id)}>

                <View style={styles.imageView}>
                    <Image source={{ uri: item.content.image }} style={styles.image} />
                    <View style={styles.hideContainer}>
                        <Ionicons name="ios-eye-off-outline" style={styles.hideIcon} />
                    </View>
                </View>
                <View style={styles.body}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>
                        {item.content.description}
                    </Text>
                    <Text style={styles.category}>
                        {item.content.category}
                    </Text>
                    <View style={styles.rating}>
                        <Text style={styles.ratingValue}>
                            {item.content.rating}
                        </Text>

                        <StarRating
                            rating={item.content.rating}
                            starSize={16}
                            onChange={() => { }}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        )
    }, []);

    const keyExtractor = useCallback((item) => {
        return item;
    }, []);
    const create = useCallback(() => {
        navigation.navigate("PayedContentEditor");
    }, [navigation]);



    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity style={styles.createButton} onPress={create}>
                    <AntDesign name="pluscircle" style={styles.createIcon} />
                    <Text style={styles.createText}>
                        إنشاء
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={courses}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={2}
            />
        </View>
    )

};
const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee",

    },
    service: {
        width: "50%",
        padding: 1,

    },
    imageView: {
        height: WIDTH / 3,
        position: "relative",

    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    hideContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9,
        alignItems: "center",
        justifyContent: "center"
    },
    hideIcon: {
        fontSize: 24,
        color: "white"
    },

    body: {
        
        padding: 8,

    },
    title: {
        fontFamily: textFonts.regular,

        fontSize: 12,

    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",

    },
    category: {
        fontSize: 12,
        color: "#1A6ED8",
        fontFamily: textFonts.regular
    },
    ratingValue: {
        fontSize: 12
    },
    createButton: {
        flexDirection: "row",
        marginLeft: 16,
        borderColor: "#eee",
        borderWidth: 1,
        alignItems: "center",
        paddingHorizontal: 8,
        borderRadius: 26,
        height: 48,
        flex: 0
    },
    createText: {
        fontFamily: textFonts.bold,
        paddingHorizontal: 8
    },
    header: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingBottom: 8
    }, 
    createIcon : { 
        color : "black"  ,
        fontSize : 24 
    }
})


const darkStyles = {
    ...lightStyles,
    header: {
        ...lightStyles.header,
        backgroundColor: darkTheme.backgroudColor,

    } , 
    createButton: {
        ...lightStyles.createButton,
        borderColor : darkTheme.borderColor 
    }, 
    createText: {
        fontFamily: textFonts.bold,
        paddingHorizontal: 8 , 
        color  : darkTheme.textColor , 
    }, 
    createIcon : { 
        color : "white"  ,
        fontSize : 24 
    } , 
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