import { db } from 'helpers/api';
import { CONFIG_FILES } from 'next/dist/shared/lib/constants';

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const versionRepo = {     
    getAll,               
    getById,
    getByIdForm,
    create,
    update
};

async function getAll(){
    return await db.VersionForm.findAll();
}

async function getById(params){
    return await db.VersionForm.findByPk(params.id);
}

async function getByIdForm(params){

    const form = await db.Form.findOne({where: {id: params.id_form}});

    if(!form) throw 'Form with id ' + params.id_form + ' not exists';
    console.log("params: ", params.id_form);

    const versions = await db.VersionForm.findOne({where: { id_form: form.id}});

    return versions;    
}

async function create(params){
    console.log("enter in create: ");
    console.log("params ", params);

    //if(await db.Form.findOne({where: { id : params.id_form} }))
    //    throw 'Form with id ' + params.idForm + 'not exists';
    
    const version = new db.VersionForm(params);
    
    await version.save();

    return version;
}

async function update(params){ // params solo debe tener el "version, state"
    
    const version = await db.VersionForm.findByPk(params.id);

    if(version==null) 
        console.log('Version form not found');

    Object.assign(version, params);

    await version.save();
    
}