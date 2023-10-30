const bcrypt = require("bcryptjs")

const User = require("../models/user")
const image = require("../utils/image")
const user = require("../models/user")

async function getMe(req, res) {
    const { user_id } = req.user

    const response = await User.findById(user_id)
    if (!response) {
        res.status(400).send({ msg: "No se ha encontrado el usuario" })
    }
    res.status(200).send(response)
}

async function getUsers(req, res) {
    const { active } = req.query
    let response = null

    if (active == undefined) {
        response = await User.find()
    } else {
        response = await User.find({ active })
    }

    res.status(200).send(response)
}

async function createUsers(req, res) {
    const { email, password } = req.body
    const salt = bcrypt.genSaltSync(10)
    const hasPassword = bcrypt.hashSync(password, salt)

    try {

        if (!email || !password) {
            return res.status(400).send("El email y la contraseña son obligatorios");
        }

        const user = new User({ ...req.body, active: false, password: hasPassword })

        if (req.files.avatar) {
            const imageName = image.getFilePath(req.files.avatar)
            user.avatar = imageName
        }

        await user.save();
        return res.status(201).send(user);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).send("El email ya está en uso");
        } else {
            return res.status(500).send("Error al crear usuario");
        }
    }
}


async function updateUsers(req, res) {
    const { id } = req.params
    const userData = req.body

    if (userData.password) {
        const salt = bcrypt.genSaltSync(10)
        const hasPassword = bcrypt.hashSync(userData.password, salt)
        userData.password = hasPassword
    } else {
        delete userData.password
    }

    if (req.files.avatar) {
        const imageName = image.getFilePath(req.files.avatar)
        userData.avatar = imageName
    }

    const updated = await User.findByIdAndUpdate({ _id: id }, userData)
    if (updated) {
        return res.status(200).send(updated);
    } else {
        return res.status(400).send("Error al actualizar usuario");
    }
}

async function deleteUsers(req, res) {
    const { id } = req.params

    const deleted = await User.findByIdAndDelete({ _id: id })
    if (deleted) {
        return res.status(200).send(deleted);
    } else {
        return res.status(400).send("Error al borrar usuario");
    }
}

module.exports = {
    getMe,
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers
}