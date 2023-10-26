const mongoose = require('mongoose')
const app = require('./app')

const { DB_USER, DB_HOST, DB_PASSWORD, IP_SERVER, API_VERSION } = require('./constants')


const PORT = process.env.POST || 3977


mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`)
    .then(
        () => {
            console.log("Conexion exitosa")
            app.listen(PORT, () => {
                console.log("##################################")
                console.log("############ API REST ############")
                console.log("##################################")
                console.log(`http://${IP_SERVER}:${PORT}/api/${API_VERSION}/`)
            })
        },
        err => {
            if (err) {
                throw err
            }
        }
    );

