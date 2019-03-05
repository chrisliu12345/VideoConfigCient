/**
 * Created by Administrator on 2018/2/1 0001.
 */
app.controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length + 1;
        /*slides.push({
            image: 'img/cflogo.jpg',
            text: '北京航天长峰股份有限公司',
        });*/
        slides.push({
            image: 'img/bgvideo.jpg',
            text: '视频联网平台客户端系统',
        });
        slides.push({
            image: 'img/bgconfig.jpg',
            text: '视频联网平台配置管理工具',
        });
    };
    $scope.addSlide();
});