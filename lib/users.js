import fs from 'fs/promises';
import bcrypt from 'bcrypt';

const USERS_JSON_FILENAME = 'users.json';
const SALT = "";

export async function fetchAllUsers() {
    const data = await fs.readFile(USERS_JSON_FILENAME);
    return JSON.parse(data.toString());
}

export async function fetchUser(id) {
    const users = await fetchAllUsers();
    return users.find(user => user.id === id);
}

export async function createUser(newUser) {
    const hashedPassword = await bcrypt.hash(newUser.password + SALT, 10);
    const users = await fetchAllUsers();
    users.push({ ...newUser, password: hashedPassword });
    await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(users));
}

export async function removeUser(id) {
    const users = await fetchAllUsers();
    const updatedUsers = users.filter(user => user.id !== id);
    await fs.writeFile(USERS_JSON_FILENAME, JSON.stringify(updatedUsers));
}
