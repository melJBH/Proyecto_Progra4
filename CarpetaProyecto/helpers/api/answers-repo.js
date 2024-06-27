import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from 'helpers/api';

const { serverRuntimeConfig } = getConfig();

// patrón de diseño "repository"
// objeto que adjunta una serie de metodos
export const answerRepo = {         
    getAll,               
    getById,
    getByUserAndItem,
    create,
    update,
    delete: _delete
};

async function getAll(){
    return await db.AnswerUserItem.findAll();
}

async function getById(id){
    return await db.AnswerUserItem.findByPk(id);
}

async function getByUserAndItem(params){

    const answers = db.AnswerUserItem.findOne({where: {id_user: params.id_user, id_itemForm: params.id_itemForm}});

    if(!answers) throw 'Answer not found';

    return answers;
}

async function create(params){

    if(await db.AnswerUserItem.findOne({where: {id_user: params.id_itemForm} })){
        throw 'User: "' + params.id_user + '" is already answered that item';        
    }

    const answer = new db.AnswerUserItem(params);

    await answer.save();
}

async function update(params){

    const answer = await db.AnswerUserItem.findOne({where: {id_user: params.id_user, id_itemForm: params.id_itemForm}});

    if(!answer) throw 'Answer to update not found';

    Object.assign(answer, params);

    await answer.save();
}

async function _delete(id){

    const answer = await db.AnswerUserItem.findByPk(id);

    if(!answer) throw 'Answer to delete not found';

    await answer.destroy();

}