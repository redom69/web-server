const express = require("express")
const multiparty = require("connect-multiparty")

const CourseController = require("../controllers/course")
const md_auth = require("../middlewares/authenticated")

const api = express.Router()
const md_upload = multiparty({ uploadDir: "./uploads/avatar" })


api.post("/course", [md_auth.asureAuth, md_upload], CourseController.createCourse)
api.get("/courses", CourseController.getCourses)
api.patch("/course/:id", [md_auth.asureAuth, md_upload], CourseController.updateCourse)
api.delete("/course/:id", [md_auth.asureAuth, md_upload], CourseController.deleteCourse)


module.exports = api