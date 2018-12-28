$(document).ready(function () {

    $('.modal .close-btn').on("click", function (e) {
        $('.modal h3').each(function () {
            if ($(this).is(":visible")) {
                window.location.href = `#${$(this).attr("class")}`;
            }
        });
    });


});

//ZOOM RELATED

var utils = (function ($) {
    return {
        createNodes: function (list) {
            var result = {};

            for (var key in list) {
                result[key] = $(list[key]);
            }

            return result;
        }
    };
})(jQuery);

var zoom = (function ($) {

    var selectors = {
        document: document,
        window: window,
        body: 'body, html',
        wrapper: '.wrapper',
        scene: '.scene',
        depth: '.scene__depth',
        anchors: 'a[href^="#"]'
    },
        speed = 1000,
        layers,
        dimensions = {
            distance: 500,
            totalHeight: 1700,
            pixelRatio: window.devicePixelRatio > 1 ? 1.6 : 1,
            pointInitialWidth: 155,
        },
        layersBackgraund = [],
        loadedImg = 0,
        totalImages = 0,
        imgDate = [
            // [layer images, data-depth, data-scale]
            ['./img/1.png', 0, 1],
            ['./img/2.png', 1500, 4],
            ['./img/3.png', 2400, 6],
            ['./img/4.jpg', 12000, 26]
        ],
        pointDate = [
            // [text, link, color inner, data-depth, data-scale, %left, %top, hide, xOffset, yOffset]
            [["Idea"], "#idea?o", "#eb8c00", 0, 1, 43, 55, 150, 1.5, 1],
            [["Start", "up"], "#start-up?o", "#dc6900", 1000, 3, 38, 44, 800, 2, 0.8],
            [["Next"], "#next?o", "#db536a", 1500, 4, 52, 50, 1250, 0.3, 2],
            [["Future", "and", "beyond"], "#future-and-beyond?o", "#a32020", 2200, 5, 48, 50, 2400, 1.5, 0.6]

        ],
        w = $(window),
        scrollToStartParams = { startFade: 40, endFade: 80, opacity: '' },
        nodes,
        allPoints = [],
        DOMURL = window.URL || window.webkitURL || window,
        canvas = document.getElementById('scene-canvas'),
        ctx = canvas.getContext('2d');


    function setupCanvas() {


        var windowWidth = nodes.window.width(),
            windowHeight = nodes.wrapper.outerHeight(),
            scenaHeight,
            width,
            height;

        // when @media query for max-widht 480 is active - menu to not cover scena
        scenaHeight = windowWidth < 480 ? window.width : 0;

        if (windowWidth < windowHeight * (16 / 9)) {
            width = windowHeight * (16 / 9);
            height = windowHeight;
        } else {
            width = windowWidth;
            height = (windowWidth) / (16 / 9);
        }
        var scenaStyles = {
            'width': width.toFixed(2) + 'px',
            'height': height.toFixed(2) + 'px',
            'margin-left': -(width / 2).toFixed(2) + 'px',
            'margin-top': -((height + scenaHeight) / 2).toFixed(2) + 'px'
        };

        nodes.scene.css(scenaStyles);

        canvas.width = width * dimensions.pixelRatio;
        canvas.height = height * dimensions.pixelRatio;

        nodes.depth.css('height', (dimensions.totalHeight + w.height()) + "px");

        layers = imgDate.length;
        depth = (dimensions.distance * (layers - 1)) + nodes.window.height();

    }

    function loadImages() {

        for (var i = 0; i < imgDate.length; i++) {

            layersBackgraund[i] = new Image();
            layersBackgraund[i].src = imgDate[i][0];
            layersBackgraund[i].name = i + 1;
            layersBackgraund[i].depth = imgDate[i][1];
            layersBackgraund[i].scale = imgDate[i][2];

            attach(layersBackgraund[i]);
            totalImages++;
        }

    }

    function loadPoints() {

        for (var i = 0; i < pointDate.length; i++) {

            var text;

            switch (pointDate[i][0].length) {
                case 3:
                    text = '<text x="50" y="37" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21"  fill="#fff">' +
                        pointDate[i][0][0] + '</text><text x="50" y="54" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21" fill="#fff">' +
                        pointDate[i][0][1] + '</text><text x="50" y="71" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21"  fill="#fff">' +
                        pointDate[i][0][2] + '</text>';
                    break;
                case 2:
                    text = '<text x="50" y="47" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21"  fill="#fff">' +
                        pointDate[i][0][0] + '</text><text x="50" y="68" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21"  fill="#fff">' +
                        pointDate[i][0][1] + '</text>';
                    break;
                case 1:
                default:
                    text = '<text x="50" y="58" text-anchor="middle" font-family="Arial, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Geneva, sans-serif" font-size="21"  fill="#fff">' +
                        pointDate[i][0] + '</text>';
                    break;
            }

            var svgData = '<svg width="105" height="105" xmlns="http://www.w3.org/2000/svg"><g><circle id="svg_1" r="49" cy="50" cx="50" stroke-width="0" fill="#FFFFFF" opacity="0.8"/>' +
                '<circle id="svg_2" r="40" cy="50" cx="50" stroke-width="0" fill="' + pointDate[i][2] + '"/>' + text + '</g></svg>';
            allPoints[i] = new Image();
            allPoints[i].data = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData);

            allPoints[i].svg = new Blob([allPoints[i].data], { type: 'image/svg+xml;charset=utf-8' });

            allPoints[i].src = allPoints[i].data;
            allPoints[i].name = i + 1;
            allPoints[i].depth = pointDate[i][3];
            allPoints[i].scale = pointDate[i][4];
            allPoints[i].top = pointDate[i][6];
            allPoints[i].left = pointDate[i][5];
            allPoints[i].url = pointDate[i][1];
            allPoints[i].hiddenPositon = pointDate[i][7];
            allPoints[i].xOffset = pointDate[i][8];
            allPoints[i].yOffset = pointDate[i][9];

            attach(allPoints[i]);

            totalImages++;
        }
    }

    var attach = function (image) {
        image.onload = onloadHandler;
    }

    function onloadHandler() {
        loadedImg++;
        if (loadedImg == totalImages) {

            // to sort pictures from the back to the front
            layersBackgraund.sort(function (a, b) {
                return b.name - a.name;
            });

            // to sort points from the back to the front
            allPoints.sort(function (aP, bP) {
                return bP.name - aP.name;
            });

            render();
        }
    }


    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < layersBackgraund.length; i++) {
            var scroll = w.scrollTop() <= 0 ? 1 : w.scrollTop();
            var scale = dimensions.distance / (dimensions.distance + layersBackgraund[i].depth + -scroll);

            var layersW = canvas.width * layersBackgraund[i].scale * scale,
                layersH = canvas.height * layersBackgraund[i].scale * scale,
                yPositon = (canvas.height - layersH) / 2,
                xPosition = (canvas.width - layersW) / 2;

            // to not show layers that are already behind the viewpoint
            if (xPosition <= 0 || (xPosition >= 0 && w.scrollTop() <= 0)) {
                ctx.globalAlpha = 1;
                ctx.drawImage(layersBackgraund[i], xPosition, yPositon, layersW, layersH);
            }
        }

        var opacity,
            startFade,
            endFade;

        for (var i = 0; i < allPoints.length; i++) {

            startFade = allPoints[i].hiddenPositon - 50;
            endFade = allPoints[i].hiddenPositon + 60;

            if (w.scrollTop() >= startFade && w.scrollTop() <= endFade) {
                opacity = w.scrollTop() / endFade;
            } else if (w.scrollTop() >= startFade && w.scrollTop() <= endFade) {
                opacity = ((endFade - startFade) / w.scrollTop());
            } else if (w.scrollTop() < startFade) {
                opacity = 1;
            } else if (w.scrollTop() > endFade) {
                opacity = 0;

            }
            ctx.globalAlpha = opacity;

            var scrollP = w.scrollTop() <= 0 ? 1 : w.scrollTop();
            var scaleP = dimensions.distance / (dimensions.distance + allPoints[i].depth + -scrollP);
            var pointW = dimensions.pointInitialWidth * allPoints[i].scale * scaleP;
            var pointD = pointW * scaleP * dimensions.pixelRatio;
            var getPointLayerW = nodes.window.outerWidth() < 450 ? (nodes.window.outerWidth() / 2) : nodes.window.outerWidth();
            var yOffset;
            var xOffset;

            if (allPoints[i].url == "#start-up?o") {
                xOffset = getPointLayerW < 665 ? (-(allPoints[i].xOffset * pointD) / 2) : -(allPoints[i].xOffset * pointD);
                yOffset = -(allPoints[i].yOffset * pointD);
            } else if (allPoints[i].url == "#next?o") {
                xOffset = getPointLayerW < 665 ? ((allPoints[i].xOffset * pointD) / 5) : (allPoints[i].xOffset * pointD);
                yOffset = getPointLayerW < 665 ? (-(allPoints[i].yOffset * pointD) / 1.5) : -(allPoints[i].yOffset * pointD);
            } else if (allPoints[i].url == "#future-and-beyond?o") {
                xOffset = getPointLayerW < 665 ? (-(allPoints[i].xOffset * pointD) / 2) : -(allPoints[i].xOffset * pointD);
                yOffset = (allPoints[i].yOffset * -(pointD / 2));
            } else {
                if (getPointLayerW < 450) {
                    xOffset = ((allPoints[i].xOffset * pointD) / 6);
                } else if (getPointLayerW < 665) {
                    xOffset = ((allPoints[i].xOffset * pointD) / 2);
                } else {
                    xOffset = (allPoints[i].xOffset * pointD)
                }
                yOffset = (allPoints[i].yOffset * -(pointD / 2));
            }

            var layerPointW = getPointLayerW * allPoints[i].scale * scaleP,
                layerPointH = canvas.height * allPoints[i].scale * scaleP,
                layerPoinY = (canvas.height - layerPointH) / 2,
                layerPoinX = (canvas.width - layerPointW) / 2,
                leftPositon = ((layerPointW / 100) * allPoints[i].left) + layerPoinX + xOffset,
                topPositon = ((layerPointH / 100) * allPoints[i].top) + layerPoinY + yOffset;

            allPoints[i].startX = leftPositon;
            allPoints[i].endX = leftPositon + pointD;
            allPoints[i].startY = topPositon;
            allPoints[i].endY = topPositon + pointD;

            // if the position of hiding point is greater than scroll
            if (allPoints[i].hiddenPositon > w.scrollTop()) {
                ctx.drawImage(allPoints[i], leftPositon, topPositon, pointD, pointD);
                DOMURL.revokeObjectURL(allPoints[i].src);
            }

        }

    }

    function getPointTarget(event) {
        var x = (event.pageX + -nodes.scene.offset().left) * dimensions.pixelRatio,
            y = (event.pageY + -nodes.scene.offset().top) * dimensions.pixelRatio,
            target = false;

        for (var i = 0; i < allPoints.length; i++) {

            if (allPoints[i].hiddenPositon > w.scrollTop()) {
                if (x >= allPoints[i].startX && x <= allPoints[i].endX && y >= allPoints[i].startY && y <= allPoints[i].endY) {
                    target = allPoints[i];
                }
            }
        }
        return target;
    }

    function clickPoint(event) {
        var target = getPointTarget(event);
        if (target !== false) {

            url = target.url.replace("#", '');
            window.location.hash = url;
        }
    }

    function hoverPoint(event) {
        var target = getPointTarget(event);

        nodes.scene.toggleClass("pointer", target !== false);
    }


    function updateMenus() {
        var l = location.hash == "" ? [] : location.hash.split("?");
        var hash = "";
        if (l.length > 0) {
            hash = l[0];
        }
        var query = null;
        if (l.length > 1) {
            query = l[1];
        }

        var hashArr = hash.split("/");
        hash1 = (hash == "") ? "#idea" : hashArr[0];

        var cssSelector = "." + hashToCssClass(hash1);

        var getTarget = 0;
        var targetHash = hash.split('/')[0] + '?o';

        for (var i = 0; i < pointDate.length; i++) {
            if (pointDate[i][1] == targetHash && pointDate[i][0].length != 0) {
                // for first point - when click on it in menu to scroll scene with 60px
                getTarget = (pointDate[i][3] - 500) < 0 ? 60 : (pointDate[i][3] - 500);

            }
        }

        if (Math.abs($(window).scrollTop() - getTarget) > 2) {
            scrollToLayer(getTarget);
        }

        if (query == "o" || hashArr.length > 1) {

            if (hashArr.length != 0) {
                $('.modal').show(200);
                $('.modal h3' + cssSelector).css({ "display": "block", 'margin-top': '50%' });
            }

            scrollToStartParams.opacity = 0;

            $("#overlay").show();
            $("body").css({ "overflow": "hidden" });

        } else {

            $('.modal').hide(200);
            $('.modal h3' + cssSelector).css({ "display": "none" });

            scrollToStartParams.opacity = 1;
            $("#overlay").hide();
            $("body").css({ "overflow": "" });
        }
    }

    function hashToCssClass($hash) {
        return $hash.replace("#", '').replace("/", "-").toLowerCase();
    }

    function scrollToLayer(target) {
        nodes.body.stop(true).animate({
            'scrollTop': target
        }, speed);
    }

    return {
        init: function () {

            nodes = utils.createNodes(selectors);

            loadImages();
            loadPoints();

            setupCanvas();

            updateMenus();
            nodes.window.on('hashchange', updateMenus);

            nodes.window.on('scroll', render);
            nodes.window.on('resize', function () {
                setupCanvas();
                render();
            });

            nodes.scene.on('mousemove', hoverPoint);
            nodes.scene.on('click', clickPoint);

        }
    }

})(jQuery);

$(function () {
    zoom.init();
});
