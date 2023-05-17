import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";
import { useContext } from "react";
import ThemeContext from "../../../providers/ThemeContext";
import darkTheme from "../../../design-system/darkTheme";

const { width } = Dimensions.get("window");

export default function LoadingProfile({ }) {

    
    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    return (

        <View style={styles.container}>

            <Skelton
                width={112}
                height={112}
                style={
                    {
                        borderRadius: 112
                    }
                }
            />
            <Skelton
                width={width / 3}
                height={16}
                style={styles.textLine}
            />
            <Skelton
                width={width / 3}
                height={12}
                style={styles.textLine}
            />
            <Skelton
                width={width / 2}
                height={26}
                style={styles.textLine}
            />
            <Skelton
                width={width - 32}
                height={48}
                style={{
                    marginTop: 48,
                    borderRadius: 48
                }}
            />
            <View style={styles.postLoading}>

                <View style={styles.row}>
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                </View>

                <View style={styles.row}>
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                </View>

                <View style={styles.row}>
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                    <Skelton
                        width={width / 3}
                        height={width / 3}
                        style={styles.col}
                    />
                </View>

            </View>
        </View>
    )
}

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: 72

    },
    textLine: {
        borderRadius: 4,


        marginTop: 16
    },
    row: {
        flexDirection: "row"
    } , 
    postLoading : { 
        marginTop : 32 
    } , 
    col : {
        margin : 1 
    }
}) ; 

const darkStyles =  {
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,
        alignItems: "center",
        paddingTop: 72

    },
}