import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext } from "react";
import AccountName from "../components/Cards/account/AccountName";
import AccountSuggestions from "../components/Cards/account/AccountSuggestions";
import AccountList from "../components/Cards/account/AccountList";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";
export default function Account({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles ;  


    const openProfile = useCallback(() => {
        navigation.navigate("MyProfile")
    }, [navigation])

    return (
        <View style={styles.container}>
           
            <ScrollView>
                <View style={styles.row} key={1}>
                    <AccountName openProfile={openProfile} />
                </View>

                <View style={styles.row} key={2}>
                    <AccountSuggestions navigation = { navigation } />

                </View>
                <View style={styles.row} key={3}>

                    <AccountList navigation = { navigation } />
                </View>
            </ScrollView>
        </View>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingBottom: 56,
        paddingTop : 32 
    },
    header: {
        paddingVertical: 16,
        paddingTop: 48,
        alignItems: "center",
    }
    ,
    backButton: {
        alignSelf: "flex-end",

    },

    row: {
        paddingHorizontal: 16
    },
}) ; 

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        paddingBottom: 56,
        paddingTop : 32 
    },

} 