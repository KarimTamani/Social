import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import darkTheme from "../design-system/darkTheme";
import { textFonts } from "../design-system/font";
import ThemeContext from "../providers/ThemeContext";
import ExploreHeader from "../components/Cards/explore/ExploreHeader";
import SearchUsers from "../components/Cards/search/SearchUsers";
import SearchPosts from "../components/Cards/search/SearchPosts";
import SearchHashTags from "../components/Cards/search/SearchHashTags";
export default function Search({ navigation }) {

    const [filter, setFilter] = useState("people");

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [query, setQuery] = useState("");


    const onQueryChange = useCallback((query) => {
        setQuery(query);
    }, [])



    useEffect(() => {
        console.log(filter);
    }, [filter])


    return (
        <View style={styles.container}>
            <ExploreHeader navigation={navigation} activePage={"Search"} onQueryChange={onQueryChange} />
            <View style={styles.filter}>
                <TouchableOpacity style={styles.tab} onPress={() => setFilter("people")}>
                    <Text style={[styles.tabText, filter == "people" && styles.activeText]}>
                        أشخاص
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => setFilter("notes")}>
                    <Text style={[styles.tabText, filter == "notes" && styles.activeText]}>
                        منشورات
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => setFilter("images")}>
                    <Text style={[styles.tabText, filter == "images" && styles.activeText]}>
                        الصور
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => setFilter("reels")}>
                    <Text style={[styles.tabText, filter == "reels" && styles.activeText]}>
                        فيديوات
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => setFilter("hashtags")}>
                    <Text style={[styles.tabText, filter == "hashtags" && styles.activeText]}>
                    الهاشتاج
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {
                    filter == "people" &&
                    <SearchUsers query={query} navigation = { navigation } />
                }
                {
                    filter == "notes" &&
                    <SearchPosts type={"note"} query={query} />
                }
                {
                    filter == "images" &&
                    <SearchPosts type={"image"} query={query} />
                }
                {
                    filter == "reels" &&
                    <SearchPosts type={"reel"} query={query} />

                }
                {
                    filter == "hashtags" &&
                    <SearchHashTags query={query} />
                }

            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,

    },
    filter: {
        flexDirection: "row-reverse",
        paddingBottom: 8
    },
    tab: {
        flex: 1,
        alignItems: "center"
    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: "#666",
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
    activeText: {
        color: "#1A6ED8",
        borderBottomColor: "#1A6ED8",
        borderBottomWidth: 4,
        fontWeight: "bold"

    },
    content: {
        flex: 1,
        padding : 16 , 
        paddingBottom : 0
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.secondaryBackgroundColor

    },
    tabText: {

        textAlign: "center",
        fontSize: 14,
        color: darkTheme.secondaryTextColor,
        paddingVertical: 8,
        fontFamily: textFonts.medium
    },
}