import {apiHandler, markerRepo} from 'helpers/api';

export default apiHandler({
    get: getByIdVersion
});

async function getByIdVersion(req, resp){
    const markers = await markerRepo.getByIdVersion(req.body);
    return resp.status(200).json({markers});
}