const Event = require("../models/Event");
const addEvent = async (req, res) => {
    try {
        let {
            name,
            date,
            time,
            amount,
            description,
            category,
        } = req.body;
        amount = Number(amount);
        if (!name || !date || !time || !category || isNaN(amount)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const event = new Event({
            name,
            date,
            time,
            amount,
            description: description || "",
            category,
        });

        const saved = await event.save();
        res.status(201).json(saved);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            { ...req.body, amount: Number(req.body.amount) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        console.log("cvfcbcfv");
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const searchEvents = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) return res.json([]);

        const events = await Event.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } }
            ],
        });

        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    searchEvents,
};
