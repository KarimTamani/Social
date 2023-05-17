import { useCallback, useContext } from "react";
import { Text, StyleSheet, View } from "react-native";
import StarRating from 'react-native-star-rating-widget';
import darkTheme from "../../../design-system/darkTheme";
import { textFonts } from "../../../design-system/font";
import ThemeContext from "../../../providers/ThemeContext";

export default function RatignFactors({ }) {


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;


    const onChange = useCallback(() => {

    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.factor}>
                    الاحترافية بالتعامل
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={5}
                    starSize={24}
                    onChange={onChange}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.factor}>
                    التواصل والمتابعة
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={4.5}
                    starSize={24}
                    onChange={onChange}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.factor}>
                    جودة العمل المسلّم
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={3.4}
                    starSize={24}
                    onChange={onChange}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.factor}>
                    الخبرة بمجال المشروع
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={4.8}
                    starSize={24}
                    onChange={onChange}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.factor}>
                    التسليم فى الموعد
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={5}
                    starSize={24}
                    onChange={onChange}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.factor}>
                    التعامل معه مرّة أخرى
                </Text>
                <StarRating
                    style={styles.rating}
                    rating={5}
                    starSize={24}
                    onChange={onChange}
                />
            </View>
        </View>
    )

};

const lightStyles = StyleSheet.create({
    container: {
        borderTopColor : "#eee" , 
        borderTopWidth : 1 , 
        marginTop : 16 , 
        paddingTop : 8   
    },
    row: {
        flexDirection: "row-reverse",
        marginVertical : 8 
    },
    factor: {
        flex: 1,
        fontFamily: textFonts.regular
    },
    rating: {
        flex: 1
    }
}) ; 

const darkStyles = { 
    ...lightStyles , 
    container: {
        borderTopColor : darkTheme.borderColor , 
        borderTopWidth : 1 , 
        marginTop : 16 , 
        paddingTop : 8   
    }
    ,
    factor: {
        flex: 1,
        fontFamily: textFonts.regular , 
        color : darkTheme.textColor 
    },
}