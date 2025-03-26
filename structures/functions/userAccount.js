const UserDataManager = require('../classes/userDataClass');
const userManager = new UserDataManager();

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