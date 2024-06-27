import {apiHandler, formRepo} from 'helpers/api';

export default apiHandler({
    get: getByPk
});

async function getByPk(req, resp){
        
    const form = await formRepo.getById(req.body);

    if(!form) throw 'Form not found';

    return resp.status(200).json(form);
}