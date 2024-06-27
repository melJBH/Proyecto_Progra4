import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/versions`; // url para acceder a los .js de resgiter/update, etc
const versionSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('version')));

export const versionsService = {
    version: versionSubject.asObservable(),
    get versionValue() { return versionSubject.value },
    logout,
    register,
    getAll,
    getByIdForm,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('version');
    versionSubject.next(null);
    Router.push('app/version/find');
}

async function register(version){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, version);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByIdForm(id_form){
    return await fetchWrapperNoAuth.get(`${baseUrl}/find`, id_form);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === versionSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const version = { ...versionSubject.value, ...params };
        localStorage.setItem('version', JSON.stringify(version));

        // publish updated user to subscribers
        versionSubject.next(user);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, params);

    if(id === versionSubject.value.id){
        logout();
    }
}