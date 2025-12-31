import { View, Text, TextInput, Alert, Platform, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addEvent } from "../services/api";
import { EVENT_CATEGORIES } from "./Categories";

export default function AddEvent() {
    const [form, setForm] = useState({ name: "", date: "", time: "", amount: "", category: "", description: "" });
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const submit = async () => {
        console.log("cxfvc")
        const { name, date, time, amount, category, description } = form;
        if (!name || !date || !time || !amount || !category || !description) {
            console.log("All fields are required");
            return;
        }
        console.log("ddc")
        if (isNaN(Number(amount))) {
            console.log("vdfxcvdc")
            return;
        }
        try {
            console.log("dc vdxcv v")
            await addEvent({ ...form, amount: Number(amount) });
            console.log("fvdfv d")
            router.replace("/(tabs)");
        }
        catch { Alert.alert("Error", "Backend connection failed"); }
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

    const selectCategory = (categoryId: string) => { setForm({ ...form, category: categoryId }); setShowCategoryModal(false); };
    const getSelectedCategoryName = () => { const cat = EVENT_CATEGORIES.find(c => c.id === form.category); return cat ? cat.name : "Select category"; };

    return (
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <View style={s.card}>
                <Text style={s.title}>Add Event</Text>
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
                    <TouchableOpacity style={s.picker} onPress={() => setShowCategoryModal(true)}>
                        <Text style={[s.pickTxt, form.category && s.sel]}>{getSelectedCategoryName()}</Text>
                        <Text style={s.arrow}>▼</Text>
                    </TouchableOpacity>
                </View>
                <View style={s.field}>
                    <Text style={s.label}>Description</Text>
                    <TextInput placeholder="Event description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline style={[s.input, s.area]} placeholderTextColor="#999" />
                </View>
                <TouchableOpacity style={s.btn} onPress={submit}>
                    <Text style={s.btnTxt}>Submit</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
                <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
                    <View style={s.modalContent}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>Select Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Text style={s.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={s.categoryList}>
                            {EVENT_CATEGORIES.map((cat) => (
                                <TouchableOpacity key={cat.id} style={[s.categoryItem, form.category === cat.id && s.selectedCategory]} onPress={() => selectCategory(cat.id)}>
                                    <Text style={[s.categoryItemText, form.category === cat.id && s.selectedCategoryText]}>{cat.name}</Text>
                                    {form.category === cat.id && <Text style={s.checkmark}>✓</Text>}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    scroll: { padding: 20, paddingBottom: 40, backgroundColor: "#F5F5F5" },
    card: { backgroundColor: "#FFF", borderRadius: 8, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    title: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 },
    line: { height: 1, backgroundColor: "#E0E0E0", marginBottom: 20 },
    field: { marginBottom: 16 },
    label: { fontSize: 13, color: "#666", marginBottom: 6, fontWeight: "500" },
    input: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4, fontSize: 14, color: "#333" },
    row: { flexDirection: "row", gap: 12, marginBottom: 16 },
    half: { flex: 1 },
    picker: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    pickTxt: { fontSize: 14, color: "#999" },
    sel: { color: "#333" },
    arrow: { fontSize: 12, color: "#999" },
    area: { height: 80, textAlignVertical: "top", paddingTop: 10 },
    btn: { backgroundColor: "#333", paddingVertical: 12, borderRadius: 4, alignItems: "center", marginTop: 8 },
    btnTxt: { color: "#FFF", fontSize: 14, fontWeight: "600" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
    modalContent: { backgroundColor: "#FFF", borderRadius: 12, width: "100%", maxWidth: 400, maxHeight: "80%" },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
    modalTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
    closeBtn: { fontSize: 24, color: "#666", fontWeight: "300" },
    categoryList: { maxHeight: 400 },
    categoryItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    selectedCategory: { backgroundColor: "#F0F8FF" },
    categoryItemText: { fontSize: 15, color: "#333" },
    selectedCategoryText: { fontWeight: "600", color: "#007AFF" },
    checkmark: { fontSize: 18, color: "#007AFF", fontWeight: "600" },
});

// import {
//     View,
//     Text,
//     TextInput,
//     Alert,
//     Platform,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
// } from "react-native";
// import { useState } from "react";
// import { router } from "expo-router";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { addEvent } from "../services/api";

// export default function AddEvent() {
//     const [form, setForm] = useState({ name: "", date: "", time: "", amount: "", category: "", description: "" });
//     const [showDate, setShowDate] = useState(false);
//     const [showTime, setShowTime] = useState(false);

//     const submit = async () => {
//         const { name, date, time, amount, category } = form;
//         if (!name || !date || !time || !amount || !category) { Alert.alert("Error", "All required fields must be filled"); return; }
//         if (isNaN(Number(amount))) { Alert.alert("Error", "Amount must be numeric"); return; }
//         try { await addEvent({ ...form, amount: Number(amount) }); Alert.alert("Success", "Event added"); router.replace("/(tabs)"); }
//         catch { Alert.alert("Error", "Backend connection failed"); }
//     };

//     const onDateChange = (e: any, d?: Date) => {
//         setShowDate(Platform.OS === "ios");
//         if (d) setForm({ ...form, date: d.toISOString().split("T")[0] });
//     };

//     const onTimeChange = (e: any, t?: Date) => {
//         setShowTime(Platform.OS === "ios");
//         if (t) {
//             let h = t.getHours();
//             const m = t.getMinutes();
//             const ap = h >= 12 ? "PM" : "AM";
//             h = h % 12 || 12;
//             setForm({ ...form, time: `${h}:${m < 10 ? "0" + m : m} ${ap}` });
//         }
//     };


//     const EVENT_CATEGORIES = [
//         { id: "marriage", name: "Marriage Event" },
//         { id: "birthday", name: "Birthday Event" },
//         { id: "collegefest", name: "College Fest" },
//         { id: "corporate", name: "Corporate Event" },
//         { id: "concert", name: "Concert/Music Event" },
//         { id: "conference", name: "Conference/Seminar" },
//         { id: "party", name: "Party Event" },
//         { id: "sports", name: "Sports Event" },
//         { id: "exhibition", name: "Exhibition/Trade Show" },
//         { id: "workshop", name: "Workshop/Training" }
//     ];

//     return (
//         <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
//             <View style={s.card}>
//                 <Text style={s.title}>Add Event</Text>
//                 <View style={s.line} />
//                 <View style={s.field}>
//                     <Text style={s.label}>Name</Text>
//                     <TextInput placeholder="Event name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} style={s.input} placeholderTextColor="#999" />
//                 </View>
//                 <View style={s.row}>
//                     <View style={s.half}>
//                         <Text style={s.label}>Date</Text>
//                         {Platform.OS === "web" ? (
//                             <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={{ border: "1px solid #DDD", backgroundColor: "#FAFAFA", padding: "10px 12px", borderRadius: 4, fontSize: 14, width: "100%" }} />
//                         ) : (
//                             <TouchableOpacity style={s.picker} onPress={() => setShowDate(true)}>
//                                 <Text style={[s.pickTxt, form.date && s.sel]}>{form.date || "Select date"}</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                     <View style={s.half}>
//                         <Text style={s.label}>Time</Text>
//                         {Platform.OS === "web" ? (
//                             <input type="time" onChange={(e) => { const [h, m] = e.target.value.split(":"); let hr = parseInt(h); const ap = hr >= 12 ? "PM" : "AM"; hr = hr % 12 || 12; setForm({ ...form, time: `${hr}:${m} ${ap}` }); }} style={{ border: "1px solid #DDD", backgroundColor: "#FAFAFA", padding: "10px 12px", borderRadius: 4, fontSize: 14, width: "100%" }} />
//                         ) : (
//                             <TouchableOpacity style={s.picker} onPress={() => setShowTime(true)}>
//                                 <Text style={[s.pickTxt, form.time && s.sel]}>{form.time || "Select time"}</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>
//                 {showDate && Platform.OS !== "web" && <DateTimePicker value={new Date()} mode="date" onChange={onDateChange} />}
//                 {showTime && Platform.OS !== "web" && <DateTimePicker value={new Date()} mode="time" is24Hour={false} onChange={onTimeChange} />}
//                 <View style={s.field}>
//                     <Text style={s.label}>Amount</Text>
//                     <TextInput placeholder="Enter amount" keyboardType="numeric" value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v.replace(/[^0-9]/g, "") })} style={s.input} placeholderTextColor="#999" />
//                 </View>
//                 <View style={s.field}>
//                     <Text style={s.label}>Category</Text>
//                     <TextInput placeholder="Event category" value={form.category} onChangeText={(v) => setForm({ ...form, category: v })} style={s.input} placeholderTextColor="#999" />
//                 </View>
//                 <View style={s.field}>
//                     <Text style={s.label}>Description</Text>
//                     <TextInput placeholder="Event description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline style={[s.input, s.area]} placeholderTextColor="#999" />
//                 </View>
//                 <TouchableOpacity style={s.btn} onPress={submit}>
//                     <Text style={s.btnTxt}>Submit</Text>
//                 </TouchableOpacity>
//             </View>
//         </ScrollView>
//     );
// }

// const s = StyleSheet.create({
//     scroll: { padding: 20, paddingBottom: 40, backgroundColor: "#F5F5F5" },
//     card: { backgroundColor: "#FFF", borderRadius: 8, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
//     title: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 },
//     line: { height: 1, backgroundColor: "#E0E0E0", marginBottom: 20 },
//     field: { marginBottom: 16 },
//     label: { fontSize: 13, color: "#666", marginBottom: 6, fontWeight: "500" },
//     input: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4, fontSize: 14, color: "#333" },
//     row: { flexDirection: "row", gap: 12, marginBottom: 16 },
//     half: { flex: 1 },
//     picker: { borderWidth: 1, borderColor: "#DDD", backgroundColor: "#FAFAFA", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 4 },
//     pickTxt: { fontSize: 14, color: "#999" },
//     sel: { color: "#333" },
//     area: { height: 80, textAlignVertical: "top", paddingTop: 10 },
//     btn: { backgroundColor: "#333", paddingVertical: 12, borderRadius: 4, alignItems: "center", marginTop: 8 },
//     btnTxt: { color: "#FFF", fontSize: 14, fontWeight: "600" },
// });