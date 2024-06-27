import {apiHandler, versionRepo} from 'helpers/api';

export default apiHandler({
    get: getByIdForm
});

async function getByIdForm(req, resp){
    const version = await versionRepo.getByIdForm(req.body);
    return resp.status(200).json({version});
}