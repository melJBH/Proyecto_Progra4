import {apiHandler, userRepo_2} from '/helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, resp){
    const users = await userRepo_2.getAll();
    return resp.status(200).json({users});
}