import { View, Text, StyleSheet } from "react-native";
import MessengerHeader from "../components/Cards/messenger/MessengerHeader";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useContext, useState } from "react";
import ConversationsList from "../components/Cards/messenger/ConversationsList";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


export default function Messenger({ navigation }) {

    const [filter, setFilter] = useState("chat");
    const [searchHandler , setSearchHandler] = useState( null ) ; 
    const [ query , setQuery] = useState(null) ; 

    const openConversation = useCallback((conversation) => { 
        navigation.navigate("Conversation" , {
            conversation 
        })
    } , [navigation]) ; 

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  

    const onSearchQueryChange = useCallback((text) => {
        if (searchHandler) {
            clearTimeout(searchHandler) 
        } ; 

        setSearchHandler ( setTimeout(() => {
            
            setQuery(text) ; 

            console.log("searching for : " , text) ;  
        } , 500)) 
    } , [searchHandler])

    return (
        <View style={styles.container}>
            <MessengerHeader 
                navigation = { navigation }
            />
            <View style={styles.content}>
                <View style={styles.searchInput}>
                    <PrimaryInput
                        leftContent={<AntDesign name="search1" style={styles.searchIcon} />}
                        placeholder={"بحث"}
                        style={styles.input}
                        onChange={onSearchQueryChange}
                    />
                </View>
                <View style={styles.filters}>


                    <TouchableOpacity onPress={() => setFilter("services")}>
                        <Text style={[styles.filter, filter == "services" && styles.activeFilter]}>
                            خدمات
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setFilter("chat")}>
                        <Text style={[styles.filter, filter == "chat" && styles.activeFilter]}>
                            الدردشة
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.conversations}>
                    <ConversationsList openConversation={openConversation} query = { query } />
                </View>

            </View>
        </View>
    )

};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    searchInput: {
        height: 68
    },
    searchIcon: {
        color: "#666",
        fontSize: 24,
        paddingLeft: 16
    },
    content: {
        padding: 16,
        paddingTop: 16 , 
        flex: 1 
    },
    filters: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingBottom: 16 , 
    },
    filter: {
        marginLeft: 16,
        color: "#666",
        fontFamily: textFonts.semiBold,
        padding: 4,
        fontSize: 14,
        paddingHorizontal: 12,
        borderRadius: 4
    },
    activeFilter: {
        backgroundColor: "#1A6ED8",
        color: "white",
    } , 
    conversations : { 
        flex : 1   , 
         
    } , 
    input : { 
        height : 48 , 
         
    }
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor  : darkTheme.backgroudColor
    },
   
    filter: {
        marginLeft: 16,
        color: darkTheme.secondaryTextColor,
        fontFamily: textFonts.semiBold,
        padding: 4,
        fontSize: 14,
        paddingHorizontal: 12,
        borderRadius: 4
    },
}