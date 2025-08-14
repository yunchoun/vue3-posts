
function AudioRecorder(_param) {

    // 녹음되고있는지 확인
    this.isRecording = false;

    let mediaRecorder = null;
    // 녹음된음원 배열
    let recordArray = [];

    this.blobURL = "";

    that = this;

    let stopRecord;

    // 녹음시작
    this.startRecord = async function () {

        if (this.isRecording == false) {

            // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
            let mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            mediaRecorder = new MediaRecorder(mediaStream);

            // 이벤트핸들러: 녹음 데이터 취득 처리
            mediaRecorder.ondataavailable = (event) => {
                recordArray.push(event.data);
            }

            stopRecord = setTimeout(function () {
                mediaRecorder.stop()
                that.isRecording = false;
                recordArray = [];
            }, 5000)



            // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
            mediaRecorder.onstop = (event) => {
                let blob = new Blob(recordArray, { "type": "audio/mpeg" });
                /*recordArray.splice(0)*/ // 기존 오디오 데이터들 모두 비워 초기화.

                // console.log(recordArray)
                //blob데이터에 접근하는 주소 생성.
                this.blobURL = window.URL.createObjectURL(blob);
                // var audio = new Audio(audioURL);
                // let recordAudio = new Audio(blobURL);

                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    var base64data = reader.result;

                    //녹음 완료후 콜백으로 데이터 전달(3가지 타입으로)
                    _param.recordComplete({ blob: blob, blobURL: that.blobURL, base64data: base64data });
                }

            }
            // 녹음시작
            mediaRecorder.start();
            this.isRecording = true;
            // 녹음 시작 상태가 되면 audioArray   녹음 데이터 저장
            // mediaRecorder.ondataavailable = e => {
            //     recordArray.push(e.data);
            //     console.log(recordArray)
            // };


        }
    }


    // 녹음된 파일 재생
    let recordedAudio = null;
    let recordedAudioCurrentTime = 0;
    this.playRecordedFile = function (event) {
        if (this.blobURL) {
            recordedAudio = new Audio(this.blobURL);
            recordedAudio.play();
            recordedAudio.currentTime = recordedAudioCurrentTime;

        }
    }


}