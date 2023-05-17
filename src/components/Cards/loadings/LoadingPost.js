import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const { width } = Dimensions.get("window");

export default function LoadingPost({ }) {



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Skelton
                    width={48}
                    height={48}
                    style={{

                        borderRadius: 48
                    }}
                />
                <View style={styles.username}>
                    <Skelton
                        width={112}
                        height={12}
                    />
                    <Skelton
                        width={84}
                        height={12}
                    />
                </View>
            </View>
            <View style={styles.content}>
                <Skelton
                    width={width }
                    height={12}
                    style={styles.contentLoading}
                />
                <Skelton
                    width={width  / 2 }
                    height={24}
                    
                    style={styles.contentLoading}
                />
                <Skelton
                    width={width / 1.2}
                    height={12}
                    
                    style={styles.contentLoading}
                />
                <Skelton
                    width={width / 4}
                    height={16}
                    
                    style={styles.contentLoading}
                />
            </View>

        </View>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        width: "100%",

        backgroundColor: "white",
        paddingVertical: 16,
        marginTop: 12,
        padding: 16,
        alignItems: "flex-end"
    },
    header: {
        flexDirection: "row-reverse"
    },
    username: {
        alignItems: "flex-end",
        justifyContent: "space-evenly",
        paddingRight: 12
    } , 
    content : { 
        alignItems : "flex-end"
    } , 
    contentLoading : {
        marginTop : 8 
    }
}) ; 

const darkStyles = {
    ...lightStyles , 
    container: {
        width: "100%",

        backgroundColor: darkTheme.backgroudColor,
        paddingVertical: 16,
        marginTop: 12,
        padding: 16,
        alignItems: "flex-end"
    },

}