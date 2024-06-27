import {apiHandler, answerRepo} from '/helpers/api';

export default apiHandler({
    get: getByUserAndItem
});

async function getByUserAndItem(req, resp){
    const answer = await answerRepo.getByUserAndItem(req.body);
    return resp.status(200).json({answer});
}