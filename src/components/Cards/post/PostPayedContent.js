import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { textFonts } from "../../../design-system/font";
import StarRating from 'react-native-star-rating-widget';
import { useCallback, useContext, useEffect, useState } from "react";
import ServiceButton from "../../Buttons/ServiceButton";
import { Entypo, Ionicons } from '@expo/vector-icons';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const WIDTH = Dimensions.get("screen").width;

export default function PostPyaedContent({ post, openConversation, navigation }) {

    const [priceOff, setPriceOff] = useState(0);

    useEffect(() => {
        const { soldPrice, regularPrice } = post.content;
        const deltaPrice = regularPrice - soldPrice;
        setPriceOff(Math.trunc(deltaPrice / regularPrice * 100));

    }, []);

    const openVideoPlayer = useCallback(() => {
        navigation.navigate("VideoPlayer", { uri: post.content.video })
    }, [post])

    const onChange = useCallback(() => {
    }, []);

    const openServiceAsk = useCallback(() => { 
        navigation.navigate("CheckOut") ; 
    } , [ navigation ]) ; 



    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    return (
        <View style={styles.container}>
            {
                post.content.description &&
                <Text style={styles.description}>
                    {post.content.description}
                </Text>
            }

            <View style={styles.imageView}>
                <TouchableOpacity style={styles.descriptionVideo} onPress={openVideoPlayer}>
                    <Text style={styles.descriptionVideoText}>
                        شاهد فيديو الوصف
                    </Text>
                </TouchableOpacity>
                <View style={styles.hideContainer}>
                    <Ionicons name="ios-eye-off-outline" style={styles.hideIcon} />
                </View>
                <Image source={{ uri: post.content.image }} style={styles.image} />

            </View>
            <View style={styles.footer}>
                <View style={styles.row}>
                    <View style={styles.section}>
                        <Text style  = { styles.ratingText}>
                            {post.content.rating}
                        </Text>
                        <StarRating
                            rating={post.content.rating}
                            starSize={24}
                            onChange={onChange}
                        />
                    </View>
                    <View style={[styles.section, { alignItems: "center", justifyContent: "flex-end" }]}>
                        <Text style={[styles.price]}>
                            {post.content.soldPrice}$
                        </Text>
                        <Text style={[styles.price, styles.regularPrice]}>
                            {post.content.regularPrice}$
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.section}>
                        <ServiceButton
                            openConversation={openConversation}
                            text = {"اشتراك"}
                            openServiceAsk = { openServiceAsk }
                            
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.priceOff}> خصم % {priceOff} </Text>
                    </View>
                </View>
            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingBottom: 0

    },

    image: {

        height: WIDTH,
        resizeMode: "cover",
    },
    description: {
        paddingHorizontal: 16,
        fontFamily: textFonts.regular,
        marginBottom: 16
    },
    row: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    section: {
        flex: 1,
        flexDirection: "row",
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 8
    },
    regularPrice: {
        color: "#FB1405",
        textDecorationLine: "line-through",
    },
    priceOff: {
        textAlign: "right",
        flex: 1,
        fontFamily: textFonts.regular,

        textAlignVertical: "center",
        paddingTop: 4,
        fontSize: 12
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
        fontSize: 38,
        color: "white"
    },

    descriptionVideo: {
        position: "absolute",
        right: 16,
        top: 16,
        zIndex: 10,
        borderRadius: 26,
        overflow: "hidden"
    },

    descriptionVideoText: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.8)",
        padding: 8,

        textAlign: "center",
        fontFamily: textFonts.medium,

        fontSize: 12,


    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    description: {
        paddingHorizontal: 16,
        fontFamily: textFonts.regular,
        marginBottom: 16 , 
        color : darkTheme.textColor 
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 8 , 
        color : darkTheme.textColor 
   
    },
    priceOff: {
        textAlign: "right",
        flex: 1,
        fontFamily: textFonts.regular,

        textAlignVertical: "center",
        paddingTop: 4,
        fontSize: 12 , 
        color : darkTheme.textColor 
   
    },
    ratingText : { 
        color : darkTheme.textColor 
   
    }
}