const Menu = require("../models/menu")

async function createMenu(req, res) {
    const menu = new Menu(req.body)

    const saved = await menu.save();
    if (saved) {
        return res.status(200).send(saved);
    } else {
        return res.status(400).send("Error al crear menu");
    }
}

async function getMenus(req, res) {
    const { active } = req.query
    let response = null

    if (active == undefined) {
        response = await Menu.find().sort({ order: "asc" })
    } else {
        response = await Menu.find({ active }).sort({ order: "asc" })
    }
    if (!response) {
        return res.status(400).send({ msg: "No se ha encontrado ningun menu" })
    }

    res.status(200).send(response)
}

async function updateMenu(req, res) {
    const { id } = req.params
    const menuData = req.body

    const updated = await Menu.findByIdAndUpdate({ _id: id }, menuData)

    if (updated) {
        return res.status(200).send({ msg: "Menu actualizado correctamente", updated });
    } else {
        return res.status(400).send("Error al actualizar el menu");
    }

}

async function deleteMenu(req, res) {
    const { id } = req.params

    const deleted = await Menu.findByIdAndDelete({ _id: id })
    if (deleted) {
        return res.status(200).send({ msg: "Menu eliminado correctamente", deleted });
    } else {
        return res.status(400).send("Error al borrar el menu");
    }
}

module.exports = {
    createMenu,
    getMenus,
    updateMenu,
    deleteMenu
}