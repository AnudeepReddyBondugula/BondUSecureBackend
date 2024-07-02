import mongoose from 'mongoose';
import userModel from './users.js';

const {Schema} = mongoose;

const passwordSchema = new Schema({
    owner : {type : Schema.Types.ObjectId, ref : "User", required: true},
    title : {type : 'string', required: true},
    encryptedData : {type : 'string', required: true}
});


const passwordModel = new mongoose.model('Password', passwordSchema);


export default passwordModel;