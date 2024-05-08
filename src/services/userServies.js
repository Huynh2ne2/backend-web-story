import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
const salt = bcrypt.genSaltSync(10);
import emailService from '../services/emailService';

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashpassword = await bcrypt.hashSync(password, salt);
            resolve(hashpassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user exist -> checkUserEmail(true)

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                    // attributes: {
                    //     include: ['email', 'roleId'],
                    //     // exclude: ['password']
                    // }
                });
                if (user) {
                    //Compare password
                    let check = await bcrypt.compareSync(password, user.password);
                    // let check = true;
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        // console.log(user);
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found."
                }
            }
            else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "your's email isn't exist in your system. Please try other email..."
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })


}

// let compareUserPassword = () =>{
//     return new Promise((resolve, reject) =>{
//         try{

//         }catch(e){
//             reject(e)
//         }
//     })
// }

//Để check email của một người dùng cần import db vào


let checkUserEmail = (useremail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: useremail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeSerVice = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Not found id user!!!'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                console.log('Check res: ', res)
                resolve(res);
            }

        } catch (e) {
            reject(e)

        }
    })
}

//thêm, sửa xóa user
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already used. Please try another email!!!'
                })
            } else {
                let hashpasswordfrombcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashpasswordfrombcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    image: data.avatar

                    //bởi vì input không tạo nên sẽ bỏ trường image và positionid

                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }


        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: 'Users not exist'
            })
        }
        // await foundUser.destroy();//C1
        //C2
        console.log('huynh check', foundUser)

        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete Successfull!'
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update user succeed!'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'User not found'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}



let buildUrlEmail = (token) => {
    let result = `${process.env.URL_REACT}/verify_email?token=${token}`;//nối chuỗi tham số trực tiếp

    return result;
}


let changePassWord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    language: data.language,
                    redirectLink: buildUrlEmail(token)
                })
                //upsert user
                let pass = await hashUserPassword(data.password);
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        password: pass,
                        roleId: 'R3',
                        firstName: data.email
                    }
                });
                console.log('Huynh check user: ', user[0])
                if (user && user[0]) {
                    await db.ChangePass.findOrCreate({
                        where: { userId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            userId: user[0].id,
                            token: token
                        }

                    })
                }
                resolve({
                    data: user,
                    errCode: 0,
                    errMessage: 'Change pass user success'
                })
            }

        } catch (e) {
            reject(e);
        }
    })

}

let verifychangePassWord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                console.log('Huynh check data: ', data)
                let changePassWord = await db.ChangePass.findOne({
                    where: {
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (changePassWord) {
                    changePassWord.statusId = 'S2';
                    //await changePassWord.save();

                    await changePassWord.destroy();
                    resolve({
                        errCode: 0,
                        errMessage: 'Change password successful!!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Eror change pass'
                    })
                }
            }
            console.log('huynh check message: ', errMessage)

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    getAllCodeSerVice: getAllCodeSerVice,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    changePassWord: changePassWord,
    buildUrlEmail: buildUrlEmail,
    verifychangePassWord: verifychangePassWord
}