import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from "react-native";

export default function TabTwoScreen() {
  const [dataLists, setDataList] = useState([]);
  const Os = Platform.OS
  const {width,height} = Dimensions.get('screen')
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const json = await response.json();
      setDataList(json);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      //setLoading(false); // وقتی کار تمام شد، لودینگ را غیرفعال کن
    }
  };
  return (
    <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
      <StatusBar backgroundColor={"#333"} hidden={false} />
      <FlatList
        style={{ width: "100%" }}
        keyExtractor={(item, index) => index.toString()}
        data={dataLists}
        renderItem={({ item }) => (
          <View style={Styles.cardprocted}>
            <Image
              source={{ uri: item.image }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 16, fontWeight: "bold", margin: 10 }}>
              {item.title}
            </Text>
            <Text style={{ margin: 10 }}>{item.description}</Text>
            <Text style={{ color: "#007a06" }}> {item.price} $</Text>
          </View>
        )}
      />
    </View>
  );
}
const Styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardprocted: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
    width: 500,
    alignSelf: "center",
    margin: 30,
    elevation: 10,
  },
  secondView: {
    margin: "auto",
  },
});
