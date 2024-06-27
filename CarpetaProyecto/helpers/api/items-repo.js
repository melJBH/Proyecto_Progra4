import { db } from 'helpers/api';

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const itemRepo = {     
    getAll,               
    getById,
    getByIdMarker,
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.ItemForm.findAll();
}

async function getById(id){
    return await db.ItemForm.findByPk(id);
}

async function getByIdMarker(params){
    console.log("Params: ", params);
    const marker = await db.MarkerForm.findOne({where: {id: params.id_markerForm}});

    if(!marker) throw 'Marker with id ' + params.idMarkerForm + ' not found';

    const items = await db.ItemForm.findAll({where: {id_markerForm: marker.id} });

    return items;
}

async function create(params){

    const marker = await db.MarkerForm.findOne({where: {id: params.id_markerForm}});
    
    if(!marker){
        throw 'Item with id ' + params.idMarkerForm + ' not exists';
    }        

    const item = new db.ItemForm(params);

    await item.save();
}

async function update(params){

    const item = await db.ItemForm.findOne({where: {id: params.id}});

    if(!item) throw 'Item form not found';

    Object.assign(item, params);

    item.save();
    
    return item;
}

async function _delete(id){

    const item = db.ItemForm.findByPk(id);

    if(!marker) throw 'Item form not found';

    await marker.destroy();
}