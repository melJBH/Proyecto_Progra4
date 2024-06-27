import {apiHandler, versionRepo} from 'helpers/api';

export default apiHandler({
    put: update
});

async function update(req, resp){
    await versionRepo.update(req.body);
    return resp.status(200).json({});
}