function drawBoard() {
    let canvas;
    /*
    * *** 펜 상태 변수
    * */
    let penThick = 12; // 기본 펜 두께
    let penColor = "#ff7e26"; // 기본 펜 색상
    let penType = "free" // 자유 곡선 - free, 직선 - straight

    // 현재 모드
    let currentMode = "selection";
    // 그리기 상태
    let isDrawing = false;
    let isEraser = false;
    // 그리기 시작 좌표
    let startX;
    let startY;
    // 현재 그리는 오브젝트
    let currentObj = null;

    // 홀로그램 슬라이드 관련 변수
    let isSliding = false;
    let offsetY = 0;
    let maxGap;
    let dotRange;



    defaultSetting();
    setListener();

    function defaultSetting() {
        // fabric.js에서는 캔버스를 먼저 생성해야함.
        canvas = new fabric.Canvas('drawBoard', {
            isDrawingMode: false,
            selection: true,
            backgroundColor: 'rgba(255,255,255,0.01)',
            // hasBorders: false,
            selectable: false
        });

        setPen("free");
        $('.pencil').addClass('on');
        $('.sizeController .size').eq(2).addClass('on');

        $('#colorBox').css('background-color', penColor);

    }

    function setListener() {
        /*
        * *** 그리기 자유 펜 클릭 시
        * */
        $('.pencil').on('click', function () {
            $('.object').removeClass("on");
            $(this).addClass("on");

            setPen("free");
        })


        /*
        * *** 직선 펜 클릭 시
        * */
        $('.straightPen').on('click', function () {
            $('.object').removeClass("on");
            $(this).addClass("on");

            setPen("straight");
        })


        /*
        * *** 원 도형 클릭 시
        * */
        $('.circle').on('click', function () {
            $('.object').removeClass("on");
            $(this).addClass("on");

            setPen("circle");
        })

        /*
        * *** 네모 도형 클릭 시
        * */
        $('.rectangle').on('click', function () {
            $('.object').removeClass("on");
            $(this).addClass("on");

            setPen("rect");
        })

        /*
        * *** 지우개 클릭 시
        * */
        $('.eraser').on('click', function () {
            $('.object').removeClass("on");
            $(this).addClass("on");

            setPen("eraser");
        })

        /*
         * *** 펜 두께 선택
         * */
        $('.sizeController .size').on('click', function () {
            penThick = $(this).width();
            $('.sizeController .size').removeClass("on");
            $(this).addClass("on");
            if (penType === "free" && canvas.freeDrawingBrush) {
                //  canvas.freeDrawingBrush 현재 드로잉에서 사용되는 브러쉬 객체
                canvas.freeDrawingBrush.width = penThick;

            }
        })


        /*
         * *** 칼라 선택
         * */
        document.getElementById('colorBox').addEventListener('change', function (e) {
            penColor = this.jscolor.toString();
            this.style.backgroundColor = this.jscolor;
            if (penType === "free" && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = penColor;
            }
        })


        /*
        * *** 그리기 이벤트
        * */
        // fabric canvas이벤트 (mouse:down, mouse:move, mouse:up)
        canvas.on('mouse:down', onMouseDown);
        canvas.on('mouse:move', onMouseMove);
        canvas.on('mouse:up', onMouseUp);

        /*
        * *** 캔버스 자유그리기에서 자동으로 바운딩 박스 생기는것을 방지 하기 위한 이벤트
        * */
        canvas.on('path:created', function (e) {
            let path = e.path;
            path.set({
                hasBorders: false,
                hasControls: false,
                selectable: false,
            })
        });


        /*
        * *************************** 다음 버튼 클릭 시 directive 페이지로 넘어갈 때 ***************************
        * */
        $('.canvas .cl_btnNext.btnAct').on('click', function () {
            let minX;
            let minY;
            let maxX;
            let maxY;
            let isFirst = true;

            canvas.getObjects().forEach(item => {
                item.setCoords(); // 좌표 캐시값 가져와야함.
                // getBoundingRect - 해당 도형의 외곽 박스(x, y, width, height) 정보를 가져오는 함수  width, height는 stroke기준임.
                // true는 좌표계기준 false는 도형기준
                let boundBox = item.getBoundingRect(true);
                let left = boundBox.left;
                let top = boundBox.top;
                let right = boundBox.left + boundBox.width;
                let bottom = boundBox.top + boundBox.height;

                if (isFirst) {
                    minX = left;
                    minY = top;
                    maxX = right;
                    maxY = bottom;
                    isFirst = false;
                } else {
                    minX = Math.min(minX, left);
                    minY = Math.min(minY, top);
                    maxX = Math.max(maxX, right);
                    maxY = Math.max(maxY, bottom);
                }
            })

            let captureWidth = maxX - minX;
            let captureHeight = maxY - minY;


            captureDirective(captureWidth, captureHeight, minX, minY);

            PlainAudioPlayer.buttonClick();
        });

        /*
        * *************************** 다음 버튼 클릭 시 홀로그램 페이지로 넘어갈 때 ***************************
        * */
        $('.directive .cl_btnNext.btnAct').on('click', function () {
            $('.canvas').hide();
            $('.directive').hide();
            $('.hologram').show();
            let minX;
            let minY;
            let maxX;
            let maxY;
            let isFirst = true;

            canvas.getObjects().forEach(item => {
                item.setCoords(); // 좌표 캐시값 가져와야함.
                // getBoundingRect - 해당 도형의 외곽 박스(x, y, width, height) 정보를 가져오는 함수  width, height는 stroke기준임.
                // true는 좌표계기준 false는 도형기준
                let boundBox = item.getBoundingRect(true);
                let left = boundBox.left;
                let top = boundBox.top;
                let right = boundBox.left + boundBox.width;
                let bottom = boundBox.top + boundBox.height;

                if (isFirst) {
                    minX = left;
                    minY = top;
                    maxX = right;
                    maxY = bottom;
                    isFirst = false;
                } else {
                    minX = Math.min(minX, left);
                    minY = Math.min(minY, top);
                    maxX = Math.max(maxX, right);
                    maxY = Math.max(maxY, bottom);
                }
            })

            let captureWidth = maxX - minX;
            let captureHeight = maxY - minY;
            captureResize(captureWidth, captureHeight, minX, minY);
            PlainAudioPlayer.buttonClick();
        })


        /*
        * *************************** 다시 하기 버튼 클릭 시 ***************************
        * */
        $('.cl_btnReset.btnAct').on('click', function () {
            $('.canvas').show();
            $('.hologram').hide();
            PlainAudioPlayer.buttonClick();
            reset();

        })



        /*
        * *************************** 스크롤바 클릭해서 내리고 올릴때 ***************************
        * */
        $('.gapController .lineBar .dot').on('mousedown touchstart', function (e) {
            let pageY = e.pageY || e.originalEvent.touches[0].pageY;
            let dotTop = $(this).offset().top;
            e.preventDefault();
            isSliding = true;
            offsetY = pageY - dotTop; // 마우스와 도트의 거리
        })

        $(document).on('mousemove touchmove', function (e) {
            if (isSliding) {
                let pageY = e.pageY || e.originalEvent.touches[0].pageY;

                let barTop = $('.lineBar').offset().top;
                let barHeight = $('.lineBar').height();
                let dotHeight = $('.lineBar .dot').outerHeight();
                let range = barHeight - dotHeight;

                let top = pageY - barTop - offsetY;
                top = Math.max(0, Math.min(range, top));
                $('.lineBar .dot').css('top', top + 'px');

                let ratio = top / range; // 비율 계산 (0~1) - 슬라이드를 얼마나 내렸는지 표현.
                let gap = maxGap * (1 - ratio); // 위로 올릴수록 gap 커짐

                // console.log(top, range, ratio , gap);

                updatePosition(gap); // 이미지 재배치
            }
        })

        $(document).on('mouseup touchend', function () {
            isSliding = false;
        })
    }



    /*
    * ****************************************gap조정******************************************
    * */
    function gapControl() {
        let top = $('.hologram .imgWrap .top').outerHeight();
        let bottom = $('.hologram .imgWrap .bottom').outerHeight();
        let left = $('.hologram .imgWrap .left').outerWidth();
        let right = $('.hologram .imgWrap .right').outerWidth();

        let maxVerticalGap = ($('.hologram .imgWrap').height() - top - bottom) / 2;
        let maxHorizonGap = ($('.hologram .imgWrap').width() - left - right) / 2;

        maxGap = Math.min(maxHorizonGap, maxVerticalGap);
        dotRange = $('.lineBar').height() - $('.lineBar .dot').outerWidth();

        updatePosition(maxGap);
    }

    /*
    * ***********************************초기 이미지 위치 설정***********************************
    * */
    function updatePosition(gap) {
        let centerY = $('.hologram  .imgWrap').height() / 2;
        let centerX = $('.hologram  .imgWrap').width() / 2;

        $('.hologram .imgWrap .top').css({
            top: centerY - gap - $('.hologram .imgWrap .top').outerHeight(),
            left: centerX - $('.hologram .imgWrap .top').outerWidth() / 2,
        })

        $('.hologram .imgWrap .bottom').css({
            top: centerY + gap,
            left: centerX - $('.hologram .imgWrap .top').outerWidth() / 2,
        })

        $('.hologram .imgWrap .left').css({
            top: centerY - $('.hologram .imgWrap .left').outerHeight() / 2,
            left: centerX - gap - $('.hologram .imgWrap .left').outerWidth(),
        })

        $('.hologram .imgWrap .right').css({
            top: centerY - $('.hologram .imgWrap .right').outerHeight / 2,
            left: centerX + gap,
        })
    }


    /*
    * ****************************************캡처******************************************
    * */

    function captureDirective(_width, _height, _left, _top) {
        let dataUrl = canvas.toDataURL({ // toDataURL - 캔버스에 그려진 내용을 이미지로 뽑아냄.
            width: _width,
            height: _height,
            left: _left,
            top: _top,
            format: 'png',
            multiplier: 1, // 출력화질
        });

        let img = new Image();
        img.src = dataUrl;

        // 이미지 리사이즈
        img.onload = function () {
            let maxWidth = 100;
            let resizeW = img.width;
            let resizeH = img.height;

            if (img.width > img.height) {
                resizeW = maxWidth;
                resizeH = img.height * (maxWidth / img.width); // 원본 높이 * (고정 너비 / 원본 너비)
            } else {
                resizeH = maxWidth;
                resizeW = img.width * (maxWidth / img.height);
            }


            // 리사이즈용 캔버스에 다시 그림
            let resizeCanvas = document.createElement('canvas');
            resizeCanvas.width = resizeW;
            resizeCanvas.height = resizeH;

            let ctx = resizeCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, resizeW, resizeH);

            let resizedDataUrl = resizeCanvas.toDataURL('image/png');

            // 이미지 추가
            $('.directive .imgWrap').empty();
            let direction = ['top', 'bottom', 'left', 'right']
            for (let i = 0; i < 4; i++) {
                $('.directive .imgWrap').append('<img class="' + direction[i] + '" src="' + resizedDataUrl + '"/>');
            }
        }

        // 보여질 페이지 세팅
        $('.canvas').hide();
        $('.directive').show();
    }


    function captureResize(_width, _height, _left, _top) {
        let dataUrl = canvas.toDataURL({ // toDataURL - 캔버스에 그려진 내용을 이미지로 뽑아냄.
            width: _width,
            height: _height,
            left: _left,
            top: _top,
            format: 'png',
            multiplier: 1, // 출력화질
        });

        let img = new Image();
        img.src = dataUrl;

        // 이미지 리사이즈
        img.onload = function () {
            let maxWidth = 125;
            let resizeW = img.width;
            let resizeH = img.height;

            if (img.width > img.height) {
                resizeW = maxWidth;
                resizeH = img.height * (maxWidth / img.width); // 원본 높이 * (고정 너비 / 원본 너비)
            } else {
                resizeH = maxWidth;
                resizeW = img.width * (maxWidth / img.height);
            }


            // 리사이즈용 캔버스에 다시 그림
            let resizeCanvas = document.createElement('canvas');
            resizeCanvas.width = resizeW;
            resizeCanvas.height = resizeH;

            let ctx = resizeCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, resizeW, resizeH);

            let resizedDataUrl = resizeCanvas.toDataURL('image/png');

            // 이미지 추가
            $('.hologram .imgWrap').empty();
            let direction = ['top', 'bottom', 'left', 'right']
            for (let i = 0; i < 4; i++) {
                $('.hologram .imgWrap').append('<img class="' + direction[i] + '" src="' + resizedDataUrl + '"/>');
            }

            // 이미지 로드 된 후로 이미지 배치 조정 해주기.
            setTimeout(function () {
                let verticalGap = $('.hologram .imgWrap').height() - $('.hologram .imgWrap .top').outerHeight() - $('.hologram .imgWrap .bottom').outerHeight();
                let centerY = $('.hologram .imgWrap .top').outerHeight() + verticalGap / 2;
                // 가운데 위치 기준으로 하기
                let centerX = $('.hologram .imgWrap').width() / 2;

                $('.hologram .imgWrap img.top').css({
                    top: 0,
                    left: ($('.hologram .imgWrap').width() - $('.hologram .imgWrap .top').outerWidth()) / 2 + 'px',
                })
                $('.hologram .imgWrap img.bottom').css({
                    bottom: 0,
                    left: ($('.hologram .imgWrap').width() - $('.hologram .imgWrap .top').outerWidth()) / 2 + 'px',
                })
                $('.hologram .imgWrap img.left').css({
                    top: centerY - $('.hologram .imgWrap .left').outerHeight() / 2 + 'px',
                    left: centerX - verticalGap / 2 - $('.hologram .imgWrap .left').outerWidth() + 'px'
                });
                $('.hologram .imgWrap img.right').css({
                    top: centerY - $('.hologram .imgWrap .right').outerHeight() / 2 + 'px',
                    left: centerX + verticalGap / 2 + 'px'
                });

                gapControl();
            }, 20)
        }


        // 보여질 페이지 세팅
        $('.directive').hide();
        $('.hologram').show();
    }



    /*
    * *** 어떤 툴 세팅 할건지
    * */
    function setPen(_penId) {
        switch (_penId) {
            case "free":
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); // 기본 브러쉬가 설정이 안되어있는 경우도 있어서 지정해줘야함.
                canvas.freeDrawingBrush.color = penColor;
                canvas.freeDrawingBrush.width = penThick;
                currentMode = "drawing";
                penType = "free";
                break;
            case "straight":
                canvas.isDrawingMode = false;
                currentMode = "drawing";
                penType = "straight";
                break;
            case "circle":
                canvas.isDrawingMode = false;
                currentMode = "drawing";
                penType = "circle";
                break;
            case "rect":
                canvas.isDrawingMode = false;
                currentMode = "drawing";
                penType = "rect";
                break;
            case "eraser":
                canvas.isDrawingMode = false;
                currentMode = "eraser";
                break;
        }
    }

    /*
    * *************************************그리기 마우스 이벤트*********************************
    * */
    /*
    * *** 마우스 다운 이벤트
    * */
    function onMouseDown(event) {
        // 파란박스랑 셀렉되는 기본 옵션 없애주기 위해서 canvas 자체에 걸어줌.
        canvas.selection = false;
        isEraser = true;
        isDrawing = true;
        let pointer = canvas.getPointer(event.e); // getPointer = 마우스 이벤트가 발생한 시점에 캔버스 좌표를 가져오는 함수.
        startX = pointer.x;
        startY = pointer.y;
        let point = new fabric.Point(startX, startY)

        if (currentMode == "drawing") {
            // 직선
            if (penType == "straight") {
                currentObj = new fabric.Line([startX, startY, startX, startY], { // line은 좌표값 4개와 옵션값을 넘겨주어야함. [x1, y1, x2, y2] 배열로.
                    stroke: penColor,
                    strokeWidth: penThick,
                    strokeLineCap: 'round', // 스트로크 스타일을 둥글하게 만들어줌.
                    selectable: false,
                })
                canvas.add(currentObj);
            }
            // 원
            if (penType == "circle") {
                currentObj = new fabric.Circle({
                    top: startY,
                    left: startX,
                    originX: 'center',
                    originY: 'center',
                    radius: 1,
                    stroke: penColor,
                    strokeWidth: penThick,
                    fill: 'rgba(255,255,255,0.01)',
                    selectable: false,
                })
                canvas.add(currentObj);
            }
            // 네모
            if (penType == "rect") {
                currentObj = new fabric.Rect({
                    top: startY,
                    left: startX,
                    originX: 'center',
                    originY: 'center',
                    width: 0,
                    height: 0,
                    stroke: penColor,
                    strokeWidth: penThick,
                    fill: 'rgba(255,255,255,0.01)',
                    selectable: false,
                })
                canvas.add(currentObj);
            }
        }

    }

    /*
    * *** 마우스 무브 이벤트
    * */
    function onMouseMove(event) {
        let pointer = canvas.getPointer(event.e);
        let point = new fabric.Point(pointer.x, pointer.y)

        if (isEraser) {
            if (currentMode == "eraser") {
                canvas.getObjects().forEach(item => {
                    item.selection = true;
                    item.evented = false;  // 클릭해도 아무 반응 없음
                    item.objectCaching = false;

                    // let boundBox = item.getBoundingRect(false);
                    // getBoundingRect - 해당 도형의 외곽 박스(x, y, width, height) 정보를 가져오는 함수  width, height는 stroke기준임.
                    //                     // true는 좌표계기준 false는 도형기준

                    // if(pointer.x >= boundBox.left && pointer.x <= boundBox.left + boundBox.width && pointer.y >= boundBox.top && pointer.y <= boundBox.top + boundBox.height){
                    //     console.log('들어와');
                    //     canvas.remove(item);
                    // }

                    item.setCoords(); // setCoords - 도형의 위치나 크기가 바뀌었을 때 도형의 히트 영역(hit area, 즉 충돌 영역) 을 다시 계산해서 정확하게 좌표 정보를 갱신해주는 함수. 좌표값을 갱신해주는거임.
                    // containsPoint - 오브젝트가 특정좌표를 내부에 포함하고 있는지 확인하는 함수. (안에 fabric의 포인트 객체를 넣어줘야함.)
                    if (item.containsPoint(point)) {
                        canvas.remove(item);
                    }
                })
                canvas.requestRenderAll();
                return; // 그리기 로직 건너뜀
            }
        }


        if (!isDrawing || !currentObj) return;

        // 직선
        if (penType == "straight") {
            currentObj.set({ // 마우스를 움직일때 갱신되는 x2 y2 위치를 조정해주어야함.
                x2: pointer.x,
                y2: pointer.y,
            })
            currentObj.setCoords();
        }
        //원
        if (penType == "circle") {
            let radius = Math.hypot(pointer.x - startX, pointer.y - startY) / 2;
            currentObj.set({
                radius: radius,
                left: (pointer.x + startX) / 2,
                top: (pointer.y + startY) / 2,
            })
        }
        // 네모
        if (penType == "rect") {
            currentObj.set({
                width: Math.abs(pointer.x - startX),
                height: Math.abs(pointer.y - startY),
                left: (pointer.x + startX) / 2,
                top: (pointer.y + startY) / 2,
            })
        }

        canvas.requestRenderAll(); // fabric.js에서 캔버스를 강제로 다시 그려주는 함수
    }

    /*
    * *** 마우스 업 이벤트
    * */
    function onMouseUp() {
        isDrawing = false;
        isEraser = false;
        currentObj = null;

        canvas.getObjects().forEach(item => {
            if (item) {
                $('.cl_btnNext.btnAct').addClass("on");
            }
        });
    }




    /*
    * *************************************리셋*********************************
    * */
    function reset() {
        // 캔버스 초기화
        // canvas.clearRect(0, 0, canvas.width, canvas.height);
        canvas.clear(); // fabric.js에서는 clear를 써서 초기화를 해주어야함.
        setPen("free");
        $('.object').removeClass("on");
        $('.pencil').addClass('on');
        $('.sizeController .size').removeClass("on");
        $('.sizeController .size').eq(2).addClass('on');

        $('#colorBox').css('background-color', '#ff7e26');
        penThick = 12;
        penColor = "#ff7e26";
        penType = "free";

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = penColor;
            canvas.freeDrawingBrush.width = penThick;
        }

        $('.cl_btnNext').removeClass("on");

        $('.lineBar .dot').css('top', '0');
    }


}


