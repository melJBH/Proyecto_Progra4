import { db } from "/helpers/api";

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const userRepo_2 = {         
    getAll,               
    getById,
    getByName,
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.User_2.findAll();
}

async function getById(params){
    return await db.User_2.findOne({where: {identification: params.identification}});
}

async function getByName(params){
    const user = await db.User_2.findOne({where: {name: params.name} });

    if(!user) throw 'User with name: "' + params.name + '" not exists';

    return user;
}

async function create(params){

    if(await db.User_2.findOne({ where: {name: params.name}}) ){
        throw 'User with name: "' + params.name + '" is already taken';
    }

    const user = new db.User_2(params);
    
    await user.save();
}

async function update(params){
    console.log("enter in: update");
    const user = await db.User_2.findOne({where: {identification: params.identification} });

    if(!user) throw 'User "' + params.name + '" not exists';
    if(user.name !== params.name && await db.User.findOne({where: {identification: params.identification}})){
        throw 'User with name "' + params.name + '" is already taken';
    }

    Object.assign(user, params);

    await user.save();

    return user;
}

async function _delete(id){

    const user = await db.User_2.findByPk(id);

    if(!user) throw 'User not found';

    await user.destroy();
}