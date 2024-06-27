import {apiHandler, formRepo} from 'helpers/api';

export default apiHandler({
    get: getByName
});

async function getByName(req, resp){ 
    console.log("ENTER IN getByName");
    console.log("req.body: ", req.body);
    const form = await formRepo.getByName(req.body);
    console.log("Getbyname, Form: ", form);
    return resp.status(200).json({form});
}