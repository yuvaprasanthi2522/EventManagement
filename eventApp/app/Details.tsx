import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView } from "react-native";
import { router } from "expo-router";
import { getCategoryImage, getCategoryName } from "./Categories";

interface EventDetailModalProps {
    visible: boolean;
    event: any;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export default function EventDetailModal({ visible, event, onClose, onDelete }: EventDetailModalProps) {
    if (!event) return null;

    const handleEdit = () => {
        onClose();
        router.push(`/EditEvent?id=${event._id}`);
    };

    const handleDelete = () => {
        onClose();
        onDelete(event._id);
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={s.content}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Image source={{ uri: getCategoryImage(event.category) }} style={s.img} resizeMode="cover" />
                        <View style={s.header}>
                            <Text style={s.title}>{event.name}</Text>
                            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
                                <Text style={s.closeTxt}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={s.body}>
                            <View style={s.badgeRow}>
                                <View style={s.catBadge}>
                                    <Text style={s.catTxt}>{getCategoryName(event.category)}</Text>
                                </View>
                                <View style={s.amtBadge}>
                                    <Text style={s.amtTxt}>₹{event.amount}</Text>
                                </View>
                            </View>

                            <View style={s.infoRow}>
                                <View style={s.infoItem}>
                                    <Text style={s.infoIcon}>📅</Text>
                                    <View>
                                        <Text style={s.infoLabel}>Date</Text>
                                        <Text style={s.infoVal}>{event.date}</Text>
                                    </View>
                                </View>
                                <View style={s.infoItem}>
                                    <Text style={s.infoIcon}>🕐</Text>
                                    <View>
                                        <Text style={s.infoLabel}>Time</Text>
                                        <Text style={s.infoVal}>{event.time}</Text>
                                    </View>
                                </View>
                            </View>

                            {event.description && (
                                <View style={s.descBox}>
                                    <Text style={s.descLabel}>Description</Text>
                                    <Text style={s.descTxt}>{event.description}</Text>
                                </View>
                            )}

                            {event.location && (
                                <View style={s.locBox}>
                                    <Text style={s.locIcon}>📍</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.locLabel}>Location</Text>
                                        <Text style={s.locTxt}>{event.location}</Text>
                                    </View>
                                </View>
                            )}

                            <View style={s.actions}>
                                <TouchableOpacity onPress={handleEdit} style={s.editBtn}>
                                    <Text style={s.actIcon}>✏️</Text>
                                    <Text style={s.actTxt}>Edit Event</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDelete} style={s.delBtn}>
                                    <Text style={s.actIcon}>🗑️</Text>
                                    <Text style={s.actTxt}>Delete Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
    content: { backgroundColor: "#FFF", borderRadius: 20, maxWidth: 500, width: "100%", maxHeight: "90%", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
    img: { width: "100%", height: 250, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: "#E5E7EB" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: 20, paddingBottom: 12 },
    title: { fontSize: 22, fontWeight: "700", color: "#111827", flex: 1, paddingRight: 12 },
    closeBtn: { backgroundColor: "#F3F4F6", width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
    closeTxt: { fontSize: 20, color: "#6B7280", fontWeight: "600" },
    body: { paddingHorizontal: 20, paddingBottom: 20 },
    badgeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    catBadge: { backgroundColor: "#DBEAFE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    catTxt: { color: "#1E40AF", fontSize: 11, fontWeight: "600" },
    amtBadge: { backgroundColor: "#D1FAE5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    amtTxt: { color: "#065F46", fontWeight: "700", fontSize: 14 },
    infoRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    infoItem: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, gap: 8 },
    infoIcon: { fontSize: 20 },
    infoLabel: { fontSize: 11, color: "#6B7280", fontWeight: "600", marginBottom: 2 },
    infoVal: { fontSize: 14, color: "#111827", fontWeight: "600" },
    descBox: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 16 },
    descLabel: { fontSize: 12, fontWeight: "700", color: "#6B7280", marginBottom: 8, letterSpacing: 0.5 },
    descTxt: { fontSize: 14, color: "#374151", lineHeight: 20 },
    locBox: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#FEF3C7", padding: 12, borderRadius: 12, marginBottom: 16, gap: 8 },
    locIcon: { fontSize: 18 },
    locLabel: { fontSize: 11, fontWeight: "600", color: "#92400E", marginBottom: 2 },
    locTxt: { fontSize: 14, color: "#78350F", fontWeight: "500" },
    actions: { flexDirection: "row", gap: 8 },
    editBtn: { flex: 1, backgroundColor: "#F59E0B", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, gap: 6 },
    delBtn: { flex: 1, backgroundColor: "#EF4444", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 12, gap: 6 },
    actIcon: { fontSize: 18 },
    actTxt: { color: "#FFF", fontSize: 15, fontWeight: "600" },
});