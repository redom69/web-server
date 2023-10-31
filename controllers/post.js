const Post = require("../models/post")
const image = require("../utils/image")

async function createPost(req, res) {
    const post = new Post(req.body)
    post.created_at = new Date()

    const imgPath = image.getFilePath(req.files.miniature)
    post.miniature = imgPath

    const saved = await post.save();
    if (saved) {
        return res.status(200).send(saved);
    } else {
        return res.status(400).send("Error al crear curso");
    }
}


async function getPosts(req, res) {
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    Post.paginate({}, options)
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

async function updatePost(req, res) {
    const { id } = req.params
    const cursoData = req.body

    if (req.files.avatar) {
        const imageName = image.getFilePath(req.files.avatar)
        userData.avatar = imageName
    }

    const updated = await Post.findByIdAndUpdate({ _id: id }, cursoData)

    if (updated) {
        return res.status(200).send({ msg: "Post actualizado correctamente", updated });
    } else {
        return res.status(400).send("Error al actualizar el curso");
    }

}

async function deletePost(req, res) {
    const { id } = req.params

    const deleted = await Post.findByIdAndDelete({ _id: id })
    if (deleted) {
        return res.status(200).send({ msg: "Post eliminado correctamente", deleted });
    } else {
        return res.status(400).send("Error al borrar el curso");
    }
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost
}