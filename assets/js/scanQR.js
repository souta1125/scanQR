const video = document.createElement("video");
const canvasElement = document.getElementById("QRCanvas");
const canvas = canvasElement.getContext("2d", {
  desynchronized: true,
  willReadFrequently: true
});

let isReadQR = true;
let code = null;

// QRコードの読み込み
function scanQR() {
  navigator.mediaDevices.getUserMedia({
    video: {
      audio: false,
      facingMode: "environment"
    }
  })
  .then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    requestAnimationFrame(tick);
  })
  .catch((err) => {
    console.error(err);
  })
}

// QRコードの解析
function tick() {
  if(video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = scanQRWrap.clientHeight - scanQRHeader.clientHeight;
    canvasElement.width = scanQRWrap.clientHeight - scanQRHeader.clientHeight;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if(code && isReadQR) {
      console.log(code.data);
      isReadQR = false;
    }
  }
}

scanQR();