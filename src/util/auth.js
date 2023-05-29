import Cookie from "js-cookie";

let name = "Admin-Token";

export function getToken() {
    return Cookie.get(name);
}
export function setToken(data) {
    return Cookie.set(name, data);
}
export function removeToken() {
    return Cookie.remove(name);
}