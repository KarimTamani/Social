
import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, FlatList } from "react-native";
import services from "../../../assets/services";
import StarRating from 'react-native-star-rating-widget';
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";


const WIDTH = Dimensions.get("screen").width;

export default function ProfileServices({ navigation }) {



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const openViewPosts = useCallback((postId) => {
        navigation.navigate("ViewPosts", {
            getPosts: () => services,
            focusPostId: postId,
            title: "خدمات"
        })
    }, [navigation]);


    const renderItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity style={styles.service} onPress={() => openViewPosts(item.id)}>
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

    return (
        <View style={styles.container}>
            <FlatList
                data={services}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                numColumns={2}
            />
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,


    },
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
    }
});

const darkStyles = {
    ...lightStyles,
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