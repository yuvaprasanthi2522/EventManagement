import {
    View,
    Text,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getEventById, updateEvent, deleteEvent } from "../services/api";

export default function Edit() {
    const { id }: any = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", category: "", date: "", time: "", amount: "", description: "" });
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getEventById(id);
                setForm({ name: data.name || "", category: data.category || "", date: data.date || "", time: data.time || "", amount: String(data.amount || ""), description: data.description || "" });
                setLoading(false);
            } catch { Alert.alert("Error", "Failed to load event"); setLoading(false); }
        };
        load();
    }, [id]);

    const update = async () => {
        const { name, date, time, amount, category } = form;
        if (!name || !date || !time || !amount || !category) { Alert.alert("Error", "All required fields must be filled"); return; }
        if (isNaN(Number(amount))) { Alert.alert("Error", "Amount must be numeric"); return; }
        try { await updateEvent(id, { ...form, amount: Number(form.amount) }); Alert.alert("Success", "Event updated"); router.replace("/(tabs)"); }
        catch { Alert.alert("Error", "Failed to update event"); }
    };

    const remove = () => {
        Alert.alert("Confirm", "Delete this event?", [{ text: "Cancel" }, { text: "Delete", style: "destructive", onPress: async () => { try { await deleteEvent(id); router.replace("/(tabs)"); } catch { Alert.alert("Error", "Failed to delete"); } } }]);
    };

    const onDateChange = (e: any, d?: Date) => {
        setShowDate(Platform.OS === "ios");
        if (d) setForm({ ...form, date: d.toISOString().split("T")[0] });
    };

    const onTimeChange = (e: any, t?: Date) => {
        setShowTime(Platform.OS === "ios");
        if (t) {
            let h = t.getHours();
            const m = t.getMinutes();
            const ap = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            setForm({ ...form, time: `${h}:${m < 10 ? "0" + m : m} ${ap}` });
        }
    };

    if (loading) return <View style={s.loading}><ActivityIndicator size="large" color="#0891B2" /><Text style={s.loadTxt}>Loading...</Text></View>;

    return (
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <View style={s.card}>
                <Text style={s.title}>Edit Event</Text>
                <View style={s.line} />
                <View style={s.field}>
                    <Text style={s.label}>Name</Text>
                    <TextInput placeholder="Event name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} style={s.input} placeholderTextColor="#999" />
                </View>
                <View style={s.row}>
                    <View style={s.half}>
                        <Text style={s.label}>Date</Text>
                        {Platform.OS === "web" ? (
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ border: "1px solid #DDD", backgroundColor: "#FAFAFA", padding: "10px 12px", borderRadius: 4, fontSize: 14, width: "100%" }} />
                        ) : (
                            <TouchableOpacity style={s.picker} onPress={() => setShowDate(true)}>
                                <Text style={[s.pickTxt, form.date && s.sel]}>{form.date || "Select date"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={s.half}>
                        <Text style={s.label}>Time</Text>
                        {Platform.OS === "web" ? (
                            <input type="time" onChange={(e) => { const [h, m] = e.target.value.split(":"); let hr = parseInt(h); const ap = hr >= 12 ? "PM" : "AM"; hr = hr % 12 || 12; setForm({ ...form, time: `${hr}:${m} ${ap}` }); }} style={{ border: "1px solid #DDD", backgroundColor: "#FAFAFA", padding: "10px 12px", borderRadius: 4, fontSize: 14, width: "100%" }} />
                        ) : (
                            <TouchableOpacity style={s.picker} onPress={() => setShowTime(true)}>
                                <Text style={[s.pickTxt, form.time && s.sel]}>{form.time || "Select time"}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {showDate && Platform.OS !== "web" && <DateTimePicker value={new Date()} mode="date" onChange={onDateChange} />}
                {showTime && Platform.OS !== "web" && <DateTimePicker value={new Date()} mode="time" is24Hour={false} onChange={onTimeChange} />}
                <View style={s.field}>
                    <Text style={s.label}>Amount</Text>
                    <TextInput placeholder="Enter amount" keyboardType="numeric" value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v.replace(/[^0-9]/g, "") })} style={s.input} placeholderTextColor="#999" />
                </View>
                <View style={s.field}>
                    <Text style={s.label}>Category</Text>
                    <TextInput placeholder="Event category" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} style={s.input} placeholderTextColor="#999" />
                </View>
                <View style={s.field}>
                    <Text style={s.label}>Description</Text>
                    <TextInput placeholder="Event description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline style={[s.input, s.area]} placeholderTextColor="#999" />
                </View>
                <View style={s.btnRow}>
                    <TouchableOpacity style={s.updBtn} onPress={update}><Text style={s.updTxt}>✓ Update</Text></TouchableOpacity>
                    <TouchableOpacity style={s.delBtn} onPress={remove}><Text style={s.delTxt}>🗑️ Delete</Text></TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" },
    loadTxt: { marginTop: 12, fontSize: 16, color: "#666" },
    scroll: { padding: 20, paddingBottom: 40, backgroundColor: "#F5F5F5" },
    card: { backgroundColor: "#FFF", borderRadius: 8, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    title: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 },
    line: { height: 1, backgroundColor: "#E0E0E0", marginBottom: 20 },
    field: { marginBottom: 16 },
    label: { fontSize: 13, color: "#666", marginBottom: 6, fontWeight: "500" },
    input: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4, fontSize: 14, color: "#333" },
    row: { flexDirection: "row", gap: 12, marginBottom: 16 },
    half: { flex: 1 },
    picker: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4 },
    pickTxt: { fontSize: 14, color: "#999" },
    sel: { color: "#333" },
    area: { height: 80, textAlignVertical: "top", paddingTop: 10 },
    btnRow: { flexDirection: "row", gap: 12, marginTop: 8 },
    updBtn: { flex: 1, backgroundColor: "#10B981", paddingVertical: 12, borderRadius: 4, alignItems: "center" },
    updTxt: { color: "#FFF", fontSize: 14, fontWeight: "600" },
    delBtn: { flex: 1, backgroundColor: "#EF4444", paddingVertical: 12, borderRadius: 4, alignItems: "center" },
    delTxt: { color: "#FFF", fontSize: 14, fontWeight: "600" },
});
