import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/fills`; // url para acceder a los .js de resgiter/update, etc
const fillSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('fill')));

export const fillService = {
    fill: fillSubject.asObservable(),
    get fillValue() { return fillSubject.value },
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
    localStorage.removeItem('fill');
    versionSubject.next(null);
    Router.push('app/fill/register');
}

async function register(fill){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, fill);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByIdUserAndItem(params){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findByUser`, params);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === fillSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const fill = { ...fillSubject.value, ...params };
        localStorage.setItem('fill', JSON.stringify(fill));

        // publish updated user to subscribers
        fillSubject.next(fill);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === fillSubject.value.id){
        logout();
    }
}