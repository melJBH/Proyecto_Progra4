import { revisionRepo, apiHandler } from "helpers/api";

export default apiHandler({
    get: findByAdmin
});

async function findByAdmin(req, resp){

    const revision = await revisionRepo.getByAdminAndVersion(req.body);
    return resp.status(200).json({revision});
}