import {apiHandler, formRepo} from 'helpers/api';

export default apiHandler({
    get: getAll
});

async function getAll(req, resp){       
    const forms =await formRepo.getAll();
    //forms.forEach(form => {                   // ejemplo para acceder a las propiedades de "forms"
    //    console.log(`ID: ${form.id}, Name: ${form.name}`);
    //});    
    return resp.status(200).json({forms});
}