import {apiHandler, loginRepo} from '/helpers/api';

export default apiHandler({
    post: authenticate
});

async function authenticate(req, resp){
    const login = await loginRepo.authenticate(req.body);
    return resp.status(200).json({login});
}