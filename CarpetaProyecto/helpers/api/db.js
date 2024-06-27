import getConfig from 'next/config';
import mysql from 'mysql2/promise';
import { Sequelize, DataTypes } from 'sequelize';

const { serverRuntimeConfig } = getConfig();

export const db = {
    initialized: false,
    initialize
};

// initialize db and models, called on first api request from /helpers/api/api-handler.js
async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // init models and add them to the exported db object
    db.User = userModel(sequelize);
    db.Form = formModel(sequelize);
    db.VersionForm = versionFormModel(sequelize);
    db.MarkerForm = markerFormModel(sequelize);
    db.ItemForm = itemFormModel(sequelize);
    db.User_2 = userModel_2(sequelize);
    db.Login = loginModel(sequelize);
    db.AnswerUserItem = answerUserItemModel(sequelize);
    db.FillForm = fillFormModel(sequelize);
    db.RevisionForm = revisionFormModel(sequelize);
    db.UserXrole = userXroleModel(sequelize);
    // sync all models with database
    await sequelize.sync({ alter: true });

    db.initialized = true;
}

// sequelize models with schema definitions

function formModel(sequelize) {
    const attributes = {
      name: { type: DataTypes.STRING(30), allowNull: false }
    };  
    const options = {
      tableName: 'FORM',
      timestamps: false
    };
    return sequelize.define('FORM', attributes, options);
  }

function versionFormModel(sequelize){
    const attributes={       
        id_form:{
            type: DataTypes.INTEGER(11),
            references: {
                model: "FORM",
                key: 'id'
            }
        },
        version: {type: DataTypes.STRING(11), allowNull:false},
        state: {type: DataTypes.STRING(1), allowNull: false}        
    }
    const options={
        tableName: 'TBL_VERSIONFORM',
        timestamps: false
    }
    return sequelize.define('TBL_VERSIONFORM', attributes, options);
}

function markerFormModel(sequelize){

    const attributes = {       
        id_versionForm:{
            type: DataTypes.INTEGER(11),
            references: {
                model: "TBL_VERSIONFORM",
                key: 'id'
            }
        },
        NO_marker: {type: DataTypes.STRING(11), allowNull:false},
        name:{type: DataTypes.STRING(40), allowNull: false}
    };
    const options={
        tableName: 'TBL_MARKERFORM',
        timestamps: false
    };
    return sequelize.define('TBL_MARKERFORM', attributes, options);
}

function itemFormModel(sequelize){

    const attributes={       
        id_markerForm:{
            type: DataTypes.INTEGER(11),
            references: {
                model: "TBL_MARKERFORM",
                key: 'id'
            }
        },
        NO_item: {type: DataTypes.STRING(11), allowNull: false},
        description: {type: DataTypes.STRING(300), allowNull: false}        
    };
    const options={
        tableName: 'TBL_ITEMFORM',
        timestamps: false
    };
    return sequelize.define('TBL_ITEMFORM', attributes, options);
}

function userModel_2(sequelize){

    const attributes={
        identification:{
            type: DataTypes.INTEGER(11),
            allowNull: false            
        },
        name: {type:DataTypes.STRING(30), allowNull: false},
        first_lastName: {type: DataTypes.STRING(30), allowNull: false},
        second_lastName: {type: DataTypes.STRING(30), allowNull: false}
    };
    const options={
        tableName: 'TBL_USER', // primer letra en mayuscula
        timestamps: false
    };
    return sequelize.define('TBL_USER', attributes, options);
}

function loginModel(sequelize){

    const attributes={
        id_user:{        
            type: DataTypes.INTEGER(11),
            allowNull: false,                  
            references: {
                model: "TBL_USER",
                key: 'id'
            }
        },
        password: {type: DataTypes.STRING, allowNull: false},
        state: {type: DataTypes.STRING(1), allowNull: false}
    }
    const options = {
        defaultScope :{ // se excluye la contraseña de las consultas comunes
            attributes: {exclude: ['password'] }
        },
        scopes:{ // se añade la contraseña para la autenticacion
            withPassword:{ attributes: {}, }
        },
        tableName: 'TBL_LOGIN',
        timestamps: false
    };

    return sequelize.define('TBL_LOGIN', attributes, options);
}

function answerUserItemModel(sequelize){

    const attributes={
        id_user:{
            type: DataTypes.INTEGER(11),
            references: {
                model: "TBL_USER",
                key: "id"
            }
        },
        id_itemForm: {
            type: DataTypes.INTEGER(11),
            references: {
                model: "TBL_ITEMFORM",
                key: 'id'
            }
        },
        answer:{type: DataTypes.STRING(2), allowNull: false},
        references_papers: {type: DataTypes.STRING(50), allowNull: false},
        observations: {type: DataTypes.STRING(150), allowNull: false}
    }
    const options={
        tableName: 'TBL_ANSWERSUSERITEM',
        timestamps: false
    }

    return sequelize.define('TBL_ANSWERSUSERITEM', attributes, options);
}

function fillFormModel(sequelize){

    const attributes = {
        id_versionForm :{
            type: DataTypes.INTEGER(11),
            references: {
                model: "TBL_VERSIONFORM",
                key: 'id'
            }
            
        },
        id_user:{
            type: DataTypes.INTEGER(11),            
            references: {
                model: "TBL_USER",
                key: 'id'
            }
        },
        date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }
    const options = {
        tableName: 'TBL_FILLFORM',
        timestamps: false
    }

    return sequelize.define('TBL_FILLFORM', attributes, options);
}

function revisionFormModel(sequelize){

    const attributes = {
        id_versionForm:{
            type: DataTypes.INTEGER(11),            
            references: {
                model: "TBL_VERSIONFORM",
                key: 'id'
            }
        },
        id_admin:{
            type: DataTypes.INTEGER(11),            
            references: {
                model: "TBL_USERXROLE",
                key: 'id'
            }
        },
        date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }
    const options = {
        tableName: 'TBL_REVISIONFORM',
        timestamps: false
    }

    return sequelize.define('TBL_REVISIONFORM', attributes, options);
}

function userXroleModel(sequelize){
    const attributes = {
        id_user: {
            type: DataTypes.INTEGER(11),            
            references: {
                model: "TBL_USER",
                key: 'id'
            }
        },
        role : {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }
    const options = {
        tableName: 'TBL_USERXROLE',
        timestamps: false
    }
    return sequelize.define('TBL_USERXROLE', attributes, options);
}

function userModel(sequelize) {
    const attributes = {
        username: { type: DataTypes.STRING, allowNull: false },
        hash: { type: DataTypes.STRING, allowNull: false },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}