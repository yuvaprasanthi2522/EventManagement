import { Platform } from "react-native";
import Constants from "expo-constants";

/* ---------- BASE URL ---------- */
const getBaseUrl = () => {
    // 🌐 Web
    if (Platform.OS === "web") {
        return "http://localhost:5000/api/events";
    }

    // 📱 Mobile (Expo Go / Physical device)
    const debuggerHost =
        Constants.expoGoConfig?.debuggerHost ??
        Constants.manifest2?.extra?.expoGo?.debuggerHost;

    if (debuggerHost) {
        const host = debuggerHost.split(":")[0];
        return `http://${host}:5000/api/events`;
    }

    return "http://10.0.2.2:5000/api/events";
};

export const BASE_URL = getBaseUrl();

export const addEvent = async (data: any) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to add event");
    }

    return res.json();
};

export const getAllEvents = async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
};

export const getEventById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch event");
    return res.json();
};

export const updateEvent = async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update event");
    return res.json();
};

export const deleteEvent = async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete event");
    return res.json();
};

export const searchEvents = async (keyword: string) => {
    const res = await fetch(`${BASE_URL}/search?keyword=${keyword}`);
    if (!res.ok) throw new Error("Search failed");
    return res.json();
};
