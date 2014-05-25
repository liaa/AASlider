/*! AASlider - v0.1.0 - 2014-05-25
* https://github.com/liaa/AASliderr
* Copyright (c) 2014 liaa; Licensed MIT */
(function($) {

  // Collection method.
  $.fn.slider = function(options) {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      var settings = $.extend({
        width : null,
        height : null,
        direction : 'left',
        duration : 1000,
        stopDuration : 1000
      },options);

      // Slider Object
      var slider = {};
      slider.time = 0; //
      slider.container = $(this);
      slider.settings = settings;
      slider.boxArray = [];

    
      // varaible

      slider.init = function(){
        // config slider
        slider.container.css({
          position : 'relative'
        });

        // create tow box add to boxArray
        var $boxA = slider.createBox();
        var $boxB = slider.createBox();
        slider.boxArray = [$boxA, $boxB];
        slider.direction = slider.directionToSlide();
        slider.contents = slider.container.children('li');  
        slider.container.empty();
        
        // setupBoxPostion
        slider.setupABPostion();
        
        // fillBoxContent
        slider.setupABFill(); //将timer+1
        
        // animat boxs
        setTimeout(slider.animat, slider.settings.stopDuration);
      
      }
      slider.animat = function(){
        console.log(slider.direction);
        var start = new Date().getTime();
        var fromA = slider.fromPositionOfBoxA();
        var fromB = slider.fromPositionOfBoxB();
        var duration = slider.settings.duration;
        var dx = slider.dx();

        var timeId = window.setInterval(function(){
          var now = new Date().getTime();
          var progress = (now - start)/duration;
          if (progress >= 1) {
            slider.direction = slider.directionToSlide();
            slider.time++;
            window.clearInterval(timeId);
            slider.revertBoxState();
            slider.resetBoxPosition();
            slider.updateABFill();
            window.setTimeout(slider.animat, slider.settings.stopDuration);

            // 调整位置



          } else {
            // 移动元素
            var delta = slider.delta(progress) * dx;
            slider.moveBoxesWith(fromA, fromB, delta);

          }



        }, 1000/60);




      };

      slider.delta = function(progress) {
        // // 控制运动的方程
        // return Math.pow(progress, 8);
        // for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
          // var x = 1;
          // return Math.pow(progress, 2) * ((x + 1) * progress - x)
        return progress;


  }

      slider.fromPositionOfBoxA = function(){
        var direction = slider.direction; 
        if (direction == 'left' || direction == 'right') {
          return Number(slider.boxArray[0].css('left').slice(0,-2));
        } else {
          return Number(slider.boxArray[0].css('top').slice(0,-2));
        }
      }
      slider.fromPositionOfBoxB = function(){
        var direction = slider.direction; 
        if (direction == 'left' || direction == 'right') {
         return Number(slider.boxArray[1].css('left').slice(0,-2));
        } else {
          return Number(slider.boxArray[1].css('top').slice(0,-2));
        }

      }

      slider.resetBoxPosition = function(){
        for (var i = 0; i < slider.boxArray.length; i++) {
          var $box = slider.boxArray[i];
          if ($box.isShow == true) {
            slider.placeToStage($box);
          }else {
            slider.placeToCurtain($box);
          }
        };
      }
      slider.revertBoxState = function(){
        slider.boxArray[0].isShow = !slider.boxArray[0].isShow ;
       slider.boxArray[1].isShow = !slider.boxArray[1].isShow ;
      }
      slider.moveBoxesWith = function(fromA, fromB, delta) {
        var direction = slider.direction;
        // move horizontal TODO: move vertically
        if (direction == 'left' || direction == 'right') {
          slider.boxArray[0].css({
            left : fromA + delta
          });
          slider.boxArray[1].css({
            left : fromB + delta
          });
        } else {
          slider.boxArray[0].css({
            top : fromA + delta
          });
          slider.boxArray[1].css({
            top : fromB + delta
          });
        }
      }
      slider.dx = function(){
        var direction = slider.direction;
        // 目前假设为往上 TODO: 加上下左右的支持
        switch(direction) {
          case 'left' :
            return (-slider.settings.width);
          case 'right' :
            return (slider.settings.width);
          case 'top' :
            return (-slider.settings.height);
          case 'bottom' :
            return (slider.settings.height);
        }
      }
      slider.setupABPostion = function(){
        var boxA = slider.boxArray[0];
        var boxB = slider.boxArray[1];
        slider.placeToStage(boxA);
        slider.placeToCurtain(boxB);
        boxA.appendTo(slider.container);
        boxB.appendTo(slider.container);
      }
      slider.setupABFill = function(){
        var box1 = slider.boxArray[0];
        var box2 = slider.boxArray[1];
        // box1.css({
        //   backgroundColor : slider.color[0]
        // });
        // box2.css({
        //   backgroundColor : slider.color[1]
        // });
        box1.append(slider.contents[0]);
        box2.append(slider.contents[1]);
        slider.time++;
      }
      slider.updateABFill = function(){
        var length = slider.boxArray.length;
        var fillLength = slider.contents.length;
        for (var i = 0; i < length; i++) {
          var box = slider.boxArray[i];
          if (box.isShow == false) {
            // box.css({
            //   backgroundColor : slider.color[slider.time%fillLength]
            // })
            box.empty();
            box.append(slider.contents[slider.time%fillLength]);
          };
        };
      }
      slider.createBox = function(){
        var $box = $('<div></div>');
        $box.css({
          position : 'absolute',
          width : slider.settings.width,
          height : slider.settings.height,
        });
        $box.isShow = false;
        return $box;
      }
      slider.placeToStage = function(ele) {
        var $ele = (ele instanceof jQuery) ? ele : $(ele);
        $ele.css({
          top : 0,
          left : 0
        });
        $ele.isShow = true;
      }
      slider.placeToCurtain = function(ele) {
        var $ele = (ele instanceof jQuery) ? ele : $(ele);
        var direction = slider.direction;
        switch (direction) {
          case 'left' :
            $ele.css({
              left : settings.width,
              top : 0
            });
            break;
          case 'right' :
            $ele.css({
              left : -slider.settings.width,
              top : 0
            });
            break;
          case 'top' :
            $ele.css({
              left : 0,
              top : settings.height
            });
            break;
          case 'bottom' :
            $ele.css({
              left : 0,
              top : -settings.height
            });
            break;
        }
        $ele.isShow = false;
      }
        slider.directionToSlide = function(){
        // TODO: 根据settings输出方向
        var directions = ['top', 'left', 'right', 'bottom'];
        var i = getRandomInt(0,3);
        if (slider.settings.direction == 'random') {
          return directions[i];
        };
        switch (slider.settings.direction) {
          case 'left' :
            return 'left';
            break;
          case 'top' :
            return 'top';
            break;
          case 'right' :
            return 'right';
            break;
          case 'bottom' :
            return 'bottom';
            break;
        }
      }
      slider.init();
    });
  };
}(jQuery));

//helper
//
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
