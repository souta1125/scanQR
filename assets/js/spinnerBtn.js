const spinnerBtn = document.querySelectorAll(".spinnerBtn");

spinnerBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const disabled = String(btn.getAttribute("aria-disabled"));

    if(disabled === "false"){
      const field = String(btn.getAttribute("data-field"));
      const type = String(btn.getAttribute("data-type"));
      const wrap = btn.closest(".s-main");
      const input = wrap.querySelector(`input[name=${field}]`);
      const value = parseInt(input.value);
      const min = parseInt(input.getAttribute("min"));
      const max = parseInt(input.getAttribute("max"));

      const btns = wrap.querySelectorAll(".spinnerBtn");
      btns.forEach((e) => {
        e.setAttribute("aria-disabled", false);
      })

      if(type === "plus"){
        input.value = value + 1;
        if(value+1 === max){
          btn.setAttribute("aria-disabled", true);
        }
      }
      else if (type === "minus"){
        input.value = value -1;
        if(value-1 === min){
          btn.setAttribute("aria-disabled", true);
        }
      }
    }
  })
})