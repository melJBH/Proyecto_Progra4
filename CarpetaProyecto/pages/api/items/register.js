import {apiHandler, itemRepo} from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    console.log("enter in register");
    console.log("req: ", req.body);
    await itemRepo.create(req.body);
    return resp.status(200).json({});
}