const localDb = require("../database/localDbHandler");

class UserDataManager {
    constructor() {
        this.data = {};
    }

    // Find or create user data
    async fetchUser(userId) {
        let userData = await localDb.findOne('userData', { userId });
        if (!userData) {
            userData = {
                userId,
                guildId: [],
                xp: 0,
                level: 1,
                maxLevel: 1,
                coins: 0,
                maxCoins: 0,
                inventory: [],
                classes: [],
                characters: [],
                achievements: [],
                ttlMsgs: 0,
                ttlWords: 0,
                ttlChrs: 0,
                ttlInt: 0,
                ttlBttn: 0,
                altUsers: [],
                shrXp: true,
                shrLvl: true,
                shrCoins: true,
                shrInv: true,
                shrClasses: true,
                shrChars: true,
                shrAch: true
            };
            await localDb.saveData('userData', userId, userData);
        }
        return userData;
    }

    // Generic function for numeric fields
    async getNumberField(userId, field, defaultValue = 0) {
        let userData = await this.fetchUser(userId);
        if (typeof userData[field] !== "number") {
            userData[field] = defaultValue;
            await localDb.saveData('userData', userId, userData);
        }
        return userData[field];
    }

    // Generic function for boolean fields
    async getBooleanField(userId, field, defaultValue = true) {
        let userData = await this.fetchUser(userId);
        if (typeof userData[field] !== "boolean") {
            userData[field] = defaultValue;
            await localDb.saveData('userData', userId, userData);
        }
        return userData[field];
    }

    // Generic function for array fields
    async getArrayField(userId, field) {
        let userData = await this.fetchUser(userId);
        if (!Array.isArray(userData[field])) {
            userData[field] = [];
            await localDb.saveData('userData', userId, userData);
        }
        return userData[field];
    }

    // XP, Level, Coins, Messages, etc.
    async xpData(userId) { return this.getNumberField(userId, "xp"); }
    async levelData(userId) { return this.getNumberField(userId, "level"); }
    async maxLevelData(userId) { return this.getNumberField(userId, "maxLevel"); }
    async coinsData(userId) { return this.getNumberField(userId, "coins"); }
    async maxCoinsData(userId) { return this.getNumberField(userId, "maxCoins"); }
    async ttlMsgsData(userId) { return this.getNumberField(userId, "ttlMsgs"); }
    async ttlWordsData(userId) { return this.getNumberField(userId, "ttlWords"); }
    async ttlChrsData(userId) { return this.getNumberField(userId, "ttlChrs"); }
    async ttlIntData(userId) { return this.getNumberField(userId, "ttlInt"); }
    async ttlBttnData(userId) { return this.getNumberField(userId, "ttlBttn"); }

    // Inventory, Classes, Characters, Achievements, AltUsers
    async guildIdData(userId) { return this.getArrayField(userId, "guildId"); }
    async inventoryData(userId) { return this.getArrayField(userId, "inventory"); }
    async classesData(userId) { return this.getArrayField(userId, "classes"); }
    async charactersData(userId) { return this.getArrayField(userId, "characters"); }
    async achievementsData(userId) { return this.getArrayField(userId, "achievements"); }
    async altUsersData(userId) { return this.getArrayField(userId, "altUsers"); }

    // Shared Data Booleans
    async shrXpData(userId) { return this.getBooleanField(userId, "shrXp"); }
    async shrLvlData(userId) { return this.getBooleanField(userId, "shrLvl"); }
    async shrCoinsData(userId) { return this.getBooleanField(userId, "shrCoins"); }
    async shrInvData(userId) { return this.getBooleanField(userId, "shrInv"); }
    async shrClassesData(userId) { return this.getBooleanField(userId, "shrClasses"); }
    async shrCharsData(userId) { return this.getBooleanField(userId, "shrChars"); }
    async shrAchData(userId) { return this.getBooleanField(userId, "shrAch"); }

}

module.exports = UserDataManager;
