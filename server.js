// Server
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'dnd_player_creator',
})

conn.connect(err => {
	if (err) {
		console.log(err)
		return err
	} else {
		console.log('Connected to MySQL')
	}
})
app.use(cors())

app.get('/', (req, res) => {
	res.send('All done')
})

app.post('/getUser/:id', async (req, res) => {
	let sql = `select * from users where id = "${req.params.id}"`
	conn.query(sql, (err, result) => {
		if (err) {
			console.log(err)
		}
		res.send(result)
	})
})

app.post('/findUser/:name/:password', async (req, res) => {
	let sql = `select * from users where name = "${req.params.name}"`
	conn.query(sql, (err, result) => {
		if (err) {
			console.log('err')
			res.send(false)
		} else if (result.length == 0) {
			res.send('No user found')
		} else {

			const password = bcrypt.compareSync(
				req.params.password,
				result[0].password
			)
			console.log(password)

			if (password == true) {
				res.send(result)
			} else {
				res.send(false)
			}
		}
	})
})

app.post('/createUser/:name/:password', async (req, requestResult) => {
	let isUserSqlReq = `SELECT * FROM users WHERE name = "${req.params.name}"`
	const salt = await bcrypt.genSalt(10)
	const password = await bcrypt.hash(req.params.password, salt)
	let sql = `INSERT INTO users (name,password) VALUES (?, ?);`
	conn.query(isUserSqlReq, (err, result) => {
		let resArr = []
		resArr.push(result)
		if (resArr[0].length == 0) {
			conn.query(sql, [req.params.name, password],(err, res) => {
				if (err) {
					throw err
				} else {
					conn.query(sql, (err, result) => {
						console.log(result)
					})
					requestResult.send(true)
				}
			})
		} else {
			requestResult.send(false)
		}
	})
})

app.post('/getUserCharacters/:id', async (req, res) => {
	let sql = `SELECT * FROM characters WHERE user_id = ${req.params.id}`
	conn.query(sql, (err, result) => {
		if (err) {
			console.log(err)
		}
		res.send(result)
	})
})

app.post('/getUserBook/:id', async (req, res) => {
	let sql = `SELECT * FROM user_ms_book WHERE user_id = ${req.params.id}`
	conn.query(sql, (err, result) => {
		if (err) {
			console.log(err)
		}
		res.send(result)
	})
})

app.post('/getUserData/:id', async (req, res) => {
	let sql = `SELECT * FROM user_data WHERE user_id = ${req.params.id}`
	conn.query(sql, (err, result) => {
		if (err) {
			console.log(err)
		}
		console.log(result)

		res.send(result)
	})
})

app.post('/updateUserData/:id/:dice/:theme/:vibration/:language',async (req, res) => {
		let sql = `UPDATE user_data SET theme = "${req.params.theme}", vibration = "${req.params.vibration}", language = "${req.params.language}", WHERE user_id = ${req.params.id}`
      conn.query(sql, (err, result) => {
         if (err) {
            console.log(err)
         }
         res.send(result)
      })
	}
)
const PORT = 2205
app.listen(PORT, () => {
	console.debug(`listening on port: http://localhost:${PORT}`)
	console.debug(`listening on Network: http://192.168.1.249:${PORT}`)
})
