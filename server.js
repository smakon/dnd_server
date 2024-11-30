// Server
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')

// Cloud DB
const conn = mysql.createConnection({
	host: 'jufirjigoop.beget.app',
	user: 'dnd_player_builder',
	password: '12345678Sas)',
	database: 'dnd_player_builder',
})
// setInterval(() => {
// 	conn.query('select 1')
// 	console.log('select')
// }, 2900)

// DB
// const conn = mysql.createConnection({
// 	host: 'ssamikm6.beget.tech',
// 	user: 'ssamikm6_dnd',
// 	password: '12345678Sas)',
// 	database: 'ssamikm6_dnd',
// })

conn.connect(err => {
	if (err) {
		console.log(err)
		return err
	} else {
		conn.query('set session wait_timeout=28800;')
		console.log('Connected to MySQL')
	}
})

conn.wa

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
			conn.query(sql, [req.params.name, password], (err, res) => {
				if (err) {
					throw err
				} else {
					conn.query(isUserSqlReq, (err, result) => {
						conn.query(
							`INSERT INTO user_data (user_id) VALUES (${result[0].id})`,
							(err, result) => {
								requestResult.send(true)
							}
						)
					})
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
		res.send(result)
	})
})

app.post(
	'/updateUserData/:id/:dice/:theme/:vibration/:language',
	async (req, res) => {
		let sql = `UPDATE user_data SET theme = "${req.params.theme}", vibration = "${req.params.vibration}", language = "${req.params.language}", dice_count = "${req.params.dice}" WHERE user_id = ${req.params.id}`
		conn.query(sql, (err, result) => {
			if (err) {
				console.log(err)
			}
			res.send(result)
		})
	}
)

const PORT = 2205
app.listen(PORT, (err, result) => {
	console.debug('listening on port %d', PORT)
})
