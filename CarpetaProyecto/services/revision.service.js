import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/revisions`; // url para acceder a los .js de resgiter/update, etc
const revisionSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('revision')));

export const revisionService = {
    revision: revisionSubject.asObservable(),
    get revisionValue() { return revisionSubject.value },
    logout,
    register,
    getAll,
    getByAdmin,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('revision');
    revisionSubject.next(null);
    Router.push('app/revision/register');
}

async function register(revision){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, revision);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByAdmin(params){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findByAdmin`, params);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === revisionSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const revision = { ...revisionSubject.value, ...params };
        localStorage.setItem('revision', JSON.stringify(revision));

        // publish updated user to subscribers
        revisionSubject.next(revision);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === revisionSubject.value.id){
        logout();
    }
}