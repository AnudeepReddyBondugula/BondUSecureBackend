import connectDB from './src/config/mongoDB.config.js'
import constants from './src/config/constants.js'

import app from './src/app.js'

const main = async () => {
    try {
        await connectDB()
        app.listen(constants.PORT, () => console.log(`Server running on port ${constants.PORT}`))
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

main();