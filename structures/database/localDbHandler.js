const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../functions/logger');

class LocalDbHandler {
    constructor() {
        this.dbPath = path.join(__dirname, '../../../../Database');
        this.userDataPath = path.join(this.dbPath, 'userData');
        this.initialized = false;
    }

    async initialize() {
        try {
            // Ensure Database directory exists
            await this.ensureDirectoryExists(this.dbPath);
            
            // Ensure userData directory exists
            await this.ensureDirectoryExists(this.userDataPath);
            
            this.initialized = true;
            logger("Local database initialized", "success");
            return true;
        } catch (error) {
            logger(`Failed to initialize local database: ${error}`, "error");
            return false;
        }
    }

    async ensureDirectoryExists(dirPath) {
        try {
            await fs.access(dirPath);
        } catch (error) {
            // Directory doesn't exist, create it
            await fs.mkdir(dirPath, { recursive: true });
            logger(`Created directory: ${dirPath}`, "info");
        }
    }

    async findOne(collection, query) {
        if (!this.initialized) await this.initialize();
        
        if (collection === 'userData') {
            const userId = query.userId;
            if (!userId) return null;
            
            try {
                const filePath = path.join(this.userDataPath, `${userId}.json`);
                const data = await fs.readFile(filePath, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                // File doesn't exist or other error
                return null;
            }
        }
        return null;
    }

    async saveData(collection, id, data) {
        if (!this.initialized) await this.initialize();
        
        if (collection === 'userData') {
            try {
                const filePath = path.join(this.userDataPath, `${id}.json`);
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                return true;
            } catch (error) {
                logger(`Failed to save data for ${id}: ${error}`, "error");
                return false;
            }
        }
        return false;
    }

    async updateData(collection, query, updateData) {
        if (!this.initialized) await this.initialize();
        
        if (collection === 'userData') {
            const userId = query.userId;
            if (!userId) return false;
            
            try {
                // Get existing data
                const existingData = await this.findOne(collection, query) || {};
                
                // Merge with update data
                const updatedData = { ...existingData, ...updateData };
                
                // Save back to file
                return await this.saveData(collection, userId, updatedData);
            } catch (error) {
                logger(`Failed to update data for ${userId}: ${error}`, "error");
                return false;
            }
        }
        return false;
    }
}

module.exports = new LocalDbHandler();
