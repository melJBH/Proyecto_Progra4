import { userXroleRepo, apiHandler } from "helpers/api";

export default apiHandler({
    post: register
});

async function register(req, resp){

    const userXrole = await userXroleRepo.create(req.body);
    
    return resp.status(200).json({userXrole});
}