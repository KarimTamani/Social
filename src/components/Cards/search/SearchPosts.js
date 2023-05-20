import {View , Text , StyleSheet} from "react-native" ; 


export default function SearchPosts({type , query}) { 

    return(
        <View style = {styles.container} >  

<Text>Search Posts {type} </Text>
        </View>
    )


} ; 

const styles = StyleSheet.create({
    container : {
        flex : 1
    }
})