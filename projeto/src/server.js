const express = require("express")
const server = express()

// pegar o bando de dados
const db = require("./database/db")

//configurar pasta public
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded({extended: true}))


//utilizando template engenie nunjucks

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




//configurar caminhos da aplicação
//pagina inicial
//req: quisição
//res: resposta

//index

server.get("/", (req, res) => {

   return res.render("index.html", {title:"Seu market place de coleta de resíduos"})

})

//creat-point (cadastro)

server.get("/create-point", (req, res) => {

    //req.query: Query Strings das urls
 

    return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {

    // req.body: corpo do formulario
    console.log(req.body)

    //inserir dados no banco de dados

    const query = `
            INSERT INTO places (
                image, 
                name, 
                address, 
                address2, 
                state, 
                city, 
                items
    
            ) VALUES (
                ?,?,?,?,?,?,?
            );
            `
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items    
        ]
    
        function afterInsertData (err) {
            if(err){
                return console.log(err)
            }
                  
            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render("create-point.html", {saved:true})
        }
        
        db.run(query, values, afterInsertData)

    
})

//search-results (resultado da pesquisa)
server.get("/search-results", (req, res) => {

    const search = req.query.search

    if (search == ""){
        // pesquisa vazia
        return res.render("search-results.html", {total: 0})

    }


    // pegar dados do banco de dados
        db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }
        console.log("Aqui estão os seus registros")
        console.log(rows)

        const total = rows.length

        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})

    })


})

// ligar o servidor
server.listen(3000)
