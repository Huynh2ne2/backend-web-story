import { Model, where } from 'sequelize';
import db from '../models/index';
require('dotenv').config();
import _, { includes, valuesIn } from 'lodash';
import { raw } from 'body-parser';
import markdown from '../models/markdown';



// let getAllStoriesByCategory = (inputId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             // let data1 = await db.Category.findOne({
//             //     where: {
//             //         categoryId: inputId
//             //     }
//             // })
//             // if (!inputId) {
//             //     resolve({
//             //         errCode: 1,
//             //         errMessage: 'not found inputId'
//             //     })

//             // }
//             // else {

//             //     let data = await db.Story.findOne({
//             //         where: {
//             //             categoryId: data1.categoryId
//             //         },

//             //         include: [{
//             //             model: db.Category
//             //         }

//             //         ],


//             //         raw: false,
//             //         // nest: true
//             //     })
//             //     resolve({
//             //         errCode: 0,
//             //         data: data
//             //     })
//             // }
//             if (!inputId) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Not found id'
//                 })
//             } else {
//                 let data = await db.Story.findAll({
//                     where: {
//                         categoryId: inputId
//                     },
//                     attributes: [
//                         'storyName'
//                     ],

//                     include: [
//                         {
//                             model: db.Category,
//                             as: 'categoryData',
//                             attributes: ['categoryName']
//                         }

//                     ],
//                     raw: false,
//                     nest: true
//                 })
//                 if (!data) {
//                     data = {};

//                 } else {
//                     resolve({
//                         errCode: 0,
//                         data: data
//                     })
//                 }
//             }
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// let getAllStoriesByCategory = (inputId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let data = await db.Category.findAll({
//                 where: {
//                     id: inputId
//                 },
//                 attributes: [
//                     'categoryName'
//                 ],

//                 include: [
//                     {
//                         model: db.Story,
//                         as: 'categoryData',
//                         attributes: ['id', 'storyName', 'createdAt']
//                     }
//                 ],
//                 raw: true,
//                 nest: true
//             })
//             if (!data) {
//                 data = {};

//             } else {
//                 resolve({
//                     errCode: 0,
//                     data: data
//                 })
//             }
//         } catch (e) {
//             reject(e)
//         }
//     })
// }


let getAllCategories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let stories = await db.Category.findAll({
                // where: {
                //     categoryType: 'hd'
                // },
                attribute: {
                    include: ['categoryName']
                }
            })
            resolve({
                errCode: 0,
                data: stories
            })
            console.log('Huynh check error: ', stories);

        } catch (e) {
            reject(e)
        }
    })
}

let getAllStoriesByCategory = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Story.findAll({
                where: {
                    categoryId: inputId
                },
                attributes: ['id', 'storyName', 'createdAt', 'img'],


                include: [
                    {
                        model: db.Category,
                        as: 'categoryData',
                        attributes: [
                            'categoryName'
                        ],
                    }
                ],
                raw: true,
                nest: true
            })
            if (!data) {
                data = {};

            } else {
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}



let getContentByStory = (storyId, chapId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!storyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Not found storyId'
                })
            } else {
                let content = await db.Story.findOne({
                    where: { id: storyId },
                    attributes: ['storyName', 'preview', 'img'],
                    include: [
                        {
                            model: db.User,
                            as: 'authorData',
                            attributes: ['id', 'firstName']
                        },
                        // {
                        //     model: db.Markdown,
                        //     attributes: ['contentHTML', 'contentMarkdown', 'chapId']
                        // },
                        {
                            model: db.Story_Chap,
                            as: 'storyChapData',
                            attributes: {
                                // include: ['storyId', 'chapId'],
                                exclude: ['name']
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'chapTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                    // model: db.Allcode, as: 'chapTypeData', attributes: ['valueEn', 'valueVi'],
                                    include: [
                                        {
                                            model: db.Markdown,
                                            as: 'chapKeyData',
                                            attributes: ['contentHTML', 'contentMarkdown', 'chapId']
                                        }
                                    ]
                                }

                            ]
                        }
                    ],
                    raw: false,//false sẽ convert sang object, true được hiểu là sequelize object chứ ko phải là js object
                    nest: true
                })
                if (content && content.img) {
                    content.img = new Buffer(content.img, 'base64').toString('binary');
                    let markdown = [];
                    markdown = await db.Markdown.findOne({
                        where: {
                            storyId: storyId,
                            chapId: chapId
                        },
                        raw: false,
                        attributes: ['contentHTML', 'contentMarkdown', 'chapId']
                    })
                    // if (markdown) {
                    //     resolve({
                    //         errCode: 0,
                    //         data: markdown
                    //     })
                    // }
                    content.markdown = markdown
                    // console.log('Check data : content.markdown: ', content.markdown)
                    resolve({
                        errCode: 0,
                        content,
                        markdown
                    })
                }
                // resolve({
                //     errCode: 0,
                //     content,
                //     markdown
                // })

            }
            // if (!content)
            //     content = {};

            // resolve({
            //     errCode: 0,
            //     content
            // })
            //}
        } catch (e) {
            reject(e)
        }
    })
}

let getAllStories = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let stories = await db.Story.findAll({
                // attributes: {
                //     exclude: ['img']
                // },
            })
            resolve({
                errCode: 0,
                data: stories
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getAuthorSerVice = (authorId) => {
    return new Promise(async (resolve, reject) => {
        if (!authorId) {
            resolve({
                errCode: 1,
                errMessage: 'Missing parameter'
            })
        } else {
            let authors = [];
            try {
                authors = await db.User.findOne({
                    where: {
                        id: authorId,
                        roleId: 'R2'
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Story,
                            as: 'authorData',
                            attributes: ['id', 'storyName', 'img'],
                            include: [
                                {
                                    model: db.Category,
                                    as: 'categoryData',
                                    attributes: ['id', 'categoryName']
                                }
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })
                console.log('Huynh check side server: ', authors.authorData)
                if (authors && authors.image) {

                    authors.image = new Buffer(authors.image, 'base64').toString('binary');

                }
                if (authors.authorData && authors.authorData.length > 0) {
                    authors.authorData.map(item => item.img = new Buffer(item.img, 'base64').toString('binary'));
                }


                resolve({
                    errCode: 0,
                    data: authors
                })

            } catch (e) {
                reject(e)
            }
        }


    })
}

//thêm, sửa, xóa story

//thêm, sửa xóa user
let createNewStoryService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.Story.create({
                storyName: data.storyName,
                categoryId: data.categoryId,
                authorId: data.authorId,
                preview: data.preview,
                img: data.avatar

            })
            resolve({
                errCode: 0,
                message: 'OK'
            });
        }


        catch (e) {
            reject(e);
        }
    }
    )
}

let deleteStoryService = (storyId) => {
    return new Promise(async (resolve, reject) => {
        let foundStory = await db.Story.findOne({
            where: { id: storyId }
        })
        if (!foundStory) {
            resolve({
                errCode: 2,
                errMessage: 'Story not exist'
            })
        }
        // await foundUser.destroy();//C1
        //C2
        console.log('huynh check', foundStory)

        await db.Story.destroy({
            where: { id: storyId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete Successfull!'
        })
    })
}

let updateStoryDataService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.categoryId || !data.authorId) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let story = await db.Story.findOne({
                where: { id: data.id },
                raw: false
            })
            if (story) {
                story.storyName = data.storyName;
                story.categoryId = data.categoryId;
                story.authorId = data.authorId;
                story.preview = data.preview;
                if (data.avatar) {
                    story.img = data.avatar;
                }

                await story.save();
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




// let deleteUser = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         let foundUser = await db.User.findOne({
//             where: { id: userId }
//         })
//         if (!foundUser) {
//             resolve({
//                 errCode: 2,
//                 errMessage: 'Users not exist'
//             })
//         }
//         // await foundUser.destroy();//C1
//         //C2
//         console.log('huynh check', foundUser)

//         await db.User.destroy({
//             where: { id: userId }
//         })
//         resolve({
//             errCode: 0,
//             errMessage: 'Delete Successfull!'
//         })
//     })
// }

// let updateUserData = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.id || !data.roleId || !data.gender) {
//                 resolve({
//                     errCode: 2,
//                     errMessage: 'Missing required parameter'
//                 })
//             }
//             let user = await db.User.findOne({
//                 where: { id: data.id },
//                 raw: false
//             })
//             if (user) {
//                 user.firstName = data.firstName;
//                 user.lastName = data.lastName;
//                 user.address = data.address;
//                 user.roleId = data.roleId;
//                 user.gender = data.gender;
//                 user.phoneNumber = data.phoneNumber;
//                 if (data.avatar) {
//                     user.image = data.avatar;
//                 }

//                 await user.save();
//                 resolve({
//                     errCode: 0,
//                     message: 'Update user succeed!'
//                 })
//             }
//             else {
//                 resolve({
//                     errCode: 1,
//                     message: 'User not found'
//                 })
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

let saveDetailInforStory = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Huynh check input data: ', inputData)
            if (!inputData.storyId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedChapter
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing paramter',
                    data: inputData
                })

            }
            else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        storyId: inputData.storyId,
                        chapId: inputData.selectedChapter
                    })
                } else if (inputData.action === 'EDIT') {
                    let storyMarkdown = await db.Markdown.findOne({
                        where: {
                            storyId: inputData.storyId,
                            chapId: inputData.selectedChapter
                        },
                        raw: false
                    })
                    //console.log 2 trường hợp: raw: true, raw: false
                    console.log('Huynh check save info story: ', storyMarkdown)
                    if (storyMarkdown) {
                        storyMarkdown.contentHTML = inputData.contentHTML;
                        storyMarkdown.contentMarkdown = inputData.contentMarkdown;
                        storyMarkdown.chapId = inputData.selectedChapter;
                        storyMarkdown.updateAt = new Date();
                        await storyMarkdown.save()
                    }
                }
                let storyInfor = await db.Story_Chap.findOne({
                    where: {
                        storyId: inputData.storyId,
                        chapId: inputData.selectedChapter
                    },
                    attributes: {
                        exclude: ['name']
                    },
                    raw: false
                })
                if (storyInfor) {
                    storyInfor.storyId = inputData.storyId;
                    storyInfor.chapId = inputData.selectedChapter;
                    await storyInfor.save();
                } else {
                    await db.Story_Chap.create({
                        storyId: inputData.storyId,
                        chapId: inputData.selectedChapter
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!',
                    data: storyInfor

                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getChapByStory = (storyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!storyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing param required'
                })
            } else {
                let data = await db.Markdown.findAll({
                    where: {
                        storyId: storyId
                    },
                    attributes: ['chapId'],
                    raw: false,
                })
                // if (data) {
                //     resolve({
                //         errCode: 0,
                //         errMessage: 'Load chap story succeed!',
                //         data
                //     })
                // }
                if (data.length > 0) {
                    let chapId = data.map(item => item.chapId);
                    let chapValues = [];
                    for (let i = 0; i < chapId.length; i++) {
                        let chapValue = await db.Allcode.findOne({
                            where: {
                                keyMap: chapId[i]
                            },
                            attributes: ['valueVi', 'valueEn'],
                            raw: false
                        })
                        chapValues.push(chapValue);
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Load chap story succeed!',
                        chapId: chapId,
                        chapValues: chapValues
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Error load chap story'
                    });
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


// let getAllCodeSerVice = (typeInput) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!typeInput) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Mising required parameters !'
//                 })
//             } else {
//                 let res = {};
//                 let allcode = await db.Allcode.findAll({
//                     where: {
//                         type: typeInput
//                     }
//                 });
//                 res.errCode = 0;
//                 res.data = allcode;
//                 resolve(res);
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }


let getAllStory = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let story = await db.Story.findAll({
                limit: limitInput,
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: story
            })

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllCategories: getAllCategories,
    getAllStoriesByCategory: getAllStoriesByCategory,
    getContentByStory: getContentByStory,
    getAllStories: getAllStories,
    getAuthorSerVice: getAuthorSerVice,
    createNewStoryService: createNewStoryService,
    updateStoryDataService: updateStoryDataService,
    deleteStoryService: deleteStoryService,
    saveDetailInforStory: saveDetailInforStory,
    getChapByStory: getChapByStory,
    getAllStory: getAllStory
    // getAllCodeSerVice: getAllCodeSerVice
}