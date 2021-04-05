let image = document.querySelector('.image__item');
let isImgTransparrent = false;
const background = document.querySelector('.background');

checkTransparrent();




function checkTransparrent() {
    image.addEventListener('load', isTransparent, true);
    var img = new Image(),
        bImg = image;
    img.src = bImg.src;


    function isTransparent(e) {

        var canvas = document.getElementById('imgcheck-canvas') || (function (_this) {
            var e = document.createElement('canvas');
            e.setAttribute('width', _this.width);
            e.setAttribute('height', _this.height);
            e.setAttribute('id', _this.id + '-canvas');
            e.setAttribute('style', 'display:none;');
            document.body.appendChild(e);
            var cx = e.getContext('2d');
            cx.drawImage(_this, 0, 0, _this.width, _this.height);
            return e;
        })(this);
        if (canvas.getContext === undefined) {
            return false;
        }
        var ctx = canvas.getContext('2d');

        for (let x = 0; x < image.clientWidth; x += 10) {
            for (let y = 0; y < image.clientHeight; y += 10) {
                ((ctx.getImageData(x, y, 1, 1).data[3] == 0) ? isImgTransparrent = true : isImgTransparrent = false)

            }
        }
        changeBg(image, isImgTransparrent)
    }
}


/////
function changeBg(image, isImgTransparrent) {
    const colorThief = new ColorThief();
    let img = image;


    // Make sure image is finished loading
    if (img.complete) {
        colorThief.getColor(img);
    } else {
        img.addEventListener('load', function () {
            colorThief.getColor(img);
        });
    }

    let colors = colorThief.getPalette(img);
    let dominantColor = colorThief.getColor(img);


    if (isImgTransparrent) {
        let arrayOfContrastingColors = [];

        colors.forEach(item => {
            arrayOfContrastingColors.push(contrastingColor(item))
        });

        let obj = countColors(arrayOfContrastingColors);


        if (obj.white > obj.black) {
            background.style.backgroundColor = `black`;

        } else if (obj.white < obj.black) {
            background.style.backgroundColor = `white`;
        }
    } else {
        background.style.backgroundColor = `${contrastingColor(dominantColor)}`
    }

}


///
function contrastingColor(color) {
    return (luma(color) >= 165) ? 'black' : 'white';
}

function luma(color) // color can be a hx string or an array of RGB values 0-255
{
    let rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}

function hexToRGBArray(color) {
    if (color.length === 3)
        color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
    else if (color.length !== 6)
        throw ('Invalid hex color: ' + color);
    let rgb = [];
    for (let i = 0; i <= 2; i++)
        rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
};

///

function countColors(array) {
    let colors = {};
    array.forEach(item => {
        colors[item] = (colors[item] || 0) + 1;
    });
    return colors;
}