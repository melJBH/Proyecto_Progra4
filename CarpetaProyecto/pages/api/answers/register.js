import {apiHandler, answerRepo} from '/helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    await answerRepo.create(req.body);
    return resp.status(200).json({});
}