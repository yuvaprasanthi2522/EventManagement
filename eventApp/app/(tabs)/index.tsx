import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { getAllEvents, searchEvents, deleteEvent } from "../../services/api";
import { getCategoryImage, getCategoryName } from "../Categories";
import EventDetailModal from "../Details";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 600;
const numColumns = isSmallScreen ? 1 : 2;
const CARD_WIDTH = isSmallScreen ? width - 32 : (width - 48) / 2;

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(useCallback(() => { loadEvents(); }, []));

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) { loadEvents(); return; }
    try {
      const data = await searchEvents(keyword);
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    loadEvents();
  };

  const openModal = (event: any) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>EventManager</Text>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/AddEvent")}>
          <Text style={styles.navIcon}>➕</Text>
          <Text style={styles.navText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search events..."
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item, i) => item?._id?.toString() || i.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={!isSmallScreen ? styles.row : undefined}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: CARD_WIDTH }]}>
            <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.9}>
              <Image source={{ uri: getCategoryImage(item.category) }} style={styles.cardImage} resizeMode="cover" />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{getCategoryName(item.category)}</Text>
              </View>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateIcon}>🕐</Text>
                  <Text style={styles.dateText}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.amountBadge}>
                <Text style={styles.amountText}>₹{item.amount}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => router.push(`/EditEvent?id=${item._id}`)} style={styles.editBtn}>
                  <Text style={styles.actionBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                  <Text style={styles.actionBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptySubtitle}>Add your first event to get started</Text>
          </View>
        }
      />

      <EventDetailModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={() => { setModalVisible(false); setSelectedEvent(null); }}
        onDelete={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18, color: "#6B7280" },
  navbar: { backgroundColor: "#F97316", paddingHorizontal: 20, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 },
  navTitle: { fontSize: 22, fontWeight: "700", color: "#FFF", letterSpacing: 0.5 },
  navItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  navIcon: { fontSize: 16, color: "#FFF" },
  navText: { fontSize: 15, fontWeight: "500", color: "#FFF" },
  searchContainer: { backgroundColor: "#FFF", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  searchIcon: { fontSize: 16, color: "#9CA3AF" },
  searchInput: { flex: 1, fontSize: 15, color: "#1F2937", padding: 0 },
  searchBtn: { backgroundColor: "#f6ad55", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  searchBtnText: { color: "#FFF", fontWeight: "600", fontSize: 14 },
  listContent: { padding: 16 },
  row: { justifyContent: "space-between", gap: 12, marginBottom: 16 },
  card: { backgroundColor: "#FFF", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 16 },
  cardImage: { width: "100%", height: 200, backgroundColor: "#E5E7EB" },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8, minHeight: 40 },
  categoryBadge: { backgroundColor: "#DBEAFE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: "flex-start", marginBottom: 8 },
  categoryText: { color: "#1E40AF", fontSize: 10, fontWeight: "600" },
  dateTimeContainer: { marginBottom: 8 },
  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  dateIcon: { fontSize: 12, marginRight: 4 },
  dateText: { fontSize: 12, color: "#6B7280", flex: 1 },
  amountBadge: { backgroundColor: "#D1FAE5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginBottom: 8, alignItems: "center" },
  amountText: { color: "#065F46", fontWeight: "700", fontSize: 14 },
  actions: { flexDirection: "row", gap: 6 },
  editBtn: { flex: 1, backgroundColor: "#F59E0B", borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  deleteBtn: { flex: 1, backgroundColor: "#EF4444", borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  actionBtnText: { color: "#FFF", fontSize: 16 },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 80, width: "100%" },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: "#6B7280", fontSize: 16 },
  emptySubtitle: { color: "#9CA3AF", fontSize: 14, marginTop: 4 },
});