import * as dotenv from 'dotenv';

const envPath = ".env." + process.env.NODE_ENV;

dotenv.config({ path: envPath });

export default process.env;