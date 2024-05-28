const express = require('express')
const request = require('request')
const cors = require('cors')

const app = express()

app.use(express.json())

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

app.get('/', (req, res, next) => {
    res.json({ message: 'Hello world' })
})

app.post('/fluig', async (req, res) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

    try {

        if (!req.body) throw new Error('Corpo da solicitação inválido, faltou alguma informação')

        const url = req.body.url
        const body = req.body.body || null
        const oauth = req.body.oauth

        if (!url || !oauth) throw new Error('Corpo da solicitação inválido, faltou alguma informação')

        const oauthRequisicao = {
            ...oauth,
            signature_method: 'HMAC-SHA1'
        }

        const resposta = await new Promise((resolve, reject) => {
            request.post({ url: url, oauth: oauthRequisicao, json: true, body: body }, function (e, r, response) {
                if (e) reject(e)
                resolve(response)
            })
        })

        return res.json(resposta)

    } catch (error) {
        console.error({ ERROR: error.message })
        res.status(500).json({ ERROR: error.message })
    }

})

module.exports = app