import {apiHandler, versionRepo} from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    console.log("enter in register", req.body);
    
    const version = await versionRepo.create(req.body);
    return resp.status(200).json(version);
}