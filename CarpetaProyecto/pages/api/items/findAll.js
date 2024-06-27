import {apiHandler, itemRepo} from 'helpers/api';
// el "./"-> es donde estoy, el "../"-> me saca de donde estoy, quedando en la carpeta "api"

export default apiHandler({
    get: getByIdMarker
});

async function getByIdMarker(req, resp){  // todos los items de un marcador
    
    const items = await itemRepo.getByIdMarker(req.body);
    return resp.status(200).json({items});
}