import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/forms`; // url para acceder a los .js de resgiter/update, etc
const formSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('form')));

export const formsService = {
    form: formSubject.asObservable(),
    get formValue() { return formSubject.value },
    logout,
    register,
    getAll,
    getById,
    getByName,
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('form');
    formSubject.next(null);
    Router.push('/account/login');
}

async function register(form){
    await fetchWrapper.post(`${baseUrl}/register`, form);
}
async function getAll(){
    return await fetchWrapper.get(`${baseUrl}/findAll`);
}

async function getById(id){
    return await fetchWrapper.get(`${baseUrl}/find`);
}

async function getByName(name){
    return await fetchWrapper.get(`${baseUrl}/findByName`, name);
}

async function update(params){

    await fetchWrapper.post(`${baseUrl}/update`, params);

    if (params.id === userSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const form = { ...formSubject.value, ...params };
        localStorage.setItem('form', JSON.stringify(form));

        // publish updated user to subscribers
        formSubject.next(form);
    }
}

async function _delete(id){

    await fetchWrapper.delete(`${baseUrl}/delete`, params);

    if(id === formSubject.value.id){
        logout();
    }
}