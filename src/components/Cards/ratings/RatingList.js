import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../../design-system/font";
import RatignFactors from "./RatingFactors";
import { useCallback, useContext } from "react";
import StarRating from 'react-native-star-rating-widget';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const rating = {
    fullname: "جمال",
    image: require("../../../assets/illustrations/uknown.png"),
    username: "@tamanikarim",
    category: "مبرمج",
    address: "الجزائر سطيف"
};


const user = {
    fullname: "خير الله غ",
    image: require("../../../assets/illustrations/mainUser.jpeg"),
    username: "@khirallah",
    category: "صانع المحتوى",
    address: "العراق"
}



export default function RatingList({ singleRating }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    
    const onChange = useCallback(() => {


    }, []);
    return (
        <View style={styles.ratingContainer}>
            <View style={styles.rating}>
                <TouchableOpacity style={styles.user} >
                    <View style={{ marginRight: 8 }}>
                        <Text style={styles.username}>
                            {rating.fullname}  <AntDesign name="checkcircle" style={styles.blueIcon} />
                        </Text>
                        <Text style={styles.time}>
                            قبل دقيقة واحدة
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Image source={rating.image} style={styles.userImage} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.comment}>
                    عمل جميل شكرا لك
                </Text>
                <StarRating
                    style= { 
                        { 
                            alignSelf :"flex-end" , 
                            marginRight  : 36 , 
                            marginTop : 8 
                        }
                    }
                    rating={5}
                    starSize={24}
                    onChange={onChange}
                />

            </View>
            <View style={[styles.rating, styles.replay]}>
                <TouchableOpacity style={styles.user} >
                    <View style={{ marginRight: 8 }}>
                        <Text style={styles.username}>
                            {user.fullname}  <AntDesign name="checkcircle" style={styles.blueIcon} />
                        </Text>
                        <Text style={styles.time}>
                            قبل دقيقة واحدة
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Image source={user.image} style={styles.userImage} />
                    </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.comment}>
                    شكرا لك سعيد للخدمة
                </Text>

            </View>
            {
                !singleRating &&
                <RatignFactors />

            }
        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    ratingContainer: {
        padding: 16 , 
        
    },
    userImage: {
        borderRadius: 50,
        width: 48,
        height: 48
    },
    user: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    username: {

        textAlignVertical: "center",
        fontSize: 12,
        fontFamily: textFonts.bold , 
        fontWeight : "bold" , 

    },

    time: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 10
    },
    blueIcon: {
        color: "blue",
        fontSize: 12
    },
 
    comment: {
        marginRight: 48,
        fontFamily: textFonts.regular,
        color: "#333",

    },
    replay: {
        marginTop: 16,
        marginRight: 48,
        borderTopColor: "#eee",
        borderTopWidth: 1,
        paddingTop: 16
    }
}) ; 
const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        padding: 16,
        backgroundColor : darkTheme.backgroudColor
    }, 
    
    username: {

        textAlignVertical: "center",
        fontSize: 12,
        fontFamily: textFonts.bold , 
        color : darkTheme.textColor , 
        fontWeight : "bold" , 

    },

    time: {
        fontFamily: textFonts.regular,
        color: "#666",
        fontSize: 10, 
        color : darkTheme.secondaryTextColor , 
    },
 
    comment: {
        marginRight: 48,
        fontFamily: textFonts.regular,
        color: "#333",
        color : darkTheme.textColor , 

    },
    replay: {
        marginTop: 16,
        marginRight: 48,
        borderTopColor: darkTheme.borderColor,
        borderTopWidth: 1,
        paddingTop: 16 , 
    
    }
}