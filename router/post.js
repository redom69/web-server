const express = require("express")
const multiparty = require("connect-multiparty")

const PostController = require("../controllers/post")
const md_auth = require("../middlewares/authenticated")

const api = express.Router()
const md_upload = multiparty({ uploadDir: "./uploads/avatar" })


api.post("/post", [md_auth.asureAuth, md_upload], PostController.createPost)
api.get("/posts", PostController.getPosts)
api.patch("/post/:id", [md_auth.asureAuth, md_upload], PostController.updatePost)
api.delete("/post/:id", [md_auth.asureAuth, md_upload], PostController.deletePost)


module.exports = api