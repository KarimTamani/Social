import { useCallback, useContext } from "react";
import { View , Text , StyleSheet , TouchableOpacity} from "react-native" ; 
import { AuthContext } from "../../providers/AuthContext";


export default function AuthButton({ onPress , children  , navigation , style}) { 

    const auth = useContext(AuthContext)

    const handleClick = useCallback(() => { 
        (
            async() => { 
                const userAuth = await auth.getUserAuth() ; 
                
                if (userAuth) 
                    onPress() ; 
                else 
                    navigation.navigate('AuthRoute') ; 
            }
        )()


    } , [navigation , onPress])

    return(
        <TouchableOpacity onPress={handleClick} style={style}>
            {children}
        </TouchableOpacity>
    )
}