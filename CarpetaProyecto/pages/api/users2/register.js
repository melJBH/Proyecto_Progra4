import {apiHandler, userRepo_2} from '/helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    await userRepo_2.create(req.body);
    return resp.status(200).json({});
}