const userAccount = require('../../functions/userAccount');
const client = require("../../client");
const localDb = require("../../database/localDbHandler");
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
    if (!userCaches.get(userId)) {
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
    try {
        const user = await userAccount.userManager.fetchUser(message.author.id);
        const userCache = await userAccount.getUserCache(user.userId);

        if (userCache) {
            userCache.ttlMsgs = (userCache.ttlMsgs || 0) + 1;
            userCache.ttlWords = (userCache.ttlWords || 0) + message.content.split(" ").length;
            userCache.ttlChrs = (userCache.ttlChrs || 0) + message.content.length;

            // Update cache
            userAccount.userCaches.put(user.userId, userCache);
        }
    } catch (error) {
        console.error("Error processing message for user data:", error);
    }
});

client.on("interactionCreate", async (interaction) => {
    try {
        const user = await userAccount.userManager.fetchUser(interaction.user.id);
        const userCache = await userAccount.getUserCache(user.userId);

        if (userCache) {
            userCache.ttlInt = (userCache.ttlInt || 0) + 1;

            if (interaction.isButton()) {
                userCache.ttlBttn = (userCache.ttlBttn || 0) + 1;
            }

            // Update cache
            userAccount.userCaches.put(user.userId, userCache);
        }
    } catch (error) {
        console.error("Error processing interaction for user data:", error);
    }
});



client.on("ready", async () => {
    const appSave = 5 * 60 * 1000;

    const appCache = () => {
        setTimeout(async () => {
            try {
                if (userAccount.userCaches.size === 0) {
                    appCache();
                    return;
                }

                const checkActiveUsers = userAccount.getUserCache();

                for (const userId of checkActiveUsers) {
                    const userData = userAccount.userCaches.get(userId);

                    if (userData) {
                        // Save to local storage
                        await localDb.saveData('userData', userData);
                        console.log(`Saved ${userId} to the local database.`);

                        // If user is not active, remove from cache
                        if (!userAccount.isUserActive(userId)) {
                            userAccount.userCaches.del(userId);
                        }
                    }
                }
            } catch (error) {
                console.error("Error in appCache:", error);
            }
        }, appSave);
    }
});

