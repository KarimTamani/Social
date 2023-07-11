import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Keyboard } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import PrimaryInput from "../../Inputs/PrimaryInput";
import { MaterialIcons } from '@expo/vector-icons';
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

export default function ExploreHeader({ navigation, activePage , onQueryChange}) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [searchHandler , setSearchHandler] = useState( null ) ; 
    const inputRef = useRef();

    const onBack = useCallback(() => {
        navigation && navigation.canGoBack() && navigation.goBack();

    }, [navigation]);

    const onFocus = useCallback(() => {
        if (activePage != "Search") {
            navigation.navigate("Search");
        }
    }, [navigation, activePage, inputRef]);


    useEffect(() => {
        if (activePage == "Search") {
            setTimeout(() => {
                inputRef.current?.focus();
            } , 200)
        }

    }, [activePage, inputRef])
 

    
    const onSearchQueryChange = useCallback((query) => {
        if (searchHandler) {
            clearTimeout(searchHandler) 
        } ; 

        setSearchHandler ( setTimeout(() => {
   
            onQueryChange && onQueryChange(query) ; 
        } , 500)) 
    } , [searchHandler]) ; 


    const openQrScanner = useCallback(() => { 
        navigation.navigate("QrScanner") ; 
    } , [ ])

    return (
        <View style={styles.container}>
            {

                <PrimaryInput
                    style={styles.input}
                    placeholder={"بحث ..."}
                    onFocus={onFocus}
                    inputRef={inputRef}
                    showKeyBoard={activePage == "Search" ? true : false }
           
                    onChange={onSearchQueryChange}
               
                    leftContent={
                        <TouchableOpacity style={styles.qrButton} onPress={openQrScanner}>
                            <MaterialIcons name="qr-code-scanner" style={styles.scanner} />
                        </TouchableOpacity>
                    }
                />
            }
            <TouchableOpacity onPress={onBack}>
                <AntDesign name="arrowright" style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
};
const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "row",
        padding: 16,
        paddingTop: 46,
        justifyContent: "flex-end",
        alignItems: "center"

    },
    icon: {
        fontSize: 24
    },
    input: {
        flex: 1,
        height: 48,
        marginRight: 16
    },
    qrButton: {
        backgroundColor: "white",
        padding: 6,
        marginLeft: 8,
        borderRadius: 48
    },
    scanner: {
        color: "black",
        fontSize: 24
    }
});

const darkStyles = {
    ...lightStyles,
    container: {
        backgroundColor: darkTheme.backgroudColor,
        flexDirection: "row",
        padding: 16,
        paddingTop: 46,
        justifyContent: "flex-end",
        alignItems: "center"

    }
    ,
    icon: {
        fontSize: 24,
        color: darkTheme.textColor
    },
    qrButton: {
        backgroundColor: darkTheme.backgroudColor,
        padding: 6,
        marginLeft: 8,
        borderRadius: 48
    },
    scanner: {
        color: darkTheme.textColor,
        fontSize: 24
    }
}