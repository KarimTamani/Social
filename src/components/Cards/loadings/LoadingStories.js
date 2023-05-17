import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";

const { width } = Dimensions.get("window");


export default function LoadingStories({ }) {

    return (
        <View style={styles.container}>
            <Skelton
                width={96 }
                height={164}
                style={styles.story}
                 
            />
             <Skelton
                width={96 }
                height={164}
                style={styles.story}
                 
            />
             <Skelton
                width={96 }
                height={164}
                style={styles.story}
                 
            />
             <Skelton
                width={96 }
                height={164}
                style={styles.story}
                 
            />
             <Skelton
                width={96 }
                height={164}
                style={styles.story}
                 
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 164,
        width: "100%",
        paddingHorizontal : 8
    } , 
    story : { 
        borderRadius : 12 , 
        marginRight : 8  
    }
})