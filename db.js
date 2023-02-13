const option = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '2142001',
        database: 'todoapp'
    }
}

// connect to database
const knex = require('knex')(option)

const select = "select * from todolist"
knex.raw(select)
.then(result=>{
    console.log(result[0])
})
.catch(err =>{
    console.log("Error" , err)
})
.finally(() => {
    knex.destroy()
})
