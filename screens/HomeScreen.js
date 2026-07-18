import { Text, View } from "react-native";

const HomeScreen = (prop) => {
    return(
        <View>
            <Text style={{color:'#333'}}>{prop.name}</Text>
        </View>
    )
}

export { HomeScreen };

