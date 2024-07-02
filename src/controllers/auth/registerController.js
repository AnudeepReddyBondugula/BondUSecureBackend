import User from '../../models/users.js';
import {getHash} from '../../utils/cryptoHelper.js'
import {generateToken} from '../../utils/authHelper.js'

const registerController = async (req, res) => {
    try{
        const {username, email, password} = req.body;

        if (!(username && email && password)){
            return res.status(400).json({error: 'All fields are required'});
        }
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string'){
            return res.status(400).json({error: 'Invalid input type'});
        }

        const existingUser = await User.findOne({$or: [{username}, {email}]});
        if (existingUser){
            return res.status(400).json({error: 'User already exists'});
        }

        const hashedPassword = getHash(password);
        const user = new User({username, email, password: hashedPassword});
        await user.save();

        const jwtoken = generateToken({
            id: user._id,
            username: user.username,
            role: user.role
        })

        res.status(201).send({message: "User Created Successfully", jwtoken});

    }
    catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
}

export default registerController