const UserDataManager = require("../classes/userDataClass");
const userManager = new UserDataManager();
const activeCache = require('memory-cache');
const autoCache = require('node-cache');
const localDb = require('../database/localDbHandler');

const userCaches = new activeCache.Cache();
const loadCache = new autoCache();
const saveCache = new autoCache( { stdTTL: 0, checkperiod: 0 } );

const userActiveStatus = {};
const userTimeouts = {};

const cacheTime = minutes => minutes * 60 * 1000;
const activeTimer = (userId) => {
    const minutes = 30;
    userActiveStatus[userId] = true;

    if (userTimeouts[userId]) {
        clearTimeout(userTimeouts[userId]);
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
        const findUserData = await localDb.findOne('userData', { userId });
        if (!findUserData) {
            const newUser = await userManager.fetchUser(userId);
            loadCache.set(userId, newUser);
        } else {
            loadCache.set(userId, findUserData);
        }
        const loadUser = loadCache.get(userId);
        userCaches.put(userId, loadUser);
    } 
    setUserActive(userId);
    return userCaches.get(userId);
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
    userTimeouts,
    userManager
};

/*
client.on("messageCreate", async (message) => {
    const user = await userManager.fetchUser(message.author.id);
    getUserCache(user.userId);
    userCaches.put(user.userId.ttlMsgs, + 1);
    userCaches.put(user.userId.ttlWords, + message.content.split(" ").length);
    userCaches.put(user.userId.ttlChrs, + message.content.length);
})

client.on("interactionCreate", async (interaction) => {
    const user = await userManager.fetchUser(interaction.user.id);
    getUserCache(user.userId);
})



client.on("ready", async () => {
    
})
*/
