const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    guildId: { type: Array, required: true, default: [] },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    maxLevel: { type: Number, default: 1 },
    coins: { type: Number, default: 0 },
    maxCoins: { type: Number, default: 0 },
    inventory: { type: Array, default: [] },
    classes: { type: Array, default: [] },
    characters: { type: Array, default: [] },
    achievements: { type: Array, default: [] },
    ttlMsgs: { type: Number, default: 0 },
    ttlWords: { type: Number, default: 0 },
    ttlChrs: { type: Number, default: 0 },
    ttlInt: { type: Number, default: 0 },
    ttlBttn: { type: Number, default: 0 },
    altUsers: { type: Array, default: [] },
    shrXp: { type: Boolean, default: true },
    shrLvl: { type: Boolean, default: true },
    shrCoins: { type: Boolean, default: true },
    shrInv: { type: Boolean, default: true },
    shrClasses: { type: Boolean, default: true },
    shrChars: { type: Boolean, default: true },
    shrAch: { type: Boolean, default: true }
});

module.exports = mongoose.model('userData', userSchema);