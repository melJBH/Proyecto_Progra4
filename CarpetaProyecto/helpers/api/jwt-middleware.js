import { expressjwt } from 'express-jwt';
import util from 'util';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = expressjwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/register',
            '/api/users/authenticate',
            '/api/forms/register',
            '/api/forms/findAll',
            '/api/forms/findByName',
            '/api/forms/find',
            '/api/versions/register',
            '/api/versions/find',            
            '/api/versions/update',
            '/api/markers/register',
            '/api/markers/update',
            '/api/markers/find',
            '/api/items/register',
            '/api/items/findAll',
            '/api/items/update',
            '/api/users2/register',
            '/api/users2/update',
            '/api/users2/findAll',
            '/api/users2/find',
            '/api/users2/findName',
            '/api/logins/register',
            '/api/logins/update',
            '/api/logins/find',
            '/api/logins/authenticate',
            '/api/answers/register',
            '/api/answers/findByUser',
            '/api/fills/register',
            '/api/fills/register',
            '/api/fills/findByUser',
            '/api/usersXroles/register',
            '/api/usersXroles/find',
            '/api/usersXroles/delete',
            '/api/revisions/register',
            '/api/revisions/find',
            '/api/users'
            

        ]
    });

    return util.promisify(middleware)(req, res);
}