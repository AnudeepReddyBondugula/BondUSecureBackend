import {decrypt, encrypt, getHash} from '../../utils/cryptoHelper.js'
import User from '../../models/users.js'
import Password from '../../models/passwords.js'

export const getPasswords = async (req, res) => {
    try {
        const {password} = req.body;
        if (!password) {
            return res.status(400).send({
                error: 'Password is required'
            });
        }
        const hashedPassword = getHash(password);
        const user = await User.findOne({username : req.body.userMetaData.username ,password: hashedPassword});

        if (!user) {
            return res.status(400).send({
                error : "Invalid Password"
            });
        }

        const passwords = await Password.find({owner: user._id});
        res.json({passwords});
    }

    catch (err) {
        console.error(err);
        res.status(500).send({
            error: 'Internal Server Error'
        });
    }
}

export const updatePasswords = async (req, res) => {
    try{
        const {operation, password} = req.body;
        const {username} = req.body.userMetaData;
        if (!(password && operation)) {
            return res.status(400).send({
                error: 'All fields are required'
            });
        }
        const hashedPassword = getHash(password);
        const user = User.findOne({username, password : hashedPassword});
        if (!user) {
            return res.status(400).send({
                error : "Invalid Password"
            });
        }

        if (operation === 'ADD') {
            const {title, data} = req.body;
            const encryptedData = encrypt(data, password);
            const newPassword = new Password({
                title,
                encryptedData,
                owner: user._id
            })
            await newPassword.save();
            res.status(201).json({message: 'Password added successfully'});
        }
        else if (operation === 'DELETE') {
            const {passwordId} = req.body;
            const password = await Password.findById(passwordId);
            if (password.owner !== user._id) {
                return res.status(403).json({message: 'Unauthorized'});
            }
            await Password.deleteById(passwordId);
            res.status(204).json({message: 'Password deleted successfully'});
        }
        else if (operation === 'UPDATE') {
            
        }
        else {
            res.status(400).send({
                error : "Invalid operation"
            })
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).send({
            error: "Server error: "
        });
    }
}
