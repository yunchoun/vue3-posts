function rotateGame() {
    // 각 이미지 기본 규격
    let originWidth;
    let originHeigth;


    // 선택 object index번호
    let objIndex;
    // let dataTitle;
    // 선택화면 사용하는 경우
    let useSelect = true;
    // 현재 이미지
    let currentImgIdx = 0;
    let totalImg;
    // interval 클리어
    let clearRotate;

    // 위치값
    // let originPointTop;
    let originPointLeft;
    let originTouchLeft;
    let isDragging = false;
    let lastTime = 0;
    let delayTime = 120;

    // 확대 축소
    let minScale = 0.5;
    let maxScale = 3;
    let pinchScale = false;
    let setDist;

    let touchCnt = "";

    defaultSetting();
    setListener();

    function defaultSetting() {
        // contentsOutWrap에 selectPage가 있는 경우와 없는 경우로 구분해줌.
        if ($('.contentsOutWrap .selectPage').length) {
            useSelect = true;
            $('.activityPage').hide();
            $('.activityPage .cl_btnGoBack').show();
        } else {
            useSelect = false;
            $('.activityPage').show().addClass('on');
            $('.activityPage .cl_btnGoBack').hide();
            objIndex = 1;
            initEl(objIndex);
            autoRotate();
            smCommon.showControlMsgBar();
        }

        $('.cl_btnRotate').addClass("on");

    }

    function setListener() {
        // 오브젝트 선택 클릭
        $('.selectArea .object').on('click', function () {

            objIndex = $(this).attr('data-obj-id');
            // console.log(objIndex);

            initEl(objIndex);

            $(this).parents('.selectPage').hide();
            $('.activityPage').hide();
            $(".activityPage[data-pageId=" + objIndex + "]").show().addClass('on');
            $('.activityPage .rotateImg').removeClass('stop');

            smCommon.showControlMsgBar();
            autoRotate();
        })

        // 되돌아가기 버튼 클릭
        $('.activityPage .cl_btnGoBack').on('click', function () {
            resetPlay();
        })

        // 회전 버튼 클릭
        $('.activityPage .cl_btnRotate').on('click', function () {
            isDragging = false;
            if ($(this).hasClass('on')) {
                $(this).removeClass("on")
                $('.rotateArea').addClass('stop');
                clearInterval(clearRotate);
            } else {
                $(this).addClass("on");
                $('.rotateArea').removeClass('stop');
                autoRotate();
            }
        })

        /*
        * ** 마우스로 컨트롤
        * */
        // 마우스 다운시
        $('body').on('mousedown touchstart', '.activityPage.on .rotateArea', function (event) {
            originPointLeft = event.pageX;
            // touch에서도 event.pageX일 경우가 있어서 정확하게 touchstart일 경우로 지정해줌.
            let isTouchEvent = event.type === 'touchstart';

            // Touch일경우
            if (isTouchEvent) {
                if (touchCnt == "") {
                    touchCnt = event.originalEvent.touches.length;
                } else {
                    return false;
                }

                originTouchLeft = event.touches[0].pageX;

                if (touchCnt > 1) {
                    pinchScale = true;
                    isDragging = false;
                    // 처음 찍었을때 거리 값 계산
                    setDist = getDistance(event.originalEvent.touches);
                } else {
                    pinchScale = false;
                    isDragging = true;
                }

                if ($(this).hasClass('stop') == false) {
                    $(this).addClass('stop');
                    $('.cl_btnRotate').removeClass("on");
                } else {
                    $(this).removeClass('stop');
                    autoRotate();
                }
            } else {
                isDragging = true;
            }


            clearInterval(clearRotate);
            if ($('.activityPage').hasClass('on') == true) {
                if ($(this).hasClass('stop') == false) {
                    $(this).addClass('stop');
                    $('.cl_btnRotate').removeClass("on");
                    clearInterval(clearRotate);
                } else {
                    $(this).removeClass('stop');
                    autoRotate();
                }
            }

        });

        // 마우스 움직일때
        $('body').on('mousemove touchmove', '.activityPage.on .rotateArea', function (event) {

            // 이미지 왼쪽 오른쪽으로 이동
            if (isDragging) {
                $('.cl_btnRotate').removeClass("on");
                $(this).addClass("stop");

                let movePointLeft = event.pageX;
                let prevPointLeft = originPointLeft - movePointLeft;

                let currentTime = new Date();
                // delayTime = 120마다 반응
                // 현재 시간이 마지막시간을 뺐을때 120보다 적으면 실행이 안되게 막기 때문에
                // 0.12초마다만 실행이 되는것처럼 보임
                if (currentTime - lastTime < delayTime) return;
                // console.log(currentTime,lastTime,delayTime);

                clearInterval(clearRotate);
                $('.activityPage.on .rotateImg img').hide();
                if (!movePointLeft) {
                    // Touch일경우
                    let moveTouchLeft = event.changedTouches[0].pageX;
                    let prevTouchLeft = originTouchLeft - moveTouchLeft;

                    if (prevTouchLeft > 0) {
                        currentImgIdx--;
                        if (currentImgIdx < 0) {
                            currentImgIdx = totalImg - 1;
                        }
                    } else {
                        currentImgIdx++;
                        if (currentImgIdx > totalImg - 1) {
                            currentImgIdx = 0;
                        }
                    }
                    // 기존 위치에 옮겨진 위치를 저장해서 거기서 부터 다시 계산할수 있도록
                    originTouchLeft = moveTouchLeft;
                } else {
                    if (prevPointLeft > 0) {
                        currentImgIdx--;
                        if (currentImgIdx < 0) {
                            currentImgIdx = totalImg - 1;
                        }
                    } else {
                        currentImgIdx++;
                        if (currentImgIdx > totalImg - 1) {
                            currentImgIdx = 0;
                        }
                    }
                    // 기존 위치에 옮겨진 위치를 저장해서 거기서 부터 다시 계산할수 있도록
                    originPointLeft = movePointLeft;
                }

                // console.log(currentImgIdx);
                $('.activityPage.on .rotateImg img').eq(currentImgIdx).show();
                lastTime = currentTime;
            } else {
                // 핀치 이벤트 손가락으로 탭에서 확대 축소
                if (pinchScale) {
                    // event.preventDefault();
                    // 움직이고 난 후 현재 거리 값
                    let currentDistance = getDistance(event.originalEvent.touches);
                    // 처음 찍었을때 값에서 움직이고 난 후 값을 뺀 뒤 확대인지 축소인지 계산.
                    let distanceGap = currentDistance - setDist;

                    if (Math.abs(distanceGap) > 10) {
                        if (distanceGap > 0) {
                            zoomController(true, false); // 확대
                        } else {
                            zoomController(false, true); // 축소
                        }

                        // 기준 거리 갱신해줌
                        setDist = currentDistance;
                    }
                }
            }

        })

        // 마우스 업했을 시
        $('body').on('mouseup touchend', function () {
            isDragging = false;
            pinchScale = false;
            touchCnt = "";
        })


        /*
        * ** 확대 축소
        * */

        // *** 클릭 확대 축소
        // 확대
        $('.cl_btnPlus').on('click', function () {
            zoomController(true, false)
        })
        // 축소
        $('.cl_btnMinus').on('click', function () {
            zoomController(false, true)
        })

        // *** 마우스 휠 확대 축소
        $('body').on('wheel', function (event) {
            // console.log(event.originalEvent.deltaY);
            if (event.originalEvent.deltaY > 0) {
                zoomController(false, true)
            } else {
                zoomController(true, false)
            }
        })

        document.querySelector('.rotateArea')?.addEventListener('touchmove', function (event) {
            if (pinchScale) {
                event.preventDefault();
                // 핀치 확대/축소 처리 로직 그대로
            }
        }, { passive: false });

    }



    /*
    * ** 자동으로 돌아가는 함수
    * */
    function autoRotate() {

        $('.cl_btnRotate').addClass("on");
        clearInterval(clearRotate);

        clearRotate = setInterval(function () {
            currentImgIdx++;
            if (currentImgIdx >= totalImg) {
                currentImgIdx = 0;
            }
            $('.activityPage.on .rotateImg img').hide();
            $('.activityPage.on .rotateImg img').eq(currentImgIdx).show();
        }, 240)
    }


    /*
    * ** 확대 축소
    * */
    function zoomController(_zoomIn, _zoomOut) {
        $('.activityPage.on .rotateImg img').each(function () {
            let currentScale = parseFloat($(this).attr('data-currentScale'));
            currentScale.toFixed(2);
            if (_zoomIn) {
                currentScale += 0.1;
            } else if (_zoomOut) {
                currentScale -= 0.1;
            }

            // scale 한도 지정
            if (currentScale > maxScale) {
                currentScale = maxScale;
            } else if (currentScale < minScale) {
                currentScale = minScale;
            }


            $(this).css('transform', `scale(${currentScale})`);
            $(this).attr('data-currentScale', currentScale);
        });
    }

    // 빗변거리 계산 함수
    function getDistance(_touch) {
        let disX = _touch[0].pageX - _touch[1].clientX;
        let disY = _touch[0].pageY - _touch[1].clientY;

        //Math.sqrt = 제곱근을 구하는 함수
        //Math.hypot(20, 10) == Math.sqrt(20*20+ 10*10)
        return Math.sqrt(disX * disX + disY * disY);
    }

    /*
    * ** init 함수
    * */
    function initEl(_objIndex) {
        currentImgIdx = 0;
        let matchPage = $(".activityPage[data-PageId=" + _objIndex + "]");
        let rotateImg = matchPage.find('.rotateImg')

        totalImg = parseInt($('.rotateImg').attr('data-total-img'));

        originWidth = rotateImg.attr('data-origin-width');
        originHeigth = rotateImg.attr('data-origin-heigth');

        // 이미지 비우기.
        $('.rotateImg').empty();
        // for문을 돌려서 이미지 생성
        for (let i = totalImg; i >= 1; i--) {
            let folder = `img_${_objIndex}`;
            let fileName = `img_${doubleDigit(_objIndex)}_${doubleDigit(i)}.png`;
            let rotateAni = `<img src="images/${folder}/${fileName}" alt="">`;
            $('.rotateImg').append(rotateAni);
            // console.log(folder,fileName,rotateAni)
        }
        // 이미지 생성 후에 값 넣기
        requestAnimationFrame(() => {
            rotateImg.css({
                width: originWidth + 'px',
                height: originHeigth + 'px',
            })

            rotateImg.find('img').each(function (idx) {
                let originW = $(this).width();
                let originH = $(this).height();
                let imgScale = originHeigth / originH;

                $(this).attr('data-originalW', originW);
                $(this).attr('data-originalH', originH);
                $(this).attr('data-currentScale', imgScale);

                $(this).css('transform', 'scale(' + imgScale + ')');

                if (idx === currentImgIdx) {
                    $(this).css('display', 'block');
                } else {
                    $(this).css('display', 'none');
                }
            })


        })


    }


    /*
    * ** 리셋함수
    * */
    function resetPlay() {
        $('.activityPage').hide().removeClass('on');
        $('.selectPage').show();
        $('.rotateImg').empty();
        $('body').removeClass('stop');
        clearInterval(clearRotate);
        currentImgIdx = 0;

        // 줌이미지 리셋
        $('.rotateImg').each(function () {
            let top = (pageScale.getStdHeight() - $(this).find("img").attr('data-originalH')) / 2;
            let left = (pageScale.getStdWidth() - $(this).find("img").attr('data-originalW')) / 2;
            let scale = $(this).find('img').attr('data-currentScale');
            $(this).find('img').css('scale', scale);
            // console.log(top,left,scale);
        })
    }
}
