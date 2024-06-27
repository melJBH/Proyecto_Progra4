import {apiHandler, formRepo} from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    console.log('Entré a register');
    console.log('REQ_BODY', req.body);
    await formRepo.create(req.body);
    return resp.status(200).json({});
}