import bcrypt from 'bcryptjs';
import { db } from "/helpers/api";

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const loginRepo = {     
    authenticate,                
    getByUser,    
    create,
    update,
    updatePassword,
    delete: _delete
};

async function authenticate({identification, password}){


    const sUser = await db.User_2.findOne({where: {identification: identification}});

    const login = await db.Login.scope('withPassword').findOne({where: {id_user: sUser.id}});



    if(!(login && bcrypt.compareSync(password, login.password))){
        throw 'User or password is incorrect';
    }


    const loginJson =login.get();
    delete loginJson.password;

    //posible creacion de token
    //const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, {expires: '7d'});

    // elimina "password" del valor de retorno
    //const userJson = identification.get();
    //delete userJson.password;

    //retorno del usuario y el jwt
    //return{
    //    ...userJson,
    //    token
    //};
    return login;
}

async function getByUser(params){ // busca el estado de un login por medio de "identification"

    const user = await db.User_2.findOne({where: {identification: params.id_user}}); // se busca

    if(!user) throw 'User not found';
 
    const login = await db.Login.findOne({where: {id_user: user.id}});
    if(!login) throw 'User with id: ' + params.id_user + ' not found in login';

    return login;
}

async function create(params){ // se pasa el "identification" del usuario

    const user = await db.User_2.findOne({where: {identification: params.id_user}}); // se busca

    if(!user) throw 'User not found';

    const search_login = await db.Login.findOne({where: {id_user: user.id}});// se obtiene el id pk, para la relacion pk->fk    

    if(search_login) throw 'User is already taken in login'; // si ya hay un login para x usuario, salta la excepción

    params.id_user = user.id;
    const login = new db.Login(params);

    if (params.password) {
        login.password = bcrypt.hashSync(params.password, 10); // engripta la contraseña
    }

    await login.save();        
}

async function update(params){ // solo actualiza el "state" del usuario
    
    const user = await db.User_2.findOne({where: {identification: params.id_user}}); // se busca

    if(!user) throw 'User not found';
    
    const search_login = await db.Login.findOne({where: {id_user: user.id}});// se obtiene el id pk, para la relacion pk->fk    

    if(!search_login) throw 'User not found in login'; // si ya hay un login para x usuario, salta la excepción    
    
    params.id_user = user.id;
    Object.assign(search_login, params);

    await search_login.save();
}

async function updatePassword(params){ // actualiza la contraseña

    const login = await db.Login.scope('withPassword').findOne({where: {id_user: params.id_user}});

    if(!login) throw 'User not found in login';

    if(params.password){
        params.hash = bcrypt.hashSync(params.password, 10);
    }
    Object.assign(login, params);

    await login.save();
}

async function _delete(params){

    const login = await db.Login.findOne({where: {id_user: params.id_user}});

    if(!login) throw 'User not found in login';

    await login.destroy();
}