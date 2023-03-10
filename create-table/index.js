const knex = require('knex')({
    client:'mysql',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '2142001',
        database: 'todo'
    }    
})

knex.schema.dropTableIfExists('users')
.then((result)=>{
    console.log(result)
})
.catch((err)=>{
    console.log(err)
})
.finally(()=>{
    knex.destroy()
})
g
knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('username');
    table.string('password');
    table.timestamps();
})
.then(() => {
    console.log('Table created successfully!');
})
.catch(err => {
    console.error(err);
})
.finally(()=>{
    knex.destroy()
})

