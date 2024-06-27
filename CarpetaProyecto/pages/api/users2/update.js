import {apiHandler, userRepo_2} from '/helpers/api';

export default apiHandler({
    put: update
});

async function update(req, resp){
    
    const user_2 = await userRepo_2.update(req.body);
    return resp.status(200).json({user_2});
}