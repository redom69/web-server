const Newsletter = require("../models/newsletter")

async function subscribeEmail(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).send({ msg: "Email obligatorio" });
    }

    const newsletter = new Newsletter({
        email: email.toLowerCase()
    })

    const saved = await newsletter.save();
    if (saved) {
        return res.status(200).send({ msg: "Email registrado" });
    } else {
        return res.status(400).send({ msg: "Error al suscribirse" });
    }
}


async function getNewsletters(req, res) {
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    Newsletter.paginate({}, options)
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


async function deleteNewsletter(req, res) {
    const { id } = req.params

    const deleted = await Newsletter.findByIdAndDelete({ _id: id })
    if (deleted) {
        return res.status(200).send({ msg: "Subscripcion eliminada correctamente", deleted });
    } else {
        return res.status(400).send("Error al borrar eliminar subscripcion");
    }
}

module.exports = {
    subscribeEmail,
    getNewsletters,
    deleteNewsletter
}