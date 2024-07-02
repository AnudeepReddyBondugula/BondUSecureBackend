import mongoose from 'mongoose';
const {Schema} = mongoose;

const userSchema = new Schema({
    username : {type: 'String', required: true},
    email : {type: 'String', required: true},
    password : {type: 'String', required: true},
    role : {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    encrpytedPasswords : {
        type: [], 
        default : [],
    }
});

const userModel = new mongoose.model("Users", userSchema);

export default userModel;