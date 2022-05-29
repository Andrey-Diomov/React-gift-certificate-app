const userData = 'userData';
const adminRole = 'ADMIN';

export const setUserData = (data) => {
    sessionStorage.setItem(userData, JSON.stringify(data));
}

export const removeUserData = () => {
    sessionStorage.removeItem(userData);
}

export const getUserLogin = () => {
    const userDataString = sessionStorage.getItem(userData);
    if (userDataString === null) {
        return undefined;
    } else {
        return JSON.parse(userDataString)?.login
    }
}

export const getUserToken = () => {
    return getUserData().jwtToken;
}

export const getUserData = () => {
    const userDataString = sessionStorage.getItem(userData);
    return JSON.parse(userDataString);
}

export const isRoleAdmin = () => {
    const userDataString = sessionStorage.getItem(userData);

    if (userDataString === null) {
        return false;
    } else {
        return JSON.parse(userDataString).roles.indexOf(adminRole) > -1;
    }
}