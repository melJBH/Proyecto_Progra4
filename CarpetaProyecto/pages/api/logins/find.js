import {apiHandler, loginRepo} from '/helpers/api';

export default apiHandler({
    get: getByUser
});

async function getByUser(req, resp){
    const login = await loginRepo.getByUser(req.body);
    return resp.status(200).json({login});
}