function canvasGame() {
    let canvas;


    let penSize = 10;
    let bgColor;
    let dotColor;

    // undo redo 배열
    let bgColorHistory = [];
    let dotHistory = [];
    let removeArr = [];

    setListener();
    defaultSetting();

    function defaultSetting() {
    }
    function setListener() {
        /*
        * *** 선택 페이지에서 선택 시
        * */
        $('.selectPage .selectObj').on('click', function () {
            $('.selectPage .selectObj').removeClass('on');
            $(this).addClass('on');
            let dataObjId = $(this).attr('data-obj-id');
            $('.selectPage .cl_btnNext').show();

            $('.drawObj').hide();
            $(".drawPage .drawObj").hide().removeClass("on");
            $(".drawPage .drawObj[data-obj-id=" + dataObjId + "]").show().addClass('on');
        })

        /*
        * *** 선택페이지 다음 버튼 클릭 시
        * */
        $('.selectPage .cl_btnNext').on('click', function () {
            $('.selectPage').hide();
            $('.drawPage').show();

            let targetTab = document.querySelector('.styleTab[data-tab="decoColor"]');
            jscolor.install(targetTab)
            const input = document.getElementById('bgColorBox');
            // jscolor 인스턴스가 존재하면 바로 show()
            if (input && input.jscolor) {
                input.jscolor.show();
                $('.jsColorWrap').append($('.jscolor-wrap'));
            }


            document.querySelectorAll('.drawObj').forEach(function (drawObj, idx) {
                let svg = drawObj.querySelector('svg');
                // baseVal인터페이스 의 속성 에는 SVGAnimatedLengthSVG 열거형의 초기 값이 포함되어 있습니다.
                let width = svg.width.baseVal.value;
                let height = svg.height.baseVal.value;

                let top = drawObj.offsetTop;
                let left = drawObj.offsetLeft;

                canvas = document.createElement('canvas');
                canvas.classList.add('myCanvas');
                canvas.width = width;
                canvas.height = height;

                drawObj.appendChild(canvas);

                let ctx = canvas.getContext('2d');
                let pathElement = drawObj.querySelector('path');
                // pathElement = document.getElementById('donutPath');
                let d = pathElement.getAttribute('d');
                let path = new Path2D();
                drawObj.querySelectorAll('path').forEach(_path => {
                    let d = _path.getAttribute('d');
                    let fill = _path.getAttribute("fill");
                    if (fill === "white") {
                        path.addPath(new Path2D(d));
                    }
                })

                ctx.save();
                ctx.beginPath(); // 경로 비우고
                ctx.clip(path, 'nonzero');  // path경로 설정함.

                /*
                * *** 캔버스 그릴때
                * */
                canvas.addEventListener("click", function (e) {
                    $(".styleTab[data-tab='decoColor']").find('.prevBtn').addClass("on");
                    $('.cl_btnComplete').show();

                    let x = e.offsetX;
                    let y = e.offsetY;
                    let radius = penSize / 2;

                    ctx.beginPath(); // 동그라미를 위한 경로
                    ctx.arc(x, y, radius, 0, 2 * Math.PI); // x, y ,radius , startAngle , endAngle
                    ctx.fillStyle = dotColor;
                    ctx.fill();

                    // ctx.restore(); // 클리핑해제

                    // 기록 저장
                    dotHistory.push({
                        canvasIndex: idx,
                        x,
                        y,
                        radius,
                        color: dotColor,
                    });

                    // redo 스택은 새로 그릴 때 초기화됨
                    redoStack = [];
                    $(".styleTab[data-tab='decoColor']").find('.nextBtn').removeClass("on");
                })
            });
        })

        /*
        * *** 그리기 페이지 탭버튼 클릭 시
        * */
        $('.drawPage .tabBtn').on('click', function () {
            let dataTab = $(this).attr('data-tab');
            $('.drawPage .tabBtn').removeClass('on');
            $(this).addClass("on");

            $('.styleTab').hide();
            $(".styleTab[data-tab=" + dataTab + "]").show();

            // 각각탭 선택시 다른 jscolorWrap
            if (dataTab === 'bgColor') {
                $('#bgColorBox')[0].jscolor.show();
                $('.jsColorWrap').append($('.jscolor-wrap'));
                $('.drawObj.on .myCanvas').css('pointer-events', 'none');
            } else if (dataTab === 'decoColor') {
                $('#decoBox')[0].jscolor.show();
                $('.jsColorWrap').append($('.jscolor-wrap'));
                $('.drawObj.on .myCanvas').css('pointer-events', 'auto');
            }


            let tab = $(`.styleTab[data-tab="${dataTab}"]`);
            jscolor.install(tab[0]);

        })

        /*
        * *** 그리기 페이지 크기버튼 클릭 시
        * */
        $('.drawPage .size').on('click', function () {
            $('.drawPage .size').removeClass("on");
            $(this).addClass('on');
            penSize = parseInt($(this).width());

        })

        /*
        * *** 그리기 페이지 완성 버튼 클릭 시
        * */
        $('.drawPage .cl_btnComplete').on('click', function () {
            let completeDraw = $(this).parents('.drawPage').find('.drawObj.on svg').clone();
            $('.drawPage').hide();
            let sourceCanvas = $('.drawObj.on canvas')[0];
            let img = new Image();
            img.src = sourceCanvas.toDataURL('image/png');
            img.className = 'canvasImage';
            $('.completePage').show().append(completeDraw).append(img);

            $('#bgColorBox')[0].jscolor.hide();
            $('#decoBox')[0].jscolor.hide();

        })


        /*
        * *** 완료 페이지 다시하기 버튼 클릭 시
        * */
        $('.completePage .cl_btnReset').on('click', function () {
            $('.completePage').hide();
            $('.selectPage').show();

            reset();
        })


        /*
        * *** 배경 칼라 선택
        * */
        document.getElementById('bgColorBox').addEventListener('change', function (e) {
            $('.cl_btnComplete').show();
            if (e.target.id !== 'bgColorBox') return;
            bgColor = this.jscolor.toString();
            // console.log(bgColor);
            $(this).parents('.styleTab').find('.prevBtn').addClass("on")

            $('.drawObj.on svg path').each(function () {
                let fill = $(this).attr("fill");
                if (fill !== '#D59E47' && fill !== 'black') {
                    $(this).attr('fill', bgColor);
                }
            })

            removeArr = [];
            $(this).parents('.styleTab').find('.nextBtn').removeClass("on");

            // bgColor 넣어줌
            bgColorHistory.push(bgColor);
        })


        /*
        * *** 꾸미기 칼라 선택
        * */
        document.getElementById('decoBox').addEventListener('change', function (e) {
            if (e.target.id !== 'decoBox') return;
            dotColor = this.jscolor.toString();
        })


        /*
        * *** undo redo 버튼 클릭 시
        * */
        $('.prevBtn').on('click', function () {
            let tab = $(this).parents('.styleTab');
            let tabType = $(this).parents('.styleTab').attr('data-tab');

            if (tabType == 'bgColor') {
                undoHistory(bgColorHistory, tab)
            } else if (tabType == 'decoColor') {
                undoDraw(tab)
            }

        })

        $('.nextBtn').on('click', function () {
            let tab = $(this).parents('.styleTab');
            let tabType = $(this).parents('.styleTab').attr('data-tab');

            if (tabType == 'bgColor') {
                redoHistory(bgColorHistory, tab)
            } else if (tabType == 'decoColor') {
                redoDraw(tab)
            }

        })

    }

    /*
    * ************************************ 히스토리 ******************************************
    * */

    /*
    * *** undo 기본적인 히스토리
    * */
    function undoHistory(_arrHistory, _tab) {
        if (_arrHistory.length === 0) return;
        // 버튼 관리
        let nextBtn = _tab.find('.nextBtn');
        let prevBtn = _tab.find('.prevBtn');
        nextBtn.addClass('on');
        if (_arrHistory.length <= 1) {
            prevBtn.removeClass('on');
        }

        // 배열에 있던 마지막 값
        let lastValue = _arrHistory.pop();
        // history에 값이 1개 이상있으면 _arrHistory[_arrHistory.length - 1]값을 넣고 아닐때는 흰색을 넣어줌.
        let prevValue = _arrHistory.length > 0 ? _arrHistory[_arrHistory.length - 1] : "white"

        $('.drawObj.on svg path').each(function () {
            let fill = $(this).attr("fill");
            if (fill !== '#D59E47' && fill !== 'black') {
                $(this).attr('fill', prevValue);
            }
        })

        // redo했을 시 사용할 삭제된 배열에 지워진 값들을 push해줌.
        removeArr.push(lastValue);
        // console.log("삭제된값들 담아놓을 배열",removeArr);
        // console.log("undo했을 시 배열",_arrHistory)
    }

    /*
    * *** redo 기본적인 히스토리
    * */
    function redoHistory(_arrHistory, _tab) {
        if (removeArr.length === 0) return;
        // 버튼 관리
        let nextBtn = _tab.find('.nextBtn');
        let prevBtn = _tab.find('.prevBtn');
        prevBtn.addClass('on');
        if (removeArr.length <= 1) {
            nextBtn.removeClass('on');
        }
        // 삭제된값들 저장해줬던 배열에서 마지막값을 빼줌.
        let redoValue = removeArr.pop();
        $('.drawObj.on svg path').each(function () {
            let fill = $(this).attr("fill");
            if (fill !== '#D59E47' && fill !== 'black') {
                $(this).attr('fill', redoValue);
            }
        })

        _arrHistory.push(redoValue);
        // console.log("redo했을 시 배열",_arrHistory)
    }

    /*
    * *** undo 캔버스 히스토리
    * */
    function undoDraw(_tab) {
        if (dotHistory.length === 0) return;

        let lastDraw = dotHistory.pop();
        redoStack.push(lastDraw);

        let nextBtn = _tab.find('.nextBtn');
        let prevBtn = _tab.find('.prevBtn');

        nextBtn.addClass('on');
        if (dotHistory.length <= 0) {
            prevBtn.removeClass('on');
        }

        redrawAllDots();
    }

    /*
    * *** redo 캔버스 히스토리
    * */
    function redoDraw(_tab) {
        if (redoStack.length === 0) return;

        let redoItem = redoStack.pop();
        dotHistory.push(redoItem);

        let nextBtn = _tab.find('.nextBtn');
        let prevBtn = _tab.find('.prevBtn');

        prevBtn.addClass('on');
        if (redoStack.length <= 0) {
            nextBtn.removeClass('on');
        }

        redrawAllDots();
    }

    // 다시 그려줌
    function redrawAllDots() {
        // 전부다 지운후에
        document.querySelectorAll('.myCanvas').forEach(p => {
            let ctx = p.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        })

        dotHistory.forEach(item => {
            let canvas = document.querySelectorAll('.myCanvas')[item.canvasIndex];
            if (!canvas) return;

            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
            ctx.fillStyle = item.color;
            ctx.fill();
        })
    }


    /*
    * ************************************ 리셋 ******************************************
    * */
    function reset() {
        $('.selectObj').removeClass('on');
        $('.drawObj').hide().removeClass("on");

        // 탭 초기화
        $('.drawPage .tabBtn').removeClass('on');
        $('.drawPage .tabBtn').eq(0).addClass("on");

        $('.styleTab').hide();
        $(".styleTab").eq(0).show();
        $('.size').removeClass('on');
        $('.size').eq(0).addClass('on');

        penSize = 10;

        $('.drawObj svg path').removeClass('on');
        $('.drawObj svg path').each(function () {
            let fill = $(this).attr("fill");
            if (fill !== '#D59E47' && fill !== 'black') {
                $(this).attr('fill', 'white');
            }
        })
        bgColorHistory = [];
        dotHistory = [];
        removeArr = [];
        $('.btn').removeClass("on");


        $('.completePage svg').remove();

        $('.cl_btnComplete').hide();

        // canvas append 시킨거 삭제해줌.
        $('.drawObj canvas').remove();
        // 다시하기 버튼 안보이게
        $('.selectPage .cl_btnNext').hide();


    }




}


