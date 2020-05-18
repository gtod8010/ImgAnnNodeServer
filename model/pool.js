const mysql = require('mysql2/promise');
const ConnectionPool = _getConnPoolFunc();


module.exports = (dbConfig) => {
    return ConnectionPool.getInstance(dbConfig);
}

// connection pool is singleton
function _getConnPoolFunc(){
    let instance;
    const init = (dbConfig) => {
        return mysql.createPool(dbConfig);
    }

    return {
        getInstance : (dbConfig) => {
            if (!instance) {
                instance = init(dbConfig);
            }
            return instance;
        }
    }
}