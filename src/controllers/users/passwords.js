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
        const decryptedPasswords = [];

        for(let i = 0; i < passwords.length; i++) {
            decryptedPasswords.push({
                passwordId : passwords[i]._id,
                title: passwords[i].title,
                data: decrypt(passwords[i].encryptedData, password)
            })
        }
        res.json({passwords: decryptedPasswords});
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
        const user = await User.findOne({username, password : hashedPassword});
        if (!user) {
            return res.status(400).send({
                error : "Invalid Password"
            });
        }

        if (operation === 'ADD') {
            const {title, data} = req.body;
            const tempPassword = await Password.findOne({title, owner : user._id});
            if (tempPassword) {
                return res.status(400).json({message: 'Title already exists'});
            }
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
            if (!password) {
                return res.status(404).json({message: 'Invalid Password ID'});
            }
            if (password.owner.toString() !== user._id.toString()) {
                return res.status(403).json({message: 'Unauthorized'});
            }
            await Password.deleteOne({_id: passwordId});
            res.status(202).json({message: 'Password deleted successfully'});
        }
        else if (operation === 'UPDATE') {
            const {passwordId, password, title, data} = req.body;
            const oldPassword = await Password.findById(passwordId);
            if (!oldPassword) {
                return res.status(404).json({message: 'Invalid Password ID'});
            }
            if (oldPassword.owner.toString() !== user._id.toString()){
                return res.status(403).json({message: 'Unauthorized'});
            }

            const encryptedPasssword = encrypt(data, password);

            await Password.updateOne(
                { _id: passwordId },
                { $set: { title, encryptedData: encryptedPasssword } }
            );
            res.status(200).json({message: 'Password updated successfully'});
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
