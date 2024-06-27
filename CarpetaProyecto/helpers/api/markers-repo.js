import { db } from 'helpers/api';

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const markerRepo = {     
    getAll,               
    getById,
    getByIdVersion,
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.MarkerForm.findAll();
}

async function getById(id){
    return await db.MarkerForm.findByPk(id);
}

async function getByIdVersion(params){

    //const version = await db.VersionForm.findOne({where: { id: params.id_versionForm} });

    //if(!version) throw ' Version with id ' + params.id_versionForm + ' not found';

    const markers = await db.MarkerForm.findAll({
        where: {
            id_versionForm: params.id_versionForm
        }
    });
    

    if(!markers) throw 'Marker with id version: ' + params.id_versionForm + ' not exist';
    
    return markers;
}

async function create(params){

    const version = await db.VersionForm.findOne({where: {id: params.id_versionForm} });
    if(!version){
        throw 'Version form ' + params.id_versionForm + ' not exists';
    }    

    const marker = new db.MarkerForm(params);

    await marker.save();
}

async function update(params){

    const marker = await db.MarkerForm.findByPk(params.id);

    if(!marker) throw 'Marker form not found';

    Object.assign(marker, params);

    await marker.save();
}

async function _delete(id){
    
    const marker = await db.MarkerForm.findByPk(id);

    if(!marker) throw 'Marker with id ' + id + ' not exists' 

    await marker.destroy();

}