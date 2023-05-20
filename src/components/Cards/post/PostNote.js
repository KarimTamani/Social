import { useCallback, useContext, useEffect, useState } from "react";
import { View , Text , StyleSheet} from "react-native" ; 
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

const HASHTAG_REGEX = /#+([ا-يa-zA-Z0-9_]+)/ig;

export default function PostNote({post , navigation }) { 

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  
    const [processedTitle , setProcessedTitle] = useState(post.title) ; 

    useEffect(() => {

        const title = post.title ; 
        if (title) {
            var hashtags = title.match(HASHTAG_REGEX);
        
            if ( hashtags && hashtags.length > 0 ) {
                var processedText = processHashTag(title, hashtags);
                setProcessedTitle(processedText) ; 
            }
        }
    } , []) ; 

    

    const processHashTag = (text, hashtags) => {

        if (hashtags.length == 0)
            return [text]

        var sequences = text.split(hashtags[0]);

        if (hashtags.length == 1)
            return [sequences[0], <Text onPress={() => openHashtag(hashtags[0]) }  style={styles.hashtag}>{hashtags[0]}</Text>, sequences[1]];
        else if (hashtags.length > 1)
            return [sequences[0], <Text onPress={() => openHashtag(hashtags[0]) } style={styles.hashtag}>{hashtags[0]}</Text>, ...processHashTag(sequences[1], hashtags.slice(1))];
    }

    const openHashtag = useCallback((hashtag) => {
        navigation.navigate("HashTag" , {
            hashtagName :  hashtag
        })
    } , [navigation]) 

    return(
        <View style={styles.container}>
            <Text style={styles.content}>
                { processedTitle }
            </Text>
        </View>

    )

}


const lightStyles = StyleSheet.create({
    container : { 
        
    } , 
    content : { 
        padding : 16 , 
        fontSize : 14 , 
        fontFamily : textFonts.regular , 
        lineHeight : 22 , 
        paddingBottom : 8
    } , 
    hashtag: {
        color: "#1A6ED8"
    },
}) ; 

const darkStyles = {
    ...lightStyles , 
    content : { 
        padding : 16 , 
        fontSize : 14 , 
        fontFamily : textFonts.regular , 
        lineHeight : 22 , 
        color : darkTheme.textColor
    } , 
    
}