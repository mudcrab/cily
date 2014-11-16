var appRoot = require('app-root-path');

module.exports = {
    db: {
        server: 'localhost',
        username: 'redoit',
        password: 'redoit',
        db: 'redoit',
        connection: null,
        models: {}
    },
    build: {
    	dir: appRoot + '/builds/'
    },
    builders: []
};