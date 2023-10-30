const Course = require("../models/course")
const image = require("../utils/image")

async function createCourse(req, res) {
    const course = new Course(req.body)

    const imgPath = image.getFilePath(req.files.miniature)
    course.miniature = imgPath

    const saved = await course.save();
    if (saved) {
        return res.status(200).send(saved);
    } else {
        return res.status(400).send("Error al crear curso");
    }
}


async function getCourses(req, res) {
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    Course.paginate({}, options)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials.",
            });
        });


}

async function updateCourse(req, res) {
    const { id } = req.params
    const cursoData = req.body

    if (req.files.avatar) {
        const imageName = image.getFilePath(req.files.avatar)
        userData.avatar = imageName
    }

    const updated = await Course.findByIdAndUpdate({ _id: id }, cursoData)

    if (updated) {
        return res.status(200).send({ msg: "Course actualizado correctamente", updated });
    } else {
        return res.status(400).send("Error al actualizar el curso");
    }

}

async function deleteCourse(req, res) {
    const { id } = req.params

    const deleted = await Course.findByIdAndDelete({ _id: id })
    if (deleted) {
        return res.status(200).send({ msg: "Course eliminado correctamente", deleted });
    } else {
        return res.status(400).send("Error al borrar el curso");
    }
}

module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
}