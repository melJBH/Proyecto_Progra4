import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();
// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const formRepo = {     
    getAll,               
    getById,
    getByName,
    create,
    update,
    delete: _delete
};
/*
"async" = asíncrona, se usa en funciones que tomarán cierto tiempo en completarse
javaScript se ejecuta en un solo hilo, para que el bucle de eventos "event loop"
no se detenga, se usan las async para lo bloquear el event loop y que así no se detenga el sistema

await= esperar, solo se puede usar en funciones async
*/

async function getAll(){ // obtener todas las tuplas de tbl_forms
    console.log("Form all");

    //if(!db.initialized){
     //   console.log("Database not initialize");
     //   await db.initialize();
    //}
    
    return await db.Form.findAll(); // retorno de las tuplas de tbl_forms
}

async function getById(params){    
    return await db.Form.findByPk(params.id);
}

async function getByName(params){
    
    const form = await db.Form.findOne({ where: {name: params.name}});

    if(!form) throw 'Form with name ' + params.name + ' not found'

    return form;
}

async function create(params){    

    if(await db.Form.findOne({ where: { name: params.name } })){
        throw 'Form with name ' + params.name + ' is already taken';
    }

    const form = new db.Form(params);

    await form.save();
    
    return form;
}

async function update(params){
    const form = await db.Form.findByPk(params.id);

    if(!form) throw 'Form not found'
    if(form.name !== params.name && await db.Form.findOne({ where: { name: params.name } })){
        throw 'Form with name ' + params.name + ' is already taken'
    }

    Object.assign(form, params);
    await form.save();
}

async function _delete(id){
    const form = await db.Form.findByPk(id);

    if(!form) throw 'Form not found'

    await form.destroy();
}
