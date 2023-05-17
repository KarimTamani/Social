import { useCallback, useContext } from "react";
import { View, StyleSheet, Text, Image, FlatList } from "react-native";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import Header from "../../../components/Cards/Header";
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

const users = [
    {
        id: 1,
        fullname: "كريم تماني",
        image: require("../../../assets/illustrations/user.png"),
        username: "@tamanikarim",
        profession: "مبرمج",
        address: "الجزائر سطيف"
    },
    {
        id: 2,
        fullname: "خير الله غ",
        image: require("../../../assets/illustrations/mainUser.jpeg"),
        username: "@khirallah",
        profession: "صانع المحتوى",
        address: "العراق"
    }
]

export default function BlockedUsers({ navigation }) {


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const renderItem = useCallback(( { item } ) => {

        return (
            <View style={styles.user}>
                <Image source = { item.image}  style= { styles.userImage } /> 
                <Text style = { styles.username}>
                    {item.fullname}
                </Text>
                <PrimaryButton
                    title={"إزالة الحظر"}
                    style = { styles.button}
                    textStyle = { styles.buttonTextStyle}
                />

            </View>
        )
    }, []);


    const keyExtractor = useCallback((item) => {
        return item.id;
    }, [])

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
                title={
                    <Text>

                        الحسابات المحظورة    <Text style={styles.usersCount}>
                            2
                        </Text>
                    </Text>
                }
            />
            <FlatList
                data={ users } 
                keyExtractor = { keyExtractor} 
                renderItem = { renderItem }
            />

        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    usersCount: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular
    } , 
    user : { 
        flexDirection : "row-reverse" , 
        alignItems : "center" ,  
        padding : 16 , 
        borderBottomColor : "#eee" , 
        borderBottomWidth : 1 
        
    } , 
    userImage : { 
        width : 48 , 
        height : 48 , 
        borderRadius : 48 
    } ,
    username : { 
        flex : 1 , 
        fontFamily : textFonts.regular  , 
        paddingRight : 16 
    }, 
    button : { 
        backgroundColor : "white"
    } , 
    buttonTextStyle : { 
        color :"#1A6ED8" , 
        fontFamily : textFonts.regular 
    }

})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    }
    , 
    user : { 
        flexDirection : "row-reverse" , 
        alignItems : "center" ,  
        padding : 16 , 
        borderBottomColor : darkTheme.borderColor  , 
        borderBottomWidth : 1 
        
    } , 
     
    button : { 
        backgroundColor : darkTheme.backgroudColor
    }  ,
    username : { 
        flex : 1 , 
        fontFamily : textFonts.regular  , 
        paddingRight : 16  , 
        color : darkTheme.textColor 
    },

}