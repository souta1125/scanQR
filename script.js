const scanQRWrap = document.getElementById("scanQR");
const scanQRHeader = scanQRWrap.querySelector("header");
const QRElement = document.getElementById("QRCanvas");
const scanQRFooter = scanQRWrap.querySelector("footer");
const loading = document.getElementById("loading");
const scanQRResult = document.getElementById("ticketId");

// スタイル調整
QRElement.style.height = `${scanQRWrap.clientHeight - scanQRHeader.clientHeight}px`;

// チケット読み込み結果表示
function showResult(e) {
  const apiURL = `https://script.google.com/macros/s/AKfycbww3hXOYjsivBkMQWhjkMiwVRddedSJLLYaTTuXxN7jnTYqzxEbXANTuBD85t8_p5B0/exec?request=scanQR&id=${e}`;
  fetch(apiURL)
  .then(function(fetch_data) {
    return fetch_data.json();
  })
  .then(function(data) {
    console.log(data)
    if(data == "false") {
      scanQRFooter.classList.add("is-active");
      scanQRResult.textContent = String(e);
      scanQRResult.setAttribute("data-id", String(e));
    }
    loading.classList.remove("is-active");
  })
  .catch(function(error) {
    console.log(error);
    loading.classList.remove("is-active");
  });
}

// チケット承認キャンセル
const btnCancelTicket = document.getElementById("btnCancelTicket");
btnCancelTicket.addEventListener("click", () => {
  scanQRFooter.classList.remove("is-active");
  isReadQR = true;
});

// チケット承認
const btnApproveTicket = document.getElementById("btnApproveTicket");
btnApproveTicket.addEventListener("click", () => {
  const id = scanQRResult.getAttribute("data-id");
  console.log(id)
  const apiURL = `https://script.google.com/macros/s/AKfycbww3hXOYjsivBkMQWhjkMiwVRddedSJLLYaTTuXxN7jnTYqzxEbXANTuBD85t8_p5B0/exec?request=approve&id=${id}`;
  loading.classList.add("is-active");
  btnApproveTicket.setAttribute("aria-disabled", true);
  fetch(apiURL)
  .then(function(fetch_data) {
    return fetch_data.json();
  })
  .then(function(data) {
    console.log(data)
    if(data == true) {
      scanQRFooter.classList.remove("is-active");
      isReadQR = true;
    }
    loading.classList.remove("is-active");
  })
});

// チケット読み込み
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
      facingMode: "environment",
      frameRate: { ideal: 30, max: 60 }
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
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    // jsQRのメソッド
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    if(code && isReadQR) {
      console.log(code.data)
      isReadQR = false;
      loading.classList.add("is-active");
      showResult(code.data);
    }
  }
  requestAnimationFrame(tick);
}

scanQR();