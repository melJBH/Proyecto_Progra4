import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/usersXroles`; // url para acceder a los .js de resgiter/update, etc
const userXroleSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userXrole')));

export const userXroleService = {
    user: userXroleSubject.asObservable(),
    get userXroleValue() { return userXroleSubject.value },
    logout,
    register,    
    getById,    
    update,
    delete: _delete
};

function logout() {
    alertService.clear();
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('userXrole');
    userSubject.next(null);
    Router.push('account/login');
}

async function register(user){
    await fetchWrapperNoAuth.post(`${baseUrl}/register`, user);
}


async function getById(id){
    return await fetchWrapperNoAuth.get(`${baseUrl}/find`, id);
}

async function update(params){    

    await fetchWrapperNoAuth.post(`${baseUrl}/update`, params);

    if (params.id === userSubject.value.id) {// comparamos el id del usuario al que guarda localStorage
        // update local storage
        const userXrole = { ...userXroleSubject.value, ...params };
        localStorage.setItem('userXrole', JSON.stringify(userXrole));

        // publish updated user to subscribers
        userXroleSubject.next(user);
    }
}

async function _delete(id){

    await fetchWrapperNoAuth.delete(`${baseUrl}/delete`, id);

    if(id === userXroleSubject.value.id){
        logout();
    }
}