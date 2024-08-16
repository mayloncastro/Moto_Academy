const express = require('express')

const app = express();

app.use(express.json())

const checkLogin = (req, res, next) => { //validando o token, depois essa função sera inserida em cada requisição
    console.log("Olá Mundo")
    const logado = req.headers.authorization == "Bearer tokenValido"
    if(logado) {
        next()
    } else {
        res.status(401).json({message: "Por favor, verifique suas credenciais"})
    }
}

let users = [ //um array com dois objetos
    {id: 1, name: "Maylon", age: "37", email: "mayloncastro@hotmail.com", senha: '12345'},
    {id: 2, name: "Armando", age: "5", email: "armandocastro@hotmail.com", senha: '54321'},
]

function findNextAvailableId(users) { //função para que não haja lacunas nos numros de id
    const ids = users.map(user => user.id); //mapea e forma um array com os ids contidos em cada objeto user
    let nextId = 1; // inicia o valor do  id com 1 para verificação e futura incrementação
    while (ids.includes(nextId)) { //faz um loop para verificar se o id exist dentro do array de ids
        nextId++; //caso exista, ele incrementa o nextId
    }
    return nextId; //quando não achar mais ids ele retorna o valor do nextId
}

app.get('/usuarios', checkLogin, (req, res) => { //quando eu acessar essa rota http://localhost:3000/usuarios é pra enviar os usuarios em formato json
    const sortedUsers =users.sort((a, b) => a.id - b.id);
    res.json(sortedUsers); //chama os usuarios contidos no array [users]
})

app.post('/usuarios', checkLogin, (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email;
    const senha = req.body.senha;
    const id = findNextAvailableId(users); //pega a função onde eu verifico o nextId retornado e aplica no id
    const newUser = {id, name, age, email, senha};
    users.push(newUser);
    res.status(201).json(newUser);
})

app.put("/usuarios.com.br/:id", checkLogin, (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const { age } = req.body;
    const { email } = req.body;
    const { senha } = req.body;
    const userIndex = users.findIndex((user) => user.id == id);
    if (userIndex != -1) {
      users[userIndex].name = name;
      users[userIndex].age = age;
      users[userIndex].email = email;
      users[userIndex].senha = senha;
      res.json(users[userIndex]);
    } else {
      res.status(400).json({ message: "Usuário não encontrado" });
    }
  });
  
app.delete("/usuarios.com.br/:id", (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter((user) => user.id !== id);
    res.sendStatus(204);
    res.json({message: "Usuário Deletado"});
});

app.post('/login',(req,res) => { //ao fazer login, essa função retorna o token que será colocado no authorization, esse authorization sera verificado antes de cada requisição
    const { name, email, senha } = req.body;
    const user = users.find(user => user.email == email && user.senha == senha)
    if(user) {
        res.json({message: "Login bem sucedido!", token: "tokenValido"})
    }
    else {
        res.json({message: "Credenciais Inválidas"})
    }

})
  
app.get("/", (req, res) => {
    res.send({ message: "Hello Word!" });
});
  
app.listen(3000);