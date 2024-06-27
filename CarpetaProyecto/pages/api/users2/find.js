import {apiHandler, userRepo_2} from '/helpers/api';

export default apiHandler({
    get: getById,    
});

async function getById(req, resp){
    
    const user = await userRepo_2.getById(req.body);

    if(!user) throw 'User not found';
    
    return resp.status(200).json({user});
}