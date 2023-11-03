const bcrypt = require("bcryptjs");

const User = require('../models/user');
const jwt = require("../utils/jwt");
const { use } = require("../app");

async function register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("El email y la contraseña son obligatorios");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "user",
            active: false,
        });

        await user.save();
        return res.status(201).send({ msg: "Usuario creado correctamente" });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Email duplicado
            return res.status(400).send({ msg: "El email ya está en uso" });
        } else {
            // Otro error
            return res.status(500).send({ msg: "Error al crear usuario" });
        }
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ msg: "El email y la contraseña son obligatorios" });
    }

    try {
        const emailToLower = email.toLowerCase();
        const user = await User.findOne({ email: emailToLower });

        if (!user) {
            return res.status(401).send({ msg: "El email no está registrado" });
        }

        bcrypt.compare(password, user.password, (bcryptError, check) => {
            if (bcryptError) {
                return res.status(500).send({ msg: "Error del servidor" });
            } else if (!check) {
                return res.status(401).send({ msg: "Usuario o contraseña incorrecta" });
            } else if (!user.active) {
                return res.status(403).send({ msg: "Usuario no autorizado" });
            } else {
                return res.status(200).send({
                    access: jwt.createAccessToken(user),
                    refresh: jwt.createRefreshToken(user)
                });
            }
        });
    } catch (error) {
        return res.status(500).send({ msg: "Error del servidor" });
    }
}

async function refreshAccesToken(req, res) {
    const { token } = req.body

    const { user_id } = jwt.decode(token)

    try {
        const user = await User.findOne({ _id: user_id });
        if (!user) {
            return res.status(500).send({ msg: "Error del servidor" });
        } else {
            return res.status(200).send({
                accessToken: jwt.createAccessToken(user),
            });
        }
    } catch (error) {
        return res.status(500).send({ msg: "Error del servidor" });
    }
}

module.exports = {
    register,
    login,
    refreshAccesToken
};
