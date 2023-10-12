// https://stackoverflow.com/questions/19235286/convert-html5-canvas-sequence-to-a-video-file
export function record(canvas: HTMLCanvasElement, time: number) {
    const recordedChunks: Blob[] = [];
    return new Promise<string>(function (res) {
        const stream = canvas.captureStream(25 /*fps*/);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm"
        });

        mediaRecorder.start(time || 4000);

        mediaRecorder.ondataavailable = function (event) {
            recordedChunks.push(event.data);

            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }

        }

        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, {type: "video/webm"});
            const url = URL.createObjectURL(blob);
            res(url);
        }
    })
}