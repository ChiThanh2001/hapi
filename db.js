const option = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '2142001',
        database: 'todo'
    }
}

// connect to database
const knex = require('knex')(option)

const select = "select * from todos"
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
