import {apiHandler, userRepo_2} from 'helpers/api';

export default apiHandler({
    get: getByName
});

async function getByName(req, resp){
    const user = await userRepo_2.getByName(req.body);

    if(!user) throw 'User not found';

    return resp.status(200).json({user});
}