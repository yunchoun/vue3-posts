function dragGame() {
    let currentDragObj = null;
    let currentDropObj = null;
    let isDragging = false;
    let dragMatch = false;
    let dropDropBox = false;
    let wrongType = 1; //  1일때는 갤럭시 2일때 ios

    let totalAnswer = false;

    let playedSound = false;

    let stageClick = {
        x: 0,
        y: 0,
    }

    defaultSetting();
    setDrag();
    setListener();
    detectOS();

    function defaultSetting() {

    }

    function setListener() {
        // 다시하기 버튼 클릭 시
        $('.cl_btnReset').on('click', function () {
            $(this).removeClass("on");
            reset();
            PlainAudioPlayer.buttonClick();

        })

        $('.dragItem').on('mousedown touchstart', function () {
            dragMatch = false;
            dropDropBox = false;
        })
        $('.dragItem').on('mouseup touchend', function () {
            if (playedSound) return;
            playedSound = true;
            setTimeout(() => {
                if (dragMatch == true) {
                    var correctSound;
                    correctSound = new Audio("../COMM_LH/audio/correct_a.mp3");
                    correctSound.play();
                    // 총 dropItem 갯수
                    let answerCnt = $('.dropItem').length;

                    if ($('.dropItem.on').length == answerCnt) {
                        totalAnswer = true;

                        correctSound.addEventListener("ended", function () {
                            PlainAudioPlayer.showComplete2();
                        })
                    }

                    if ($('.dropItem.on').length >= 0) {
                        $('.cl_btnReset.useIcon').show();
                    } else {
                        $('.cl_btnReset.useIcon').hide();
                    }
                } else {
                    if (dropDropBox) {
                        PlainAudioPlayer.wrong();
                    }
                }

                playedSound = false;
            }, 100)
        })
    }

    function setDrag() {
        $('.dragArea .dragItem').each(function () {
            $(this).attr('data-init-top', $(this).css('top'))
            $(this).attr('data-init-left', $(this).css('left'))
        })

        // 드래그
        $('.dragItem').draggable({
            start: function (event) {
                stageClick.x = event.clientX;
                stageClick.y = event.clientY;

                currentDropObj = null;
                currentDragObj = $(this);

                isDragging = true;
                dragMatch = false;
                dropDropBox = false;
            },
            drag: function (event, ui) {
                let zoom = pageScale.getCurrentScale();
                let original = ui.originalPosition;

                // 왼쪽 오른쪽 좌표 가져오는거
                ui.position = {
                    left: (event.clientX - stageClick.x + original.left) / zoom,
                    top: (event.clientY - stageClick.y + original.top) / zoom
                }

                isDragging = true;
            },
            stop: function (event) {
                // let pointerX = event.clientX;
                // let pointerY = event.clientY;

                let matched = false;
                $('.dropItem').each(function () {
                    let pointHit = checkPointerHit({ event: event, currentDropArea: $(this) })

                    if (pointHit) {
                        dropDropBox = true;
                        if ($(this).attr("data-drag") == currentDragObj.attr("data-drag")) {
                            currentDragObj.css('visibility', 'hidden');
                            $(this).addClass("on");
                            dragMatch = true;
                            matched = true;
                            if ($('.dropItem.on').length > 0) {
                                $('.cl_btnReset').addClass("on");
                            }

                            return false;
                        }
                    }
                });

                if (!matched) {
                    dragMatch = false;
                    // dropDropBox = false;
                    backToOriginPosition();
                }


                isDragging = false;
            }
        })

        // 드롭
        $('.dropItem').droppable({
            drop: function (event, ui) {

            }
        })
    }


    function checkPointerHit(_param) {
        const pointerX = _param.event.clientX;
        const pointerY = _param.event.clientY;
        const dropArea = _param.currentDropArea;
        const zoom = pageScale.getCurrentScale();

        const dropAreaStartX = dropArea.offset().left;
        const dropAreaEndX = dropAreaStartX + dropArea.width() * zoom;
        const dropAreaStartY = dropArea.offset().top;
        const dropAreaEndY = dropAreaStartY + dropArea.height() * zoom;

        return (pointerX >= dropAreaStartX && pointerX <= dropAreaEndX &&
            pointerY >= dropAreaStartY && pointerY <= dropAreaEndY);
    }



    function backToOriginPosition() {
        currentDragObj.css("top", currentDragObj.attr('data-init-top'));
        currentDragObj.css("left", currentDragObj.attr('data-init-left'));
    }

    function detectOS() {
        const agent = navigator.userAgent.toLowerCase();

        if (agent.indexOf('android') > -1) {
            wrongType = 1;
            // console.log('OS: Android');
        } else if (agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1 || agent.indexOf('ipod') > -1) {
            wrongType = 2;
            // console.log('OS: iOS');
        } else {
            wrongType = 1;
            // console.log('OS: 기타');
        }
    }

    function reset() {
        $('.dragItem').css('visibility', 'visible');
        $('.dropItem').removeClass('on');
        $('.dragArea .dragItem').each(function () {
            $(this).css({
                top: $(this).attr('data-init-top'),
                left: $(this).attr('data-init-left'),
            })

        });
        $('.cl_btnReset.useIcon').hide();
        let dragMatch = false;
        let dropDropBox = false;
    }
}