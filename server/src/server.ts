import express, { request } from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';
import {errors} from 'celebrate';


//npm init -y
//npm install express
// npm install @types/express -D
//npm install ts-node -D
//npm install typescript -D
//npx tsc --init
//npx ts-node src/server.ts
//npm install ts-node-dev -D
//npx create-react-app web --template=typescript
//npm install @types/cors

const app = express();
app.use(cors());
app.use(express.json());//Express  entender o corpo em formato JSON
app.use(routes);
//Rota: Endereço completo da requisição
//Recurso: Qual entidade estamos acessando do sistema
/*
const users = [
    'Yas', //0
    'ana', //1
    'Jana' //2
];

//Request Param: Parâmetros que vem na própria rota que identificam um recurso.
//Query Param: Parâmetros opcionais que servem para filtro, paginação..
//Request Body :Parâmetros para criação/atualização de informações


app.get('/users', (request,response)=>{
    const search =String(request.query.search);
    console.log('on')
    const filteredUsers=search ? users.filter(user=> user.includes(search)):users;
    //console.log('Listagem de Usuários');
    //response.send('Hello World');
    response.json(filteredUsers); 
 });
 app.get('/users/:id', (request,response)=>{
    const id = Number(request.params.id);

    const user = users[id];
    return response.json(user);
 });

 app.post('/users',(request,response) =>{

    const data = request.body;
    console.log(data);

    const user ={
        name:data.name,
        email:data.email
    };
    return response.json(user);
 }); 
*/

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());
app.listen(3333);