const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const JWTSecret = "senhacriptografada"

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

function auth(req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken != undefined) {

        const bearer = authToken.split(' ')
        let token = bearer[1]

        jwt.verify(token, JWTSecret, (err, data) => {
            if (err) {
                res.status(401)
                res.json({ err: "Token Inválido." })
            }else{
               req.token = token
               req.loggedUser = {id: data.id, email: data.email}
               next()
            }
        })

    } else {
        res.status(401)
        res.json({ err: "Token Inválido." })
    }
}

let DB = {
    games: [
        {
            id: 23,
            title: 'Call Of Duty MW',
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: 'Valorant',
            year: 2020,
            price: 0
        },
        {
            id: 2,
            title: 'Minecraft',
            year: 2012,
            price: 20
        }
    ],
    users: [
        {
            id: 1,
            name: "Victor Lima",
            email: "victordevtb@guiadoprogramador.com",
            password: "nodejs<3"
        },
        {
            id: 20,
            name: "Guilherme",
            email: "guigg@gmail.com",
            password: "java123"
        },
        {
            id: 2,
            name: "Bruno",
            email: "bruno@email.com",
            password:"12345"
        }
    ]
}

app.get('/games', auth, (req, res) => {
    res.statusCode = 200
    res.json(DB.games)
})

app.get('/games/:id', auth, (req, res) => {

    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        let game = DB.games.find(g => g.id == id)

        if (game != undefined) {
            res.statusCode = 200
            res.json(game)
        } else {
            res.sendStatus(404)
        }
    }
})

app.post('/game', auth, (req, res) => {
    let { title, price, year } = req.body

    DB.games.push({
        id: 123,
        title,
        price,
        year
    })

    res.sendStatus(200)
})

app.delete('/game/:id', auth, (req, res) => {
    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        let index = DB.games.findIndex(g => g.id == id)
        if (index == -1) {
            res.sendStatus(404)
        } else {
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

app.put('/game/:id', auth, (req, res) => {

    if (isNaN(req.params.id)) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        let game = DB.games.find(g => g.id == id)

        if (game != undefined) {

            let { title, price, year } = req.body

            if (title != undefined) {
                game.title = title
            }
            if (price != undefined) {
                game.price = price
            }
            if (year != undefined) {
                game.year = year
            }

            res.sendStatus(200)

        } else {
            res.sendStatus(404)
        }
    }
})

app.post("/auth", (req, res) => {
    let { email, password } = req.body

    if (email != undefined) {
        let user = DB.users.find(u => u.email == email)

        if (user != undefined) {

            if (user.password == password) {

                jwt.sign({ id: user.id, email: user.email }, JWTSecret, { expiresIn: '48h' }, (err, token) => {
                    if (err) {
                        res.status(400)
                        res.json({ err: "Lamentamos, mas não podemos processar sua solicitação, relogue." })
                    } else {
                        res.status(200)
                        res.json({ token: token })
                    }
                })

            } else {
                res.status(401)
                res.json({ err: "Credenciais inválidas" })
            }
        } else {
            res.status(404)
            res.json({ err: "Email enviado não existe." })
        }
    } else {
        res.status(400)
        res.json({ err: "Email inválido." })
    }
})

app.listen(3003, () => {
    console.log('API Rodando!')
})