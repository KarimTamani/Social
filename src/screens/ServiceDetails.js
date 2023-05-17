import { useCallback, useContext, useMemo, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Image, Modal } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import StarRating from 'react-native-star-rating-widget';
import Slider from "../components/Cards/Slider";
import RatingList from "../components/Cards/ratings/RatingList";
import Header from "../components/Cards/Header";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

const WIDTH = Dimensions.get("screen").width;


const description = `
تم تصميم العمل باستخدام برنامج الاليستريتور

شكرا لزيارتك :)

تص  وستر / تصاميم انستغرام / تصاميم فوتوشوب / تصاميم اليستريتور / موكب / تصميم منيو مطاعم / تصميم لوغو / تصميم شعار / تصميم لوجو / تصميم / جرافيك ديزاين / تصميم واجهات المستخدم / تصميم تجربة المستخدم / تصميم بروشور / تصميم فلايرات / تصميم uiux / تصميم .

`

const SERVICE = {
    id: 5,
    user: {
        name: "تماني كريم",
        image: require("../assets/illustrations/user.png")
    },
    type: "service",

    content: {
        image: "https://i.scdn.co/image/ab67616d0000b2730354714d97c723d3ab7776b6",
        title: "The latest social media design",
        rating: 4.5,
        category: "التصميم"
    }
};

export default function ServiceDetails({ navigation, route }) {

    const { service } = route.params;

    const [openRating, setOpenRating] = useState(false);

    const back = useCallback(() => {
        navigation.canGoBack() && navigation.goBack();
    }, [navigation]);


    const toggleRatings = useCallback(() => {
        setOpenRating(!openRating)
    }, [openRating])

    const viewImage = useCallback((imageIndex, image) => {

        navigation.navigate("ImageViewer", {
            images: [{ uri: image }],


            imageIndex: imageIndex
        })

    }, [navigation]);

    const onChange = useCallback(() => { });

    const buy = useCallback(() => {
        navigation.navigate("Contract");
    }, [navigation]) ; 


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>


            <Header
                title={"تفاصيل الخدمة"}
                navigation={navigation}
            />

            <ScrollView>
                <View style={{ paddingHorizontal: 16 }}>

                    <Text style={styles.title}>
                        {service.content.title}
                    </Text>
                    <Text style={styles.keywords}>
                        {service.content.category}
                    </Text>

                </View>
                <TouchableOpacity onPress={() => viewImage(0, service.content.image)}>
                    <Image source={{ uri: service.content.image }} style={styles.image} />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 16 }}>

                    <View style={styles.serviceInfo}>
                        <View style={styles.infoSection}>
                            <Text style={styles.rating}>
                                {service.content.rating}
                            </Text>
                            <StarRating
                                rating={service.content.rating}
                                starSize={24}
                                onChange={onChange}
                            />
                        </View>

                        <View style={styles.infoSection}>
                            <TouchableOpacity style={[styles.outlineButton, styles.ratingButton]} onPress={toggleRatings}>
                                <Text style={[styles.outlineText]}>
                                    التقييمات
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.description}>
                        {description}
                    </Text>

                    <TouchableOpacity style={[styles.outlineButton, styles.buyButton]} onPress={buy}>
                        <Text style={styles.outlineText}>
                            شراء
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {
                openRating &&
                <Modal
                    transparent
                    animationType="fade"
                    onRequestClose={toggleRatings}
                >
                    <Slider
                        onClose={toggleRatings}
                        percentage={0.1}
                    >
                        <RatingList />
                    </Slider>
                </Modal>
            }
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    header: {
        justifyContent: "flex-end",
        padding: 16,
        paddingTop: 32,
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        fontSize: 24,

    },
    screenTitle: {
        fontFamily: textFonts.semiBold,
        paddingRight: 8
    },
    title: {
        fontFamily: textFonts.semiBold,
        marginTop: 16,
        fontSize: 16
    },

    keywords: {
        fontFamily: textFonts.semiBold,
        color: "#1A6ED8"
    },
    image: {
        height: WIDTH,
        width: WIDTH,
        marginVertical: 16
    },
    outlineButton: {
        paddingHorizontal: 16,
        backgroundColor: "#1A6ED8",

        borderRadius: 26,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 4,
        alignItems: "center",

    },
    outlineText: {
        fontFamily: textFonts.regular,
        color: "white",
    },
    serviceInfo: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
    },
    infoSection: {
        flexDirection: "row",
        alignItems: "center",

    },
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    buyButton: {
        marginBottom: 26,
        width: 128,
        alignSelf: "center"
    },
    ratingButton: {
        backgroundColor: "#FFD700"

    }
}) ; 


const darkStyles=  {
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    },
    title: {
        fontFamily: textFonts.semiBold,
        marginTop: 16,
        fontSize: 16 , 
        color : darkTheme.textColor
    }
    ,
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14 , 
        color : darkTheme.secondaryTextColor
    },
    rating : { 
        color : darkTheme.textColor

    }

}