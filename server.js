const Hapi = require('@hapi/hapi');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method:'POST',
        path:'/login',
        handler:async (request,h)=>{
            try {
                const {username , password} = request.payload
                const user = await knex('users').where({ username }).count('id as count')
                if(!user[0].count){
                    return {message: 'incorrect username'}
                }  

                const pwdInDB = await knex.select('password').from('users').where('username',username)

                const isMatch = await bcrypt.compare(password , pwdInDB[0].password)
                
                if(!isMatch){
                    return {message:'incorrect password'}
                }

                const token = jwt.sign({username} , 'chithanh' , {expiresIn:'1h'})
                const decoded = jwt.verify(token,'chithanh')
                return {
                    message:'login successfully',
                    token
                }
            } catch (error) {
                console.log(error)
            }
        }
    })

    server.route({
        method:'POST',
        path:'/logout',
        handler: async (request,h)=>{
            const {isLogout} = request.payload
            if(isLogout){
                
            }
        }
    })

    server.route({
        method:'POST',
        path:'/signup',
        handler:async (request,h)=>{
            try {
                const {username,password} = request.payload

                const user = await knex('users').where({ username }).count('id as count')
    
                if(user[0].count){
                    return {
                        checkUser : 'User already exist in database'
                    }
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const insertUser = await knex('users').insert({ username , password : hashedPassword })
                const retriveUserInsert = knex('users').select('id','username').where('username',username)
                return retriveUserInsert
            } catch (error) {
                return error
            }
           
        }
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            // return knex.raw("SELECT * from todos")
            // .then(result=>{
            //     return {result}
            // })
            // .catch(err => {
            //     throw new Error(err.message)
            // })
            const token = request.headers['authorization']

            if(!token){
                return {error:'Access denied. No token provided.'}
            }

            const tokenWithoutBearer = token.slice(7)
            // console.log(token)
            // console.log(tokenWithoutBearer)
            try {
                const decoded = jwt.verify(tokenWithoutBearer,'chithanh')
                // console.log(decoded)
                const response = await knex.raw("SELECT * from todos")
                const data = response[0]
                return {data}
            } catch (error) {
                return error.message
            }
        },
    });

    server.route({
        method: 'POST',
        path: '/post',
        handler: async (request, h) => {
            const {name} = request.payload
            // console.log(name)
            // return knex.raw(`INSERT into todo.todos(name) VALUES(${name})`)
            // .then(result=>{
            //     console.log(1)
            //     return result
            // })
            // .catch(err=>{
            //     console.log(2)
            //     return err
            // })
            try {
                const response = await knex.raw(`INSERT into todo.todos(name) VALUES("${name}")`) 
                return response
            } catch (error) {
                return error.message
            }
        },
    });

    server.route({
        method:"PATCH",
        path:'/patch/{id}',
        handler: async(request,h)=>{
            try {
                const {name} = request.payload
                const {id} = request.params
                const result  = await knex.raw(`UPDATE todo.todos SET todos.name="${name}" WHERE id=${id}`)
                return {result} 
            } catch (error) {
                return error.message
            }
        }
    })

    server.route({
        method:'DELETE',
        path:'/delete/{id}',
        handler: async (request,h)=>{
            const {id} = request.params
            return knex.raw(`DELETE from todo.todos WHERE id=${id}`)
            .then(result=>{
                return result
            })
            .catch(err=>{
                throw new Error(err.message)
            })

            // try {
            //     const result = await knex.raw(`DELETE from todo.todos WHERE id=${id}`)
            //     return {result}
            // } catch (error) {
            //     throw new Error(error)
            // }
        }
    })


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();