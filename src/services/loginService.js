import { where } from "sequelize";
import db from "../models/index";
import { raw } from "body-parser";

let upsertUserSocialMedia = async (typeAcc, dataRaw) => {

    try {
        let user = null;
        if (typeAcc === 'GOOGLE') {
            user = await db.User.findOne({
                where: {
                    email: dataRaw.email,
                    type: typeAcc
                },
                raw: true
            })
            if (!user) {
                //create user account
                user = await db.User.create({
                    email: dataRaw.email,
                    lastName: dataRaw.lastName,
                    type: typeAcc
                })
                user = user.get({ plain: true });
            }
        }
        return user;

    } catch (e) {

    }

}



module.exports = {
    upsertUserSocialMedia
}