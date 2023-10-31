const express = require("express")

const NewsletterSchema = require("../controllers/newsletter")
const md_auth = require("../middlewares/authenticated")

const api = express.Router()

api.post("/newsletter", NewsletterSchema.subscribeEmail)
api.get("/newsletters", [md_auth.asureAuth], NewsletterSchema.getNewsletters)
api.delete("/newsletter/:id", [md_auth.asureAuth], NewsletterSchema.deleteNewsletter)

module.exports = api