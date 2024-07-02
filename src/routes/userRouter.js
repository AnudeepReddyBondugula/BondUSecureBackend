import express from "express";
import { verifyToken } from "../utils/authHelper.js";
import {getPasswords, updatePasswords} from "../controllers/users/passwords.js";

const router = express.Router();

router.use(async (req, res, next) => {
    try {
        const {jwtoken} = req.body;
        if(!jwtoken) {
            return res.status(400).send({error: 'Invalid jwtoken'});
        }

        try {
            const decoded = await verifyToken(jwtoken);
            if (decoded) {
                req.body.userMetaData = decoded;
                next();
            }
            else {
                return res.status(401).send({error: 'Invalid jwtoken'});
            }
        }
        catch(err) {
            return res.status(401).send({error: 'Invalid jwtoken'});
        }

    }
    catch(err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
})

router.get("/passwords", getPasswords)
router.post("/updatePasswords", updatePasswords)

router.use("*", (req, res) => {
    res.send('Welcome to Users Page');
})
export default router;