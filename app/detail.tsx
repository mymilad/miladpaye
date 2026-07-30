import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.category}>{data.category}</Text>
        </LinearGradient>
      </ImageBackground>

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
});
