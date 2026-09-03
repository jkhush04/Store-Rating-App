require('dotenv').config();

const app=require('./app');

const {getConnection}=require('./config/db');

const PORT=process.env.PORT || 3000;

async function startServer() {
    try {
        await getConnection();
        console.log('Database connection successful');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }

}

startServer();