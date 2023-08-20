import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import LoadingActivity from "./post/loadingActivity";


export default function CategoryPicker({ onSelect }) {

    const [categories, setCategories] = useState([]);

    const client = useContext(ApolloContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        client.query({
            query: gql`
            query GetCategories {
                getCategories {
                  id
                  name
                }
              }

            
            `
        }).then(response => {
            setLoading(false);
            if (response && response.data) {
                setCategories(response.data.getCategories);

                console.log(response.data.getCategories);
            }
        }).catch(error => {
            setLoading(false);
        })
    }, [])

    

    return (
        <View style={styles.container}>
            {
                !loading &&

                <ScrollView>
                    {
                        categories.map(category => (
                            <TouchableOpacity key = {category.id} style = {styles.category} onPress={ () => onSelect && onSelect(category)}>
                                <Text style={styles.categoryName}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            }

            {
                loading &&
                <LoadingActivity />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    } , 

    category : {
        padding : 16 , 
        paddingVertical : 8 , 
        borderBottomColor : "#eee" , 
        borderBottomWidth : 1
        
    }
})