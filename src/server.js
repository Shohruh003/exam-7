import express from "express"
import dotenv from "dotenv"
import Routers from "./router/router.js"
import fileUpload from "express-fileupload"
import { errorHandlerMiddlewares } from "./middlewares/error.middlewares.js"

dotenv.config()

const app = express()
app.use(express.json())
app.use(fileUpload())
app.use(Routers)
app.use(errorHandlerMiddlewares)

app.all("/*", (req, res, next) => {
  res.status(500).json({
    message: req.url + " is not found"
  })
})

app.listen(2003, console.log(2003))



