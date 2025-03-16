const userAccount = require('../../functions/userAccount');
const client = require("../../client");
/*
const userCaches = new activeCache.Cache();
const loadCache = new autoCache();
const saveCache = new autoCache( { stdTTL: 0, checkperiod: 0 } );

const cacheTime = minutes => minutes * 60 * 1000;
const activeTimer = (userId) => {
    const minutes = 30;
    userActiveStatus[userId] = true;

    if (userTimerouts[userId]) {
        clearTimeout(userTimerouts[userId]);
    }

    userTimeouts[userId] = setTimeout(() => {
        userActiveStatus[userId] = false;
    },  cacheTime(minutes));

    return userTimeouts[userId];
};

const isUserActive = (userId) => {
    return userActiveStatus[userId] === true;
};

const setUserActive = (userId) => {
    activeTimer(userId);
    return true;
};

async function getUserCache(userId) {
    if (!userId) {
        return Object.keys(userCaches);
    }
    if (!userCaches[userId]) {
        const findUserData = await UserData.findOne({ userId });
        if (!findUserData) {
            const newUser = await userManager.fetchUser(userId);
            loadCache[userId].set(userId, newUser);
        } else {
            loadCache[userId].set(userId, findUserData);
        }
        const loadUser = loadCache[userId];
        userCaches.put(userId, loadUser);
    } 
    setUserActive(userId);
    return userCaches[userId];
}

module.exports = {
    getUserCache,
    isUserActive,
    setUserActive,
    userCaches,
    loadCache,
    saveCache,
    cacheTime,
    activeTimer,
    userActiveStatus,
    userTimeouts
};
*/

client.on("messageCreate", async (message) => {
    const user = await userAccount.userManager.fetch(message.author.id);
    userAccount.userCaches(user.userId);
    userAccount.userCaches.put(user.userId.ttlMsgs, + 1);
    userAccount.userCaches.put(user.userId.ttlWords, + message.content.split(" ").length);
    userAccount.userCaches.put(user.userId.ttlChrs, + message.content.length);
})

client.on("interactionCreate", async (interaction) => {
    const user = await userAccount.userManager.fetch(interaction.user.id);
    userAccount.userCaches(user.userId);
    userAccount.userCaches.put(user.userId.ttlInt, + 1);
    if (interaction.isButton()) {
        userAccount.userCaches.put(user.userId.ttlBtn, + 1);
    }
})



client.on("ready", async () => {
    const appSave = 5 * 60 * 1000;

    const appCache = () => {
        setTimeout(() => {
            if ((userAccount.userCaches.size === 0) || (userAccount.saveCache.size === 0)) {
                return;
            } else {
                const checkActiveUsers = userAccount.userCaches();
                const checkedUsers = userAccount.saveCache();
                for (const user of checkActiveUsers) {
                userAccount.saveCache.set(user.userId, userAccount.userCaches(user));
                if (!isUserActive(user)) {
                    userAccount.userCaches.del(user);
                }
                }
                for (const user of checkedUsers) {
                    const nextUser = checkedUsers.take(user);
                    const saveUser = userAccount.userData.findOne({ userId: nextUser.userId });
                    saveUser.updateMany({}, { $set: nextUser });
                    console.log(`Saved ${nextUser.userId} to the database.`);
                    console.log(nextUser);
                }
            }
            appCache();
        }, appSave);
    }
})

