const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        amount: { type: Number, required: true },
        description: String,
        category: { type: String, required: true },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Event", eventSchema);
