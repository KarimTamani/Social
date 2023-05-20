import {View , Text , StyleSheet} from "react-native" ; 


export default function SearchHashTags({query }) { 

    return(
        <View style = {styles.container} >
<Text>Search Hashtags </Text>
        </View>
    )


} ; 

const styles = StyleSheet.create({
    container : {
        flex : 1
    }
})