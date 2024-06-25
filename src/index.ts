import { App } from "./app";
import connect from "./config/datasource";
import logger from "./config/logger";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 1337;

(async () => {
    try {
        // Initialize the application
        const appInstance = new App();
        
        await appInstance.initialize();
        // Start the server
        await appInstance.startServer(Number(port));
        logger.info(`Server started on port ${port}`);
        
    } catch (error) {
        logger.error(`Failed to start the server: ${error}`);
    }
})();
