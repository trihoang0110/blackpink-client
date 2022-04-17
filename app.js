$(document).ready(function () {
  console.log("ready!");
  var file = document.querySelector(".drop-zone__input");
  const drop = document.querySelector(".drop-zone");
  const bg = document.querySelector(".bg");
  let load = 0;
  // let int = setInterval(blurring, 30)
  function blurring() {
    load++;

    if (load > 99) {
      clearInterval(int);
    }
    var blurValue = (15 * (100 - load)) / 100;
    bg.style.filter = `blur(${blurValue}px)`;
  }

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
    };
  });

  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    console.log(file.files[0].name);
    const reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = () => {
      base64 = reader.result;
    };
  });

  // select effect
  const members = $("#members").children();
  let i = 3;
  const maxInterval = 500;
  let interval;
  const nextSelect = () => {
    console.log("## found", members[i].children[0]);
    members[i].classList.remove("select");
    const next = (i + 1) % 4;
    members[next].classList.add("select");
    i = next;
  };
  let timeOut;
  const playAnimation = function () {
    clearTimeout(timeOut);
    interval = 100;
    const loopThis = () => {
      nextSelect();
      timeOut = setTimeout(loopThis, interval);
    };
    timeOut = setTimeout(loopThis, interval);
  };

  const stopAnimation = (result, onStop = () => {}) => {
    clearTimeout(timeOut);
    const loopThis = () => {
      if (interval <= maxInterval) interval += 50;
      if (interval < maxInterval || result !== i) {
        nextSelect();
        timeOut = setTimeout(loopThis, interval);
      } else {
        clearTimeout(timeOut);
        onStop();
      }
    };
    timeOut = setTimeout(loopThis, interval);
  };

  function sleep(time = 3000) {
    return new Promise((r) => setTimeout(r, time));
  }

  function eachMember(action = () => {}) {
    for (let i = 0; i < members.length; i++) {
      action(members[i], i);
    }
  }

  async function playShakeAnimation(idolIndexes = [], onComplete = () => {}) {
    for (const member of members) {
      member.classList.add("shake");
    }
    eachMember((member) => {
      member.classList.add("shake");
    });
    await sleep();
    eachMember((member, index) => {
      member.classList.remove("shake");
      if (!idolIndexes.includes(index)) {
        member.classList.add("fall");
        setTimeout(() => {
          member.style.display = "none";
        }, 1000);
      }
    });
    onComplete();
  }

  let header = document.getElementById("header");

  const removeDup = (arr) => {
    return arr.filter((v,i,a)=>a.findIndex(v2=>(v2.class===v.class))===i);
  }

  $("#submitBtn").click(function (e) {
    e.preventDefault();
    var url = "http://127.0.0.1:5000/";
    $.post(url, { image_data: base64 }, function (JSONData, status) {
      const data = removeDup(JSON.parse(JSONData));
      console.log(data)
      const idolIndexes = data.map((item) => item.class);
      playShakeAnimation(idolIndexes, () => {
        switch (idolIndexes.length) {
          case 4:
                header.innerHTML = "Blackpink in your area!";
            break;
          case 0:
          header.innerHTML = "Blackpink in another area...";
            break;
          default:
          header.innerHTML = `Found ${data
            .map((item) => item.idol)
            .join(" and ")} in your area!`;
        }
      });
    });
  });

  $("#stopBtn").click(function (e) {
    e.preventDefault();
    stopAnimation(2);
  });
});
