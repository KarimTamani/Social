import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import { textFonts } from "../design-system/font";
import { AntDesign } from '@expo/vector-icons';
import PostPyaedContent from "../components/Cards/post/PostPayedContent";
import { Entypo } from '@expo/vector-icons';
import Slider from "../components/Cards/Slider";
import RatingList from "../components/Cards/ratings/RatingList";
import Header from "../components/Cards/Header" ; 
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

const course = {
    id: 6,
    user: {
        name: "تماني كريم",
        image: require("../assets/illustrations/uknown.png")
    },
    type: "payed-content",

    content: {
        image: "http://www.appcoda.com/wp-content/uploads/2015/04/react-native.png",
        title: "البرنامج التعليمي react native من الصفر",
        rating: 4.5,
        soldPrice: 13.5,
        regularPrice: 45.99,
        category: "برمجة",
        video: "https://cdn.videvo.net/videvo_files/video/free/2022-12/large_watermarked/221019_01_Brands_4k_016_preview.mp4",
        thumbnail: "https://cdn.videvo.net/videvo_files/video/free/2022-12/thumbnails/221019_01_Brands_4k_016_small.jpg"

    }
};

const description = `
تم تصميم العمل باستخدام برنامج الاليستريتور

شكرا لزيارتك :)

تص  وستر / تصاميم انستغرام / تصاميم فوتوشوب / تصاميم اليستريتور / موكب / تصميم منيو مطاعم / تصميم لوغو / تصميم شعار / تصميم لوجو / تصميم / جرافيك ديزاين / تصميم واجهات المستخدم / تصميم تجربة المستخدم / تصميم بروشور / تصميم فلايرات / تصميم uiux / تصميم .

`




export default function PayedContentDetails({ route, navigation }) {

    const { course } = route.params;

    const openConversation = useCallback(() => { 
        navigation.navigate("Conversation") ; 
    } , [ navigation ])

    const [openRating, setOpenRating] = useState(false);

    const toggleRatings = useCallback(() => {
        setOpenRating(!openRating)
    }, [openRating]) ; 

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
           
           <Header
            title = {"المحتوى المدفوع"}
            navigation  = { navigation }
           />
            <ScrollView style = { { marginTop : 16 }}>
                <View style={[styles.user , { paddingHorizontal : 16 }]}>


                    <Image source={course.user.image} style={styles.userImage} />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>
                            <AntDesign name="checkcircle" style={styles.blueIcon} /> {course.user.name}

                        </Text>
                    </View>
                </View>

                <View >
                    <PostPyaedContent
                        post={course}
                        navigation={navigation}
                        openConversation = { openConversation }
                    />
                </View>
                <View style={{ paddingHorizontal : 16 }}>
                <Text style={styles.description}>
                    {description}
                </Text>


                <TouchableOpacity style={styles.ratingButton} onPress={toggleRatings}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.ratingText}>
                            التقييمات
                        </Text>

                        <AntDesign name="staro" style={styles.staro}   />

                    </View>
                    <Entypo name="chevron-small-up" style={styles.chevron} />
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
                        <RatingList singleRating />
                    </Slider>
                </Modal>
            }

        </View>
    );
}

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
        fontFamily: textFonts.bold,
        paddingRight: 8
    },
    title: {
        fontFamily: textFonts.bold,
        marginTop: 16,
        fontSize: 16
    },

    blueIcon: {
        color: "blue",
        fontSize: 12
    }, userImage: {
        width: 48,
        height: 48,
        borderRadius: 42
    },
    user: {
        flexDirection: "row-reverse"
    },
    userInfo: {

        marginRight: 16,

        justifyContent: "center"

    },
    name: {
        fontFamily: textFonts.bold,

    },
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    ratingButton: {
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 46,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginBottom: 56,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        height: 56

    },
    ratingText: {
        fontFamily: textFonts.regular,
        color: "#666",
        marginRight: 16
    },
    staro : { 
        fontSize : 16 , 
        color : "#666"
    } , 
    chevron : { 
        fontSize : 24 ,  
        
        color : "black" 
    }

})

const darkStyles = { 
    ...lightStyles , 
    container : { 
        
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor
    } , 
   
    name: {
        fontFamily: textFonts.bold,
        color : darkTheme.textColor 

    },
   
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14 , 
        color : darkTheme.secondaryTextColor 
    },
    ratingButton: {
        borderColor: darkTheme.borderColor,
        borderWidth: 1,
        borderRadius: 46,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginBottom: 56,
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        height: 56

    },
    ratingText: {
        fontFamily: textFonts.regular,
        color: darkTheme.textColor ,
        marginRight: 16
    },
    staro : { 
        fontSize : 16 , 
        color : darkTheme.secondaryTextColor 
    } , 
    chevron : { 
        fontSize : 24 ,  
        
        color : darkTheme.textColor
    }
}