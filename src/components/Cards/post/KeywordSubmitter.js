import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { textFonts } from "../../../design-system/font";

import { AntDesign } from '@expo/vector-icons';
export default function KeywordSubmitter({ onChange , defaultKeywords }) {


    const [keywords, setKeywords] = useState(defaultKeywords ? defaultKeywords : []);
    const [text, setText] = useState("");



    const onSubmitKeyword = useCallback(() => {

        if (text && text.trim().length > 0) {
            setKeywords([...keywords, text.trim()]);
            setText("");
        }
    }, [text, keywords]) ; 


    const deleteKeyword = useCallback((keyword) => { 

        const index = keywords.findIndex( k => k == keyword) ; 
        if ( index >= 0) { 
            var cloneKeywords = [...keywords] ; 
            cloneKeywords.splice(index , 1) ; 
            setKeywords(cloneKeywords) ; 
        }

    } , [ keywords]) ; 


    useEffect(() => { 
        onChange  && onChange (keywords) ; 
    } , [keywords])

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="الكلمات الدالة"
                style={styles.input}
                onChangeText={setText}
                placeholderTextColor={styles.placeholderTextColor}
                onSubmitEditing={onSubmitKeyword}
                value={text}
                autoCapitalize="none"
            >   
            </TextInput>
            <ScrollView >
                <View style={styles.keywords}>
                    {

                        keywords.map(keyword => (
                            <Text style={styles.keyword} key={keyword}>
                                {keyword}  <AntDesign name="closecircleo" style={styles.deleteIcon} onPress={() =>  deleteKeyword (keyword)}/>
                            </Text>
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

        width: "100%",
        marginVertical: 16
    },
    input: {
        borderColor: "#ccc",
        padding: 8,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        backgroundColor: "rgba(0,0,0,0.02)"
    },
    keywords: {
 
        backgroundColor: "rgba(0,0,0,0.02)",
        borderColor: "#ccc",
      
        padding: 8,
        paddingHorizontal : 4 , 
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 16,
        flexDirection:'row', 
        flexWrap:'wrap' , 
        minHeight : 86, 
         
       

    },

    keyword: { 
        
        alignItems : "center" , 
        justifyContent : "center" , 
     
        fontSize : 12  , 
        backgroundColor : "#eee" , 
        borderRadius : 16 ,  
        
        padding : 4  , 
        paddingHorizontal : 8 , 
        margin : 4 
    
    } , 
    deleteIcon : { 
        fontSize : 12 , 
        width  : 24 , 
         
    }


})