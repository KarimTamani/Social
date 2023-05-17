import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";

const { width } = Dimensions.get("window");


export default function LoadingComment({ }) {

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
            <Skelton
                width={width}
                height={26}
                style={{
                    marginVertical : 16 
                }}
            />
            <View style={styles.header}>
                <Skelton
                    width={84}
                    height={12}
                    
                />
                <Skelton
                    width={84}
                    height={12}
                />
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginBottom : 16 
    },
    username: {
        alignItems: "flex-end",
        justifyContent: "space-evenly",
        paddingRight: 12
    },
    header: {
        flexDirection: "row-reverse"
    },
})