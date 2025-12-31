const express = require("express");
const router = express.Router();

const {
    addEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    searchEvents,
} = require("../controllers/eventController");

router.post("/", addEvent);
router.get("/", getAllEvents);
router.get("/search", searchEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
