import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/markers`; // url para acceder a los .js de resgiter/update, etc
const markerSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('marker')));

export const markersService = {
    marker: markerSubject.asObservable(),
    get userValue() { return markerSubject.value },
    logout,
    register,
    getAll,
    getByIdVersion,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('marker');
    versionSubject.next(null);
    Router.push('app/marker/find');
}

async function register(marker){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, marker);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByIdVersion(id_version){
    return await fetchWrapperNoAuth.get(`${baseUrl}/find`, id_version);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === markerSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const marker = { ...markerSubject.value, ...params };
        localStorage.setItem('version', JSON.stringify(marker));

        // publish updated user to subscribers
        markerSubject.next(marker);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === markerSubject.value.id){
        logout();
    }
}