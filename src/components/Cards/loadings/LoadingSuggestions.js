import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const { width } = Dimensions.get("window");


export default function LoadingSuggestions({ }) {
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <View style={styles.user}>

                <Skelton
                    width={48}
                    height={48}
                    style={
                        {
                            borderRadius: 48
                        }
                    }
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={16}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 2}
                    height={8}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={26}
                    
                    style={styles.button}
                />
            </View>
            <View style={styles.user}>

                <Skelton
                    width={48}
                    height={48}
                    style={
                        {
                            borderRadius: 48
                        }
                    }
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={16}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 2}
                    height={8}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={26}
                    
                    style={styles.button}
                />
            </View>
            <View style={styles.user}>

                <Skelton
                    width={48}
                    height={48}
                    style={
                        {
                            borderRadius: 48
                        }
                    }
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={16}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 2}
                    height={8}
                    style={styles.textLine}
                />
                <Skelton
                    width={width / 3 / 1.5}
                    height={26}
                    
                    style={styles.button}
                />
            </View>
        </View>
    )
}


const lightStyles = StyleSheet.create({
    container: {
        height: 160,
        width: "100%",
        flexDirection : "row"  , 
        backgroundColor : "white" , 
        overflow : "hidden" , 
        borderRadius : 16 

    },
    user: {
        width: 120,
        justifyContent: "center",
        alignItems: "center",

        paddingVertical: 16,

    },
    textLine: {
        marginTop: 8
    } ,
    button : { 
        borderRadius : 26 , 
        marginTop : 8 
    }
})  ;

const darkStyles = { 
    ...lightStyles , 
    container: {
        height: 160,
        width: "100%",
        flexDirection : "row"  , 
        backgroundColor : darkTheme.backgroudColor , 
        overflow : "hidden" , 
        borderRadius : 16 

    },
}