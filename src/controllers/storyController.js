import storyService from '../services/storyService';
import db from "../models/index";


let getAllCategories = async (req, res) => {
    try {
        let stories = await storyService.getAllCategories();
        console.log('Huynh check stories: ', stories)
        return res.status(200).json(stories);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let getAllStoriesByCategory = async (req, res) => {
    try {
        let stories = await storyService.getAllStoriesByCategory(req.query.categoryId);
        console.log('Huynh check doctors: ', stories)
        return res.status(200).json(stories);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}


let getContentByStory = async (req, res) => {
    try {
        let content = await storyService.getContentByStory(req.query.id, req.query.chapId);
        //infor ở đây là một object
        return res.status(200).json(content);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}


let getAllStories = async (req, res) => {
    try {
        let stories = await storyService.getAllStories();
        return res.status(200).json(stories)


    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let getAuthor = async (req, res) => {
    try {
        let data = await storyService.getAuthorSerVice(req.query.authorId);
        console.log(data)
        return res.status(200).json(data);
    } catch (e) {
        console.log('get all code: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from server'
        })
    }
}

let handleCreateNewStory = async (req, res) => {
    let message = await storyService.createNewStoryService(req.body);
    // console.log(message);
    return res.status(200).json(message);
}

let handleEditStory = async (req, res) => {
    let data = req.body;
    let message = await storyService.updateStoryDataService(data);
    return res.status(200).json(message);
}

let handleDeleteStory = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter!"
        })
    }
    let message = await storyService.deleteStoryService(req.body.id);
    return res.status(200).json(message);
}

let postInforStory = async (req, res) => {
    try {
        let response = await storyService.saveDetailInforStory(req.body);
        // console.log('Huynh check doctors: ', doctors)
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

// let getAllCode = async (req, res) => {
//     try {
//         let response = await storyService.getAllCodeService(req.body.type);
//         // console.log('Huynh check doctors: ', doctors)
//         return res.status(200).json(response);
//     } catch (e) {
//         console.log(e);
//         return res.status(200).json({
//             errCode: -1,
//             errMessage: 'Eror from the server'
//         })
//     }
// }


let getChapByStory = async (req, res) => {
    try {
        let response = await storyService.getChapByStory(req.query.storyId);
        // console.log('Huynh check doctors: ', doctors)
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}

let getAllStory = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        let response = await storyService.getAllStory(+limit);
        return res.status(200).json(response);

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Eror from the server'
        })
    }
}


module.exports = {
    getAllCategories: getAllCategories,
    getAllStoriesByCategory: getAllStoriesByCategory,
    getContentByStory: getContentByStory,
    getAllStories: getAllStories,
    getAuthor: getAuthor,
    handleCreateNewStory: handleCreateNewStory,
    handleEditStory: handleEditStory,
    handleDeleteStory: handleDeleteStory,
    postInforStory: postInforStory,
    getChapByStory: getChapByStory,
    getAllStory: getAllStory
    // getAllCode: getAllCode
}