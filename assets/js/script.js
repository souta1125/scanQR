const upsell = document.getElementById("upsell");
const scanResultTxt = document.getElementById("scanResult");

// QRコードを読み込んだ時の処理
function showResult(e) {

  scanResultTxt.setAttribute("href", String(e));
  scanResultTxt.textContent = String(e);

  upsell.classList.add("is-active");
}

const video = document.createElement("video");
const canvasElement = document.getElementById("scanQR");
const canvas = canvasElement.getContext("2d", {
  desynchronized: true,
  willReadFrequently: true,
});

let isReadQR = true;
let code = null;

// QRコードの読み込み
function scanQR() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        audio: false,
        facingMode: "environment",
        frameRate: { ideal: 30, max: 60 },
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      requestAnimationFrame(tick);
    })
    .catch((err) => {
      console.error(err);
    });
}

// QRコードの解析
function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    // jsQRのメソッド
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code && isReadQR) {
      isReadQR = false;
      showResult(code.data);
    }
  }
  requestAnimationFrame(tick);
}

scanQR();

// 表示結果を非表示にする
const closeUpsell = document.getElementById("btn-closeUpsell");
closeUpsell.addEventListener("click", () => {
  upsell.classList.remove("is-active");
  isReadQR = true;
});