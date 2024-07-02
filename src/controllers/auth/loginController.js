import { getHash } from "../../utils/cryptoHelper.js";
import User from '../../models/users.js'
import { generateToken } from "../../utils/authHelper.js";
const loginController = async (req, res) => {
    try{
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).json({ error: 'Required All Fields' });
        }

        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Invalid input type' });
        }
        const hashedPassword = getHash(password);
        const user = await User.findOne({ username, password: hashedPassword });
        if (!user){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const jwtoken = generateToken({
            id: user._id,
            username: user.username,
            role: user.role
        })
        
        return res.status(200).json({
            message: 'Logged In Successfully',
            jwtoken
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
}

export default loginController;