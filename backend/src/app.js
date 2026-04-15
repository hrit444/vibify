const express = require("express")
const songRoutes = require("./routes/song.routes")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', songRoutes)
app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

module.exports = app