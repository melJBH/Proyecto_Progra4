import {apiHandler, loginRepo} from '/helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){        
    await loginRepo.create(req.body);
    return resp.status(200).json({}); 
}