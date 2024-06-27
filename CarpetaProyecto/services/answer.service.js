import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/answers`; // url para acceder a los .js de resgiter/update, etc
const answerSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('answer')));

export const answersService = {
    answer: answerSubject.asObservable(),
    get answerValue() { return answerSubject.value },
    logout,
    register,
    getAll,
    getByIdUserAndItem,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('answer');
    versionSubject.next(null);
    Router.push('app/answer/find');
}

async function register(item){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, item);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByIdUserAndItem(params){
    return await fetchWrapperNoAuth.get(`${baseUrl}/find`, params);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === answerSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const answer = { ...answerSubject.value, ...params };
        localStorage.setItem('asnwer', JSON.stringify(answer));

        // publish updated user to subscribers
        answerSubject.next(answer);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === answerSubject.value.id){
        logout();
    }
}