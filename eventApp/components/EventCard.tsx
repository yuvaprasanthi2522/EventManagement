import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function EventCard({ event }: any) {
    return (
        <View style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{event.name}</Text>
            <Text>{event.category}</Text>
            <Text>{event.date} | {event.time}</Text>
            <Text>₹{event.amount}</Text>

            <Button
                title="View"
                onPress={() => router.push(`/details?id=${event._id}`)}
            />
            <Button
                title="Edit"
                onPress={() => router.push(`/edit?id=${event._id}`)}
            />
        </View>
    );
}
