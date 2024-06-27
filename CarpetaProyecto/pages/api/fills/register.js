import {apiHandler, fillRepo} from '/helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    await fillRepo.create(req.body);
    return resp.status(200).json({});
}