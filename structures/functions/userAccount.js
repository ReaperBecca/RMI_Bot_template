const UserDataManager = require('../classes/userDataManager');
const userManager = new UserDataManager();
const localDb = require('../database/localDbHandler');

async function getUserData(userId) {
    if (!userId) {
        return null;
    }

    // Directly fetch from local database
    return await userManager.fetchhUserData(userId);
}

module.exports = {
    getUserData,
    userManager
}