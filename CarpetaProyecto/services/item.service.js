import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/items`; // url para acceder a los .js de resgiter/update, etc
const itemSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('item')));

export const itemsService = {
    item: itemSubject.asObservable(),
    get itemValue() { return itemSubject.value },
    logout,
    register,
    getAll,
    getByIdMarker,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('item');
    versionSubject.next(null);
    Router.push('app/item/find');
}

async function register(item){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, item);
}

async function getAll(){
    return await fetchWrapperNoAuth.get(`${baseUrl}/findAll`);
}

async function getByIdMarker(id_marker){
    return await fetchWrapperNoAuth.get(`${baseUrl}/find`, id_marker);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === itemSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const item = { ...itemSubject.value, ...params };
        localStorage.setItem('version', JSON.stringify(item));

        // publish updated user to subscribers
        itemSubject.next(item);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === itemSubject.value.id){
        logout();
    }
}