import { userXroleRepo, apiHandler } from "helpers/api";

export default apiHandler({
    delete: deleteRole
});

async function deleteRole(req, resp){
    
    return await userXroleRepo.delete(req.body);
}
