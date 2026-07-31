import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    fetch(`https://lunaview.ir/pr/api/places/detail.php?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  // کامپوننت‌های کمکی برای خلوت شدن کد اصلی
  const InfoRow = ({ icon, label, value }: any) => (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={20} color="#0cb645" />
      <Text style={styles.infoLabel}>{label}: </Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const FeatureBadge = ({ label, active }: any) => (
    <View style={styles.featureBadge}>
      <MaterialIcons
        name={active ? "check-circle" : "cancel"}
        size={18}
        color={active ? "#0cb645" : "#ccc"}
      />
      <Text style={{ marginLeft: 5, color: active ? "#333" : "#999" }}>
        {label}
      </Text>
    </View>
  );

  const Chip = ({ title, color = "#e0e0e0" }: any) => (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <Text style={styles.chipText}>{title}</Text>
    </View>
  );
  const dynamicStyles = StyleSheet.create({
    slide: {
      width: width,
      height: height * 0.7,
    },
    // بقیه استایل‌ها را هم اینجا بگذار یا در StyleSheet معمولی نگه دار
  });
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: data.images[0].image }}
        style={styles.headerImage}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <View style={styles.overlay}></View>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.category}>{data.category}</Text>

          {data.images && data.images.length > 1 && (
            <Pressable
              style={styles.galleryButton}
              onPress={() => setVisible(true)}
            >
              <Ionicons name="images-outline" size={18} color="#fff" />
              <Text style={styles.galleryButtonText}>مشاهده تصاویر</Text>
            </Pressable>
          )}
        </LinearGradient>
      </ImageBackground>
      {/* modall*/}

      <Modal
        visible={visible}
        animationType="fade" // برای گالری fade نرم‌تر از slide است
        transparent={true} // بسیار مهم برای ایجاد حالت سینمایی
      >
        <View style={styles.modalOverlay}>
          {/* دکمه بستن - قرار دادن در بالا سمت راست/چپ برای دسترسی راحت */}
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>گالری تصاویر</Text>
            <Pressable
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </Pressable>
          </View>

          <FlatList
            data={data.images}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={dynamicStyles.slide}
                  resizeMode="contain" // تغییر از cover به contain برای دیدن کامل تصویر بدون برش
                />
              </View>
            )}
          />

          {/* شمارنده تصویر (مثلاً 1/5) - اختیاری اما بسیار شیک */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {/* اینجا می‌توانی ایندکس فعلی را از FlatList بگیری */}
              تصویر
            </Text>
          </View>
        </View>
      </Modal>

      {/* end modal*/}
      <View style={styles.content}>
        <Text style={styles.description}>{data.description}</Text>

        {/* اطلاعات پایه و مسیر */}
        <View style={styles.card}>
          <InfoRow
            icon="access-time"
            label="زمان بازدید"
            value={data.visit_time}
          />
          <InfoRow
            icon="directions-car"
            label="نوع مسیر"
            value={data.road.type}
          />
          <InfoRow
            icon="tune"
            label="دشواری مسیر"
            value={data.road.difficulty}
          />
          <InfoRow
            icon="terrain"
            label="ارتفاع"
            value={`${data.location.altitude} متر`}
          />
        </View>

        {/* ویژگی‌های مکان */}
        <Text style={styles.sectionTitle}>ویژگی‌های مکان</Text>
        <View style={styles.rowWrap}>
          <FeatureBadge
            label="ثبت ملی"
            active={data.features.national_registered}
          />
          <FeatureBadge
            label="مناسب کودکان"
            active={data.features.suitable_children}
          />
          <FeatureBadge
            label="مناسب سالمندان"
            active={data.features.suitable_elderly}
          />
          <FeatureBadge
            label="دسترسی ویلچر"
            active={data.features.wheelchair_access}
          />
        </View>

        {/* دسته‌بندی‌ها */}
        <Text style={styles.sectionTitle}>مناسب برای فصل‌ها و افراد</Text>
        <View style={styles.chipContainer}>
          {data.seasons.map((s: any) => (
            <Chip key={s.id} title={s.title} color="#d1ecf1" />
          ))}
          {data.visitors.map((v: any) => (
            <Chip key={v.id} title={v.title} color="#fff3cd" />
          ))}
        </View>

        {/* تفکیک امکانات و تجهیزات */}
        <Text style={styles.sectionTitle}>امکانات رفاهی</Text>
        <View style={styles.chipContainer}>
          {data.facilities.map((f: any) => (
            <Chip key={f.id} title={f.title} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>تجهیزات مورد نیاز</Text>
        <View style={styles.chipContainer}>
          {data.equipments.map((e: any) => (
            <Chip key={e.id} title={e.title} color="#e2e3e5" />
          ))}
        </View>

        {/* اقامتگاه */}
        {data.features.has_stay && (
          <View style={[styles.card, { backgroundColor: "#e8f5e9" }]}>
            <Text style={styles.sectionTitle}>امکان اقامت در محل</Text>
            {data.accommodations.map((acc: any) => (
              <Text key={acc.id} style={styles.accText}>
                • {acc.title}
              </Text>
            ))}
          </View>
        )}

        {/* هشدارها */}
        {data.warnings.length > 0 && (
          <View style={styles.warningBox}>
            <MaterialIcons name="warning" size={20} color="#d9534f" />
            <Text style={styles.warningText}>{data.warnings[0].title}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerImage: { width: "100%", height: 300, justifyContent: "flex-end" },
  gradient: { padding: 20, paddingTop: 100 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  category: { fontSize: 16, color: "#ddd" },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#f9f9f9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row-reverse", // راست چین چپ چین
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: { fontWeight: "bold", marginLeft: 5, color: "#555" },
  infoValue: { color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#333",
  },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 13, color: "#333" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  featureBadge: {
    flexDirection: "row-reverse", // راست چین ، چپ چین
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  accText: { fontSize: 14, color: "#2e7d32", marginBottom: 5 },
  warningBox: {
    backgroundColor: "#fff0f0",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffcccc",
    marginBottom: 20,
  },
  warningText: { marginLeft: 10, color: "#d9534f", fontWeight: "600" },

  //new

  headerImageRadius: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  galleryButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 240,
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  galleryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  //

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)", // پس‌زمینه مشکی با شفافیت کم
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row-reverse", // برای چیدمان راست به چپ در فارسی
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // فاصله از بالای صفحه
    zIndex: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },

  counterContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  counterText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
});
