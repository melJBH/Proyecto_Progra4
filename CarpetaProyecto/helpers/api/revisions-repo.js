import { where } from "sequelize";
import { db } from "/helpers/api";

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const revisionRepo = {         
    getAll,               
    getById,
    getByAdminAndVersion, 
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.RevisionForm.findAll();
}

async function getById(id){
    return await db.RevisionForm.findByPk(id);
}

async function getByAdminAndVersion(params){

    const user = await db.User_2.findOne({where: {identification: params.id_admin} });

    if(!user) throw 'User not found';

    const role = await db.UserXrole.findOne({ where: {id_user: user.id} });

    if(!role) throw 'Role not found';

    const revision = await db.RevisionForm.findOne({where: {id_versionForm: params.id_versionForm, id_admin: role.id}});

    if(!revision) throw 'User "' + params.id_admin + '" did not review the form';

    const nameUser = user.name+' '+user.first_lastName+' '+user.second_lastName;
    return nameUser;
}

async function create(params){ // params.id_user = identification

    const user = await db.User_2.findOne({where: {identification: params.id_admin} });

    if(!user) throw 'User not found';

    const role = await db.UserXrole.findOne({ where: {id_user: user.id} });

    if(!role) throw 'Role not found';

    if(await db.RevisionForm.findOne({where: {id_versionForm: params.id_versionForm, id_admin: role.id} })){
        throw 'This version is already revised';
    }
    params.id_admin = role.id;
    const revision = new db.RevisionForm(params);

    await revision.save();
}

async function update(params){// solo actualizar la fecha

    const user = await db.User_2.findOne({where: {identification: params.id_admin} });

    if(!user) throw 'User not found';

    const role = await db.UserXrole.findOne({ where: {id_user: user.id} });

    if(!role) throw 'Role not found';

    const revision = await db.RevisionForm.findOne({where: {id_versionForm: params.id_versionForm, id_admin: role.id}});

    if(!revision) throw 'Version to update not found';
    params.id_admin = role.id;
    Object.assign(revision, params);

    await revision.save();
}

async function _delete(id){

    const revision = await db.RevisionForm.findOne({where: {id_versionForm: params.id_versionForm, id_admin: params.id_admin}});

    if(!revision) throw 'Version to delete not found';

    revision.destroy();
}
