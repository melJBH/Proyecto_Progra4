import { userXroleRepo, apiHandler } from "helpers/api";

export default apiHandler({
    get: getById
});

async function getById(req, resp){

    const userXrole = await userXroleRepo.getById(req.body);    

    return resp.status(200).json({userXrole});
}