import { db } from "/helpers/api";

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const userXroleRepo = {                           
    getById,    
    create,
    update,
    delete: _delete
};

async function getById(params){ //params.id_user = identification

    const user = await db.User_2.findOne({where: {identification: params.id_user} });    

    if(!user) throw 'User not found';

    const role = await db.UserXrole.findOne({where: {id_user: user.id, role: 'Admin'}});
        
    return role;
}

async function create(params){    

    const user = await db.User_2.findOne({where: {identification: params.id_user} });
    // se obtiene el "id" de la tupla de tbl_user con el valor de identification
    //pasado en params como id_user, es decir, en params pasamos "id_user": user_identification 
    // al obtener el usuario, se extrae su id "pk" y se cambia para obtener la relación pk-fk
    if(!user) throw 'User not found';    
    params.id_user = user.id;      

    if(await db.UserXrole.findOne({where: {id_user: params.id_user, role: params.role}})){
        throw 'User with role: "' + params.role + '" is already taken';
    }        

    const userXrole = new db.UserXrole(params);
    
    await userXrole.save();
}

async function update(params){
    
    const user = await db.UserXrole.findOne({where: {id_user: params.id_user, role: params.role}});

    if(!user) throw 'User with role "' + params.role + '" not exists';    

    Object.assign(user, params);

    await user.save();

    return user;
}

async function _delete(params){

    const user = await db.User_2.findOne({where: {identification: params.id_user} });    

    if(!user) throw 'User not found';

    const role = await db.UserXrole.findOne({where: {id_user: user.id} });
    
    if(!role) throw 'Role not exists';

    await role.destroy();
}