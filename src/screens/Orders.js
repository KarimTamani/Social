import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import { useCallback, useContext, useEffect, useState } from "react";
import OrdersList from "../components/Cards/deals/OrdersList";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


const filters = [
    "pending",
    "executing",
    "delivered",
    "closed"
]

export default function Orders({ navigation }) {

    const [activeFilter, setActiveFilter] = useState(filters[0]);

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles
    
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.filter} onPress = { () => setActiveFilter(filters[0])}>
                    {
                        activeFilter != filters[0] &&

                        <Feather name="circle" style={styles.icon} />
                    }

                    {
                        activeFilter == filters[0] &&
                        <AntDesign name="checkcircle" style={styles.redIcon} />

                    }

                    <Text style={styles.status}>
                        في انتظار التعليمات

                    </Text>

                    {
                        activeFilter == filters[0] &&
                        <Text style={styles.numOrders}>
                            2
                        </Text>
                    }
                </TouchableOpacity>


                <TouchableOpacity style={styles.filter} onPress = { () => setActiveFilter(filters[1])}>
                    {
                        activeFilter != filters[1] &&

                        <Feather name="circle" style={styles.icon} />
                    }

                    {
                        activeFilter == filters[1] &&
                        <AntDesign name="checkcircle" style={styles.redIcon} />

                    }

                    <Text style={styles.status}>
                        قيد التنفيذ

                    </Text>

                    {

                        activeFilter == filters[1] &&
                        <Text style={styles.numOrders}>
                            2
                        </Text>
                    }
                </TouchableOpacity>


                <TouchableOpacity style={styles.filter} onPress = { () => setActiveFilter(filters[2])}>
                    {
                        activeFilter != filters[2] &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        activeFilter == filters[2] &&
                        <AntDesign name="checkcircle" style={styles.redIcon} />
                    }
                    <Text style={styles.status}>
                        تم تسليمها

                    </Text>
                    {
                        activeFilter == filters[2] &&
                        <Text style={styles.numOrders}>
                            5
                        </Text>
                    }
                </TouchableOpacity>


                <TouchableOpacity style={styles.filter} onPress = { () => setActiveFilter(filters[3])}>
                    {
                        activeFilter != filters[3] &&
                        <Feather name="circle" style={styles.icon} />
                    }
                    {
                        activeFilter == filters[3] &&
                        <AntDesign name="checkcircle" style={styles.redIcon} />
                    }
                    <Text style={styles.status}>
                        تم إغلاقه
                    </Text>
                    {
                        activeFilter == filters[3] &&
                        <Text style={styles.numOrders}>
                            0
                        </Text>
                    }
                </TouchableOpacity>


            </View>
            <OrdersList
                navigation = { navigation }
            />
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16
    },
    filter: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 8
    },
    status: {
        flex: 1,
        paddingRight: 8,
        fontFamily: textFonts.regular
    },
    icon: {
        color: "#666",
        fontSize: 24
    },
    numOrders: {
        color: "#ff0000"
    },
    redIcon: {
        color: "red",
        fontSize: 24
    }
})

const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor ,
        padding: 16
    },

    status: {
        flex: 1,
        paddingRight: 8,
        fontFamily: textFonts.regular  ,
        color : darkTheme.textColor 
    }, 
}