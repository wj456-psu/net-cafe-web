module.exports = {
    port: process.env.PORT || "8080",
    db: {
        database: process.env.DB_DATABASE || "account",
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    }
};