
$(document).ready(function () {
  console.log("ready!");
  var file = document.querySelector(".drop-zone__input");
  const drop = document.querySelector(".drop-zone");
  const bg = document.querySelector('.bg')
  let load = 0
  // let int = setInterval(blurring, 30)
  function blurring() {
    load++

    if (load > 99) {
      clearInterval(int)
    }
    var blurValue = 15 * (100 - load) / 100;
    bg.style.filter = `blur(${blurValue}px)`;
  };

  // $("#error").hide();
  // $("#resultHolder").hide();
  // $("#divClassTable").hide();
  // $("#submitBtn").on('click', function(e){
  // })
  var base64;

  $("#fileUploaded").change(function (e) {
    console.log(file.files[0].name);
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = () => {
      base64 = reader.result;
    }
  });

  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log(file.files[0].name);
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = () => {
      base64 = reader.result;
    }
  });

  // select effect
  const members = $("#members").children();
  let i = 3;
  const maxInterval = 500;
  let interval;
  const nextSelect = () => {
    console.log('## found', members[i].children[0]);
    members[i].classList.remove('select');
    const next = (i + 1) % 4;
    members[next].classList.add('select');
    i = next;
  }
  let timeOut;
  const playAnimation = function () {
    clearTimeout(timeOut);
    interval = 100;
    const loopThis = () => {
      nextSelect();
      timeOut = setTimeout(loopThis, interval);
    }
    timeOut = setTimeout(loopThis, interval);
  }

  const stopAnimation = (result, onStop = () => { }) => {
    clearTimeout(timeOut);
    const loopThis = () => {
      if (interval <= maxInterval)
        interval += 50;
      if (interval < maxInterval || result !== i) {
        nextSelect();
        timeOut = setTimeout(loopThis, interval);
      } else {
        clearTimeout(timeOut);
        onStop();
      }
    }
    timeOut = setTimeout(loopThis, interval);
  };



  $('#submitBtn').click(function (e) {
    e.preventDefault();
    playAnimation();
    var url = "http://127.0.0.1:5000/";
    $.post(url, { image_data: base64 },
      function (data, status) {
        console.log('## respone ', status, data)
        var label = data.class;
        var idol = data.idol;
        stopAnimation(label, function () {
          alert(`'The idol${data} in the picture is ${idol}'`)
        });
      })
  });

  $('#stopBtn').click(function (e) {
    e.preventDefault();
    stopAnimation(2);
  });
});
