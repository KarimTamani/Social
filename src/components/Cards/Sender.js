import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import PrimaryInput from "../Inputs/PrimaryInput";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import SmallFollowButton from "../Buttons/SmallFollowButton";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";

const followers = [
    { 
        id : 1 , 
        user : { 
            name : "tamani karim" , 
            image : require("../../assets/illustrations/user.png")
        }
    } , 
    { 
        id : 2 , 
        user : { 
            name : "tamani karim" , 
            image : require("../../assets/illustrations/user.png")
        }
    } , 

]

export default function Sender({ }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const renderItem = useCallback(({ item }) => { 
        return(
            <View style={styles.follower}>
                <Image source={item.user.image}  style={styles.image}/>
                <Text style={styles.username}>
                    { item.user.name }
                </Text> 
                <SmallFollowButton style={styles.sendButton} text="إرسال"/>
            </View>
        )
    } , [ ]) ; 

    const keyExtractor = useCallback((item) => { 
        return item.id 
    } , [ ])


    return (
        <View style={styles.container}>
            <View style={{ height : 56 }}>
                <PrimaryInput
                    placeholder={"بحث"}
                    leftContent={

                        <AntDesign name="search1" style={styles.inputIcon} />

                    }
                />
            </View>
            <FlatList
                renderItem={renderItem} 
                keyExtractor={keyExtractor} 
                data={followers}
            />
        </View>
    )
}
const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    inputIcon: { 
        fontSize: 24 , 
        paddingLeft : 16 
    } , 
    follower : { 
        flexDirection : "row-reverse"  , 
        alignItems: "center" , 
        marginTop : 16 
    } , 
    image : { 
        width : 48 , 
        height : 48   , 
        borderRadius : 48 
    } , 
    username : { 
        flex:  1 , 
        fontFamily : textFonts.medium , 
        textAlign : "right" , 
        paddingRight : 16 , 
        textAlignVertical : "center" 
    } , 
    sendButton : { 
        height : 28 , 
        alignItems : "center" , 
        justifyContent : "center" 
    }
})

const darkStyles = { 
    ...lightStyles , 
  
    username : { 
        flex:  1 , 
        fontFamily : textFonts.medium , 
        textAlign : "right" , 
        paddingRight : 16 , 
        textAlignVertical : "center" , 
        color : darkTheme.textColor 
    } , 

}