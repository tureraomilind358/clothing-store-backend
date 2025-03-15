const db = require("../config/db");

exports.createUser = async (name, email, password, image) => {
    return db.query("INSERT INTO users (name, email, password, image) VALUES (?, ?, ?)", 
        [name, email, password, image]);
};

exports.getUserByEmail = async (email) => {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return users.length ? users[0] : null;
};
