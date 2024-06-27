import getConfig from 'next/config';
import { db } from "/helpers/api";

const {serverRuntimeConfig} = getConfig();

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const fillRepo = {         
    getAll,               
    getById,
    getByVersionAndUser,
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.FillForm.findAll();
}

async function getById(id){
    return await db.FillForm.findByPk(id);
}

async function getByVersionAndUser(params){

    const user = await db.User_2.findOne({where: {identification: params.id_user} });
    if(!user) throw 'User not found';

    const version = await db.FillForm.findOne({where: {id_versionForm: params.id_versionForm, id_user: user.id}});

    if(!version) throw 'Version not found in fill forms';

    console.log("fecha: ", version.date);

    const fill = user.name+' '+user.first_lastName+' '+user.second_lastName+ ' fecha: '+version.date;
    return fill;
}

async function create(params){

    const user = await db.User_2.findOne({where: {identification: params.id_user} });
    if(!user) throw 'User not found';
    params.id_user = user.id;

    if(await db.FillForm.findOne( {where: {id_versionForm: params.id_versionForm}} )){
        throw 'Version form: "' + params.id_versionForm + '" is already taken';
    }
    
    const fill = new db.FillForm(params);

    await fill.save();
}

async function update(params){

    const fill = await db.FillForm.findOne({where: {id_versionForm: params.id_versionForm}});

    if(!fill) throw 'Fill form with id version: "' + params.id_versionForm + '" not exists';

    Object.assign(fill, params);

    await fill.save();
}

async function _delete(params){

    const fill = await db.FillForm.findByPk(params.id);

    if(!fill) throw 'Fill form not found';

    await fill.destroy();
}