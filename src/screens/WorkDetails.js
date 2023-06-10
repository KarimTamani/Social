import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView , Dimensions } from "react-native";
import { textFonts } from "../design-system/font";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Header from "../components/Cards/Header" ; 
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";



const WIDTH = Dimensions.get("screen").width;

const description = `
تم تصميم العمل باستخدام برنامج الاليستريتور

شكرا لزيارتك :)

تص  وستر / تصاميم انستغرام / تصاميم فوتوشوب / تصاميم اليستريتور / موكب / تصميم منيو مطاعم / تصميم لوغو / تصميم شعار / تصميم لوجو / تصميم / جرافيك ديزاين / تصميم واجهات المستخدم / تصميم تجربة المستخدم / تصميم بروشور / تصميم فلايرات / تصميم uiux / تصميم .
`

const WORK = {
    id: 5,
    user: {
        name: "تماني كريم",
        image: require("../assets/illustrations/user.png"),
        category: "مصمم",

    },
    type: "service",
    content: {
        image: "https://cdn.dribbble.com/users/2816838/screenshots/8751099/media/e72af5acfdb44c234079dcfea3f12ced.png",
        title: "The latest social media design",
        rating: 4.5,
        category: "التصميم"
    }
};
export default function WorkDetails({ route , navigation }) {

    const [like, setLike] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [showSender, setShowSender] = useState(false);

    
    const { work } = route.params ; 
    const back = useCallback(() => {
        navigation.canGoBack() && navigation.goBack();
    }, [navigation]);


    const viewImage = useCallback((imageIndex, image) => {

        navigation.navigate("ImageViewer", {
            images: [{ uri: image }],


            imageIndex: imageIndex
        })

    }, [navigation]);


    const toggleFavorite = useCallback(() => {
        setFavorite(!favorite);
    }, [favorite]);



    const likePost = useCallback(() => {

        setLike(!like);
    }, [like]);

    const toggleSender = useCallback(() => {
        setShowSender(!showSender);
    }, [showSender]);



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    return (
        <View style={styles.container}>

            <Header
                title = {"تفاصيل العمل"}
                navigation = { navigation } 
            />
            <ScrollView style={{ padding: 16 }}>
                <View style={styles.workHeader}>
                    <View style={styles.section}>
                        <TouchableOpacity style={styles.outlineButton}>
                            <Text style={styles.outlineText}>
                                تعديل

                            </Text>

                            <Feather name="edit-2" size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.user}>


                            <Image source={work.user.image} style={styles.userImage} />
                            <View style={styles.userInfo}>
                                <Text style={styles.name}>
                                    <AntDesign name="checkcircle" style={styles.blueIcon} /> {work.user.name}

                                </Text>
                                <Text style={styles.category}>
                                    {work.user.category}
                                </Text>
                            </View>
                        </View>
                    </View>


                </View>
                <Text style={styles.title}>
                    {work.content.title} 
                </Text>
                <Text style={styles.description}>
                    {description}
                </Text>
                <Text style={styles.keywords}>
                    {work.content.category}
                </Text>
                <TouchableOpacity onPress={() => viewImage(0, work.content.image)}>
                    <Image source={{ uri: work.content.image }} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.interactions}>
                    <View style={styles.views}>
                        <AntDesign name="eyeo" style={styles.viewsIcon} />
                        <Text style={styles.viewsValue}>
                            500
                        </Text>

                    </View>


                    <TouchableOpacity style={styles.interaction} onPress={toggleFavorite}>
                        {
                            !favorite && <FontAwesome name="bookmark-o" style={styles.interactionIcon} />

                        }
                        {
                            favorite && <FontAwesome name="bookmark" style={[styles.interactionIcon, { color: "#FFD700" }]} />

                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.interaction} onPress={toggleSender}>
                        <Feather name="send" style={styles.interactionIcon} />

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.interaction} onPress={likePost}>

                        {
                            !like &&
                            <AntDesign name="hearto" style={[styles.interactionIcon]} />
                        }
                        {
                            like &&
                            <AntDesign name="heart" style={[styles.interactionIcon, like && styles.like]} />
                        }
                    </TouchableOpacity>

                </View>


                <TouchableOpacity style={[styles.outlineButton, styles.linkButton]}>
                    <Text style={styles.outlineText}>
                        رابط العمل


                    </Text>
                    <AntDesign name="link" size={14} color="white" />


                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};

const lightStyles = StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    blueIcon: {
        color: "blue",
        fontSize: 12
    },
    section: {
        flex: 1,
        justifyContent: "center"
    },
    workHeader: {
        flexDirection: "row"
    },
    userImage: {
        width: 48,
        height: 48,
        borderRadius: 42
    },
    user: {
        flexDirection: "row-reverse"
    },
    userInfo: {

        marginRight: 16,


    },
    name: {
        fontFamily: textFonts.bold,

    },
    category: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 12
    },

    screenTitle: {
        fontFamily: textFonts.bold,
        paddingRight: 8
    },
    outlineButton: {
        width: 128,
        backgroundColor: "#1A6ED8",

        borderRadius: 26,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 4,
        alignItems: "center"
    },
    outlineText: {
        fontFamily: textFonts.regular,
        color: "white",
        marginRight: 8
    },
    description: {
        color: "#666",
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    keywords: {
        fontFamily: textFonts.bold,
        color: "#1A6ED8"
    },
    image: {
        height: WIDTH,
        width: WIDTH,
        marginVertical: 16
    },
    interactions: {

        flexDirection: "row",
        justifyContent: "flex-end",

        height: 56,

        borderColor: "#eee",
        borderWidth: 1,
        marginBottom: 26,
        borderRadius: 56,
        paddingHorizontal: 16
    },

    interaction: {

        paddingHorizontal: 6,
        justifyContent: "center",
        alignItems: "center",


    },
    interactionIcon: {
        fontSize: 20,
        color: "#666",


    },
    interactionValue: {
        paddingRight: 6,
        fontFamily: textFonts.bold,
        color: "#666"

    },
    like: {
        color: "#FF3159"
    },
    views: {

        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    } , 
    linkButton : {
        marginVertical : 56 , 
        marginTop : 26 , 
        alignSelf : "center" 
    } , 
    title  :{ 
        fontFamily : textFonts.bold , 
        marginTop : 16, 
        fontSize : 16  
    } , 
    viewsIcon : { 
        color :"black" , 
        fontSize : 24 
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    title  :{ 
        fontFamily : textFonts.bold , 
        marginTop : 16, 
        fontSize : 16 , 
        color : darkTheme.textColor  
    } , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor 
    },
   
    description: {
        color: darkTheme.secondaryTextColor ,
        fontFamily: textFonts.regular,
        lineHeight: 22,
        fontSize: 14
    },
    name: {
        fontFamily: textFonts.bold,
        color : darkTheme.textColor 

    },
    category: {
        fontFamily: textFonts.regular,
        color: darkTheme.secondaryTextColor ,
        fontSize: 12
    },
    views: {

        flex: 1,
        flexDirection: "row",
        alignItems: "center" , 
        color : darkTheme.textColor 

    } 
    ,
    interactionIcon: {
        fontSize: 20,
        color: "#666", 
        color : darkTheme.secondaryTextColor 


    },
    interactionValue: {
        paddingRight: 6,
        fontFamily: textFonts.bold,
        color: "#666", 
        color : darkTheme.secondaryTextColor 
    } , 
    viewsIcon : { 
        color : darkTheme.textColor  , 
        fontSize : 24 
    } , 
    viewsValue : { 

        color : darkTheme.textColor  , 
    },
    interactions: {

        flexDirection: "row",
        justifyContent: "flex-end",

        height: 56,

        borderColor: darkTheme.borderColor,
        borderWidth: 1,
        marginBottom: 26,
        borderRadius: 56,
        paddingHorizontal: 16
    },


}