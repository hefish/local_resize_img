/**
* local_resize_img
* by hefish@gmail.com
* 2015-04-08
*/


var MAX_SIZE = 600;
var LIT_SIZE = 80;

$.fn.local_resize_img = function(obj) {
    this.on('change', function() {
        
        var file_path = this.files[0];

        load_image(file_path);
    });

    function load_image(file_path) {
        if (! file_path.type.match(/image.*/)) {
            if (window.console) {
                console.log("我说哥哥，只能选图片");
            }else {
                window.confirm("我说哥哥，只能选图片啊");
            }
            return ;
        }
        
        var reader = new FileReader() ;
        reader.onloadend = function(e) {
            //获取到图片内容，准备渲染 (内容是base64滴，还带header)
            render(e.target.result);
        };
        
        reader.readAsDataURL(file_path);
    };
    
    function render(img_data) {
        var img = new Image() ;
        img.src = img_data; //先把图啊，用个img对象装起来

        img.onload = function () {
            var this_img = this;

            var w = this_img.width, lit_w, lit_h,
                h = this_img.height,
                scale = w/h;   //宽高比
            
            //计算缩放之后的宽高
            if (Math.min(w,h) > MAX_SIZE) {
                if (w > h) {
                    h=MAX_SIZE; w=h*scale;
                    lit_h = LIT_SIZE; lit_w = lit_h * scale;
                }
                else {
                    w=MAX_SIZE; h = w/scale;
                    lit_w = LIT_SIZE ; lit_h = w/scale;
                }
            }
            
            //取exif.orientation
            
            EXIF.getData(this);
			var orientation = EXIF.getTag(this, "Orientation") || 1;
			
            var rotate_degree = 0;
            switch(orientation) {
                case 1:
				    rotate_degree = 0; break;
                case 8:
                    rotate_degree = -90;
                    break;
                case 3:
                    rotate_degree = 180; 
                    break;
                case 6:
                    rotate_degree = 90; 
                    break;
            }

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            
            var lit_canvas = document.createElement('canvas');
            var lit_ctx = lit_canvas.getContext('2d');
            
            if (rotate_degree == 90 || rotate_degree == -90) {
                $(canvas).attr({width: h, height: w});
                $(lit_canvas).attr({width: lit_h, height: lit_w});
            }else {
                $(canvas).attr({width: w, height: h});
                $(lit_canvas).attr({width: lit_w, height: lit_h});
            }
            
			//draw on big resized canvas MAX_SIZE
            var canvas_width = $(canvas).attr("width");
            var canvas_height = $(canvas).attr("height");
            
            ctx.translate(canvas_width/2, canvas_height/2);
            ctx.rotate(rotate_degree * Math.PI/180);
            ctx.drawImage(this_img, -w/2,-h/2, w,h);
            
            //draw on thumbnail canvas  LIT_SIZE
            var lit_canvas_w = $(lit_canvas).attr("width");
            var lit_canvas_h = $(lit_canvas).attr("height");
            
            lit_ctx.translate(lit_canvas_w/2, lit_canvas_h/2);
            lit_ctx.rotate(rotate_degree * Math.PI/180);
            lit_ctx.drawImage(this_img, -lit_w/2, -lit_h/2, lit_w, lit_h);                
            

            var base64 = canvas.toDataURL("image/jpeg", 0.8);
            var lit_base64 = lit_canvas.toDataURL("image/jpeg", 0.8);

            if (base64.indexOf("image/jpeg") > 0) {
            }
            else {
                var encoder = new JPEGEncoder(80);
                var img_data = ctx.getImageData(0,0,canvas_width,canvas_height);
	            base64 = encoder.encode(img_data);
            } 

            var result = {
                base64: base64,
                lit_base64: lit_base64
            };
            
            obj.success(result);

        };
    }
};
