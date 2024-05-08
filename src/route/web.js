import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import storyController from '../controllers/storyController';
import passport from 'passport';

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     return res.send('Hello world with node js')
    // });
    //Muốn lấy thông tin: get, tạo thông tin thì dùng (post),  cập nhật thông tin thì dùng (put), xóa thì (delete)
    //rest API
    //Lấy thông tin thì dùng get
    //Mỗi 1 lần mà người dùng lấy địa chỉ đường link trên website thì express sẽ tìm kiếm đường link ấy trong file web.js
    //Tại sao nó lại tìm kiếm ở đây???
    //Bởi vì trong file server.js chúng ta đã nhúng tất cả các link cho biết rồi
    router.get('/hoidanit', (req, res) => {
        return res.send('Hello world with hoidanit')
    });

    //cách chuyển tới file homeController
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    //có nghĩa là khi người dùng truy cập tới đường link này 
    //thì express nó sẽ bảo là t sẽ gọi cái file homeController và nó sẽ gọi cái hàm getHomePage r nó sẽ trả về dòng chữ
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);//nhập, tạo thông tin
    router.get('/get-crud', homeController.displayGetCRUD);//lấy thông tin
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);


    router.get('/delete-crud', homeController.deleteCRUD);

    //sử dụng bên react thì dùng từ nối /api
    //User
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.get(`/api/allcode`, userController.getAllCode);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    //story

    router.get('/api/get-all-stories', storyController.getAllCategories);

    //Thêm, sửa, xóa story
    router.post('/api/create-new-story', storyController.handleCreateNewStory);
    router.put('/api/edit-story', storyController.handleEditStory);
    router.delete('/api/delete-story', storyController.handleDeleteStory);
    //Lấy các story dựa vào thể loại

    router.get('/api/get-all-stories-by-category', storyController.getAllStoriesByCategory);

    router.get('/api/get-content-by-stories', storyController.getContentByStory);
    //Lưu thông tin nhập cho story
    router.post('/api/save-infor-stories', storyController.postInforStory);

    router.get('/api/get-all-stories-all', storyController.getAllStories);

    //Lấy tên tác giả 
    router.get('/api/all-author', storyController.getAuthor);

    //cách viết api
    // return app.use("/v1/api", router);

    //Lấy chap story
    // router.get('/api/allcode', storyController.getAllCode);


    router.get('/api/get-chap-story', storyController.getChapByStory);

    //lấy all story
    router.get('/api/get-all-story', storyController.getAllStory);


    //login with google
    router.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/redirect',
        passport.authenticate('google', { session: false, failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log('Huynh check req.user', req.user)
            res.redirect('/');
        });
    router.get('/logingoogle', homeController.getLogin);


    router.post('/api/change-password', userController.changePassWord);

    router.post('/api/verify-change-password', userController.verifychangePassWord);

    return app.use("/", router);


}

module.exports = initWebRoutes;