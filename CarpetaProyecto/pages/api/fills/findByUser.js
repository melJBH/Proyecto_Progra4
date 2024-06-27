import {apiHandler, fillRepo} from '/helpers/api';

export default apiHandler({
    get: getByVersionAndUser
});

async function getByVersionAndUser(req, resp){
    const fill = await fillRepo.getByVersionAndUser(req.body);
    return resp.status(200).json({fill});
}