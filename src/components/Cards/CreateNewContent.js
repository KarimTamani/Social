import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
const HEIGHT = Dimensions.get("screen").height;

export default function CreateNewContent({ closeCreator }) {


    return (
        <TouchableOpacity style={styles.container} onPressIn={closeCreator}>
            <View style={styles.controller}>
                <TouchableOpacity style={styles.option}>
                    <MaterialIcons name="text-fields" style={styles.icon} />
                    <Text style={styles.text}>
                        نص
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option}>
                    <SimpleLineIcons name="picture" style={styles.icon} />
                    <Text style={styles.text}>
                        صورة
                    </Text>
                </TouchableOpacity>
 

                <TouchableOpacity style={styles.option}>
                    <AntDesign name="videocamera" style={styles.icon} />

                    <Text style={styles.text}>
                    ريلز
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
    controller: {
        flexDirection: "row-reverse",
        borderRadius: 32,
        paddingHorizontal: 16,
        backgroundColor: "white",
        elevation: 6,
        position: "absolute",
        bottom: 86,
        height: 56,
        width: 256,
    },
    container: {
        flex: 1,
        position: "relative",
        alignItems: "center"
    },
    option: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        color: "#666",
        fontSize: 18
    },
    text: {
        color: "#666",
        fontFamily: textFonts.semiBold
    }
})