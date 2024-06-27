import {apiHandler, loginRepo} from '/helpers/api';

export default apiHandler({
    put: update
});

async function update(req, resp){
    await loginRepo.update(req.body);
    return resp.status(200).json({});
}