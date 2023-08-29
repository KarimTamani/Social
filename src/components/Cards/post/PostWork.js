import { useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";


export default function PostWork({ post, navigation }) {


   
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

   
    const openDetails = useCallback(() => {
     
        navigation.navigate("WorkDetails" , {
            postId : post.id
        })
    
    } , [post])

    return (
        <TouchableOpacity style={styles.container} onPress={ openDetails}>
            
            {
                <Text style={styles.title}>
                    {post.title}
                </Text>

            }
            {
                post?.work?.category &&
                <Text style={styles.category}>
                    {post?.work?.category?.name}
                </Text>
            }
            {
                post?.work?.description &&
                <Text style={styles.description}>
                    {post?.work?.description}
                </Text>
            }
        </TouchableOpacity>

    )
}


const lightStyles = StyleSheet.create({
    container: {
        paddingHorizontal : 16 
    } , 
    category : {
        fontWeight : "bold" , 
        color : "#1A6ED8"
    } , 
    title : { 
        marginTop : 16 
    } , 
    description : { 
        color : "#555"
    }
}) ; 
const darkStyles = { 
    ...lightStyles , 
    title : { 
        marginTop : 16 , 
        color : darkTheme.textColor 
    } , 
    description : {
        color : darkTheme.secondaryTextColor
    }
}