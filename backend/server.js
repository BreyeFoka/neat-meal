import express from "express"
import "dotenv/config"
const App = express()
const PORT = process.env.PORT || 3000

App.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
