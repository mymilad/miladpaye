import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Place } from "../types";
//https://lunaview.ir/pr/api/places/explore.php?page=1
export default function TabTwoScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { width } = Dimensions.get("window");
  const tameApps = "lite";
  const [textColor, setTextColor] = useState("#0000");
  const [background_color, setBackground_color] = useState("#ffffff");
  const [background_color_back, setBackground_color_back] = useState("#e4e4e4");
  const [page, setPage] = useState(1);
  const [Refreshing, setRefreshing] = useState(false);
  const [total_pages, setTotal_pages] = useState(1);
  useEffect(() => {
    getData();
    if (tameApps == "lite") {
      setTextColor("#000000");
      setBackground_color("#ffffff");
      setBackground_color_back("#f3f3f3");
    } else if (tameApps == "darck") {
      setTextColor("#ffffff");
      setBackground_color("#000000");
      setBackground_color_back("#1d1d1d");
    }
  }, []);
  const nexGetData = async () => {
    if (page < total_pages) {
      setRefreshing(true);
      const nexPage = page + 1;
      try {
        const response = await fetch(
          "https://lunaview.ir/pr/api/places/explore.php?page=" + nexPage,
        );
        const json = await response.json();
        setPlaces((prev) => [...prev, ...json.data]);

        setTotal_pages(json.total_pages);
        setPage(json.page);
        console.log(json.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setRefreshing(false);
        setLoading(false); // وقتی کار تمام شد، لودینگ را غیرفعال کن
      }
    }
  };
  const getData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(
        "https://lunaview.ir/pr/api/places/explore.php?page=" + page,
      );
      const json = await response.json();
      setPlaces(json.data);
      console.log(json.data);
      setTotal_pages(json.total_pages);
      setPage(json.page);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setRefreshing(false);
      setLoading(false); // وقتی کار تمام شد، لودینگ را غیرفعال کن
    }

    if (loading) return <ActivityIndicator size="large" />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: background_color_back }}>
      <StatusBar backgroundColor={"#333"} hidden={false} />
      <View style={[Styles.viewSearch, { backgroundColor: background_color }]}>
        <TouchableOpacity style={Styles.touchSearch}>
          <Ionicons name="search" size={24} color={textColor} />
        </TouchableOpacity>
        <TextInput
          style={[
            Styles.textInput,
            { color: textColor, backgroundColor: background_color },
          ]}
          placeholder="جستجوی مکان ..."
          placeholderTextColor={textColor}
        ></TextInput>
      </View>
      <FlatList
        // حذف width: 100% اضافی، خود ویو به صورت پیش‌فرض پر می‌کند
        style={{ backgroundColor: background_color_back }}
        keyExtractor={(item, index) => index.toString()}
        data={places}
        onEndReached={nexGetData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={Refreshing} onRefresh={getData} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              router.push({ pathname: "/detail", params: { id: item.id } });
            }}
          >
            <View
              style={[
                Styles.cardprocted,
                { backgroundColor: background_color },
              ]}
            >
              <Image
                source={{ uri: item.cover_image }}
                style={{
                  width: "100%", // عرض برابر با عرض والد (cardprocted)
                  aspectRatio: 1, // نسبت تصویر (1 یعنی مربع، 16/9 برای عریض، 4/3 برای معمولی)
                  borderRadius: 40,
                }}
                resizeMode="cover" // استفاده از cover باعث می‌شود تصویر کل فضای تعیین شده را پر کند بدون تغییر شکل
              />
              <Text
                numberOfLines={1}
                style={[Styles.titel, { color: textColor }]}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={3}
                style={[Styles.shortDescription, { color: textColor }]}
              >
                {item.short_description}
              </Text>
              <Text style={{ color: textColor, marginHorizontal: 10 }}>
                دسته بندی : {item.category}
              </Text>
            </View>
          </TouchableOpacity>
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
    borderRadius: 40,

    width: "100%",
    alignSelf: "center",
    padding: 5,
    margin: 30,
    elevation: 10,
  },
  titel: {
    alignSelf: "stretch",
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
    textAlign: "auto",
  },
  shortDescription: {
    margin: 10,
    alignSelf: "stretch",
    textAlign: "auto",
    color: "#000000",
  },
  secondView: {
    margin: "auto",
  },
  viewSearch: {
    flexDirection: "row",
    height: 45,
    borderWidth: 0.1,
    borderColor: "#7a7a7a",
    alignItems: "center",
    margin: 4,
    borderRadius: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: "90%",
    marginLeft: 5,
    paddingHorizontal: 12,
    textAlign: "auto",
    writingDirection: "rtl",
    borderRadius: 15,
  },
  touchSearch: {
    marginLeft: 10,
  },
});
