import { View, StyleSheet, Dimensions } from "react-native";
import Skelton from "./Skelton";

const { width } = Dimensions.get("window");



export default function LoadingConversation({ }) {

    return (
        <View style={styles.container}>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>
            <View style={styles.conversation}>
                <Skelton
                    width={56}
                    height={56}
                    style={{

                        borderRadius: 56
                    }}
                />
                <View style={styles.content}>
                    <Skelton
                        width={112}
                        height={16}
                        
                    />
                    <Skelton
                        width={width / 2}
                        height={12}
                        
                    />
                </View>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    } , 
    conversation : { 
        flexDirection : "row-reverse" , 
        marginTop : 16 
    }, 
    content : {
        
        alignItems : "flex-end" , 
        justifyContent : "space-between"
    }
})