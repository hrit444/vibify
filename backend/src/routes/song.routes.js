const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songModel = require("../models/song.model");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/songs", upload.single("audio"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const fileData = await uploadFile(req.file);

  const song = await songModel.create({
    title: req.body.title,
    artist: req.body.artist,
    audio: fileData.url,
    mood: req.body.mood
  });

  res.status(201).json({
    message: "Song created successfully",
    song: song,
  });
});

router.get("/songs", async (req,res)=>{
  const {mood} = req.query
  const song = await songModel.find({
    mood: mood
  })

  res.status(200).json({
    message: "Song fetched successfully",
    song: song
  })
})

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Welcome to the AI Mood-Based Music Player API",
  });
})

module.exports = router;
