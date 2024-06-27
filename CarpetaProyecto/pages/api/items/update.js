import {apiHandler, itemRepo} from '/helpers/api';

export default apiHandler({
    put: update
});

async function update(req, resp){
    const items = await itemRepo.update(req.body);
    return resp.status(200).json({items});
}