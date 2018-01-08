
module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: "127.0.0.1",
            user: "root",
            password: "",
            database: "skyshi_train",
            charset: 'utf8'
        },
        seeds: {
            directory: './seeds/dev'
        }
    }
};