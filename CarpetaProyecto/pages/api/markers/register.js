import {apiHandler, markerRepo} from 'helpers/api';

export default apiHandler({
    post: register
});

async function register(req, resp){
    await markerRepo.create(req.body);
    return resp.status(200).json({});
}