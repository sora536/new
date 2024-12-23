home = document.getElementById("home");
homeButton = document.getElementById("homeButton");
record = document.getElementById("record");
recordButton = document.getElementById("recordButton");
memo = document.getElementById("memo");
memoButton = document.getElementById("memoButton");
setting = document.getElementById("setting");
settingButton = document.getElementById("settingButton");

scoreInfo = document.getElementById("scoreInfo");
select = document.getElementById("select");
finalSelect = document.getElementById("finalSelect");

memoList = document.getElementById("memoList");

day =
  new Date().getFullYear() +
  "年" +
  (new Date().getMonth() + 1) +
  "月" +
  new Date().getDate() +
  "日";

/*
scoreの構造
score[["日付",[70m],[50m],[30m],[18m],[10m],[レジスタ]],[...],...]

*/
var score = [[]];
//localstoregeの内容を取る
if (localStorage.getItem("score") && localStorage.getItem("score") !== "[]") {
  score = JSON.parse(localStorage.getItem("score"));
} else {
  //ないときは初期化
  score = [[day, [], [], [], [], [], []]];
  saveScore();
}

if (localStorage.getItem("distance")) {
  scoreInfo.textContent = JSON.parse(localStorage.getItem("distance"));
  select.value = JSON.parse(localStorage.getItem("distance"));
}

if (score[0][0] !== day) {
  score.unshift([day, [], [], [], [], [], []]);
  saveScore();
}

function saveScore() {
  localStorage.setItem("score", JSON.stringify(score));
}

function footerClick(e, id) {
  home.classList.remove("open");
  homeButton.classList.remove("open");
  record.classList.remove("open");
  recordButton.classList.remove("open");
  memo.classList.remove("open");
  memoButton.classList.remove("open");
  setting.classList.remove("open");
  settingButton.classList.remove("open");
  e.classList.add("open");
  id.classList.add("open");
}
function overlayClose() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("saveCheckWindow").style.display = "none";
  select.value = JSON.parse(localStorage.getItem("distance"));
}

//必ずidは同じのを使わず、tableにdistanceのidをつける

function makeScoreTable() {
  var clone = scoreTableTemplate.content.cloneNode(true);
  scoreTable.appendChild(clone);
}

function scoreButtonClick(num) {
  if (score[0][6].length == 36) {
    finalSelect.value = JSON.parse(localStorage.getItem("distance"));
    document.getElementById("overlay").style.display = "block";
    document.getElementById("saveCheckWindow").style.display = "block";
  } else {
    //レジスタに保存
    score[0][6].push(num.id);
    setScoreTable("home", score[0][6].length, 0);
  }
  saveScore();
}

function saveCheckClick() {
  console.log(finalSelect.value);

  if (finalSelect.value == "70m") {
    score[0][1].push(score[0][6]);
  } else if (finalSelect.value == "50m") {
    score[0][2].push(score[0][6]);
  } else if (finalSelect.value == "30m") {
    score[0][3].push(score[0][6]);
  } else if (finalSelect.value == "18m") {
    score[0][4].push(score[0][6]);
  } else if (finalSelect.value == "10m") {
    score[0][5].push(score[0][6]);
  }

  score[0][6] = [];
  console.log(score[0][6]);
  saveScore();
  overlayClose();
  setScoreTable("home", 36, 0);
}

function changeDistance(distance) {
  localStorage.setItem("distance", JSON.stringify(distance.value));
  scoreInfo.textContent = distance.value;
}

//引き数として距離と表示する行射数day(arrayの場所)をとる
function setScoreTable(distance, shots, day) {
  //使うデータの複製
  if (distance == "70m") {
    data = score[day][1].slice(
      score[day][1].length - shots,
      score[day][1].length
    );
  } else if (distance == "50m") {
    data = score[day][2].slice(
      score[day][2].length - shots,
      score[day][2].length
    );
  } else if (distance == "30m") {
    data = score[day][3].slice(
      score[day][3].length - shots,
      score[day][3].length
    );
  } else if (distance == "18m") {
    data = score[day][4].slice(
      score[day][4].length - shots,
      score[day][4].length
    );
  } else if (distance == "10m") {
    data = score[day][5].slice(
      score[day][5].length - shots,
      score[day][5].length
    );
  } else if (distance == "home") {
    data = score[day][6].slice(
      score[day][6].length - shots,
      score[day][6].length
    );
  }

  for (let i = 0; i < shots; i++) {
    if (data[i] == undefined) {
      document.getElementById(distance + "-" + i).textContent = "";
    } else {
      document.getElementById(distance + "-" + i).textContent = data[i];
    }
  }
  for (let round = 1; round - 1 < shots / 36; round++) {
    scoreSumAll = 0;
    for (let j = 1; j <= shots / 6; j++) {
      scoreSum = 0;
      for (let i = 0; i < 6; i++) {
        if (data[i + 6 * (j - 1)] == "X") {
          scoreSum += 10;
          scoreSumAll += 10;
        } else if (data[i + 6 * (j - 1)] == "M") {
        } else if (data[i + 6 * (j - 1)] == undefined) {
          scoreSum = NaN;
          scoreSumAll = NaN;
        } else {
          scoreSum += Number(data[i + 6 * (j - 1)]);
          scoreSumAll += Number(data[i + 6 * (j - 1)]);
        }
      }
      if (isNaN(scoreSum) || isNaN(scoreSumAll)) {
        document.getElementById(distance + "-sum_" + j).textContent = "";
        document.getElementById(distance + "-all_" + j).textContent = "";
      } else {
        document.getElementById(distance + "-sum_" + j).textContent = scoreSum;
        document.getElementById(distance + "-all_" + j).textContent =
          scoreSumAll;
      }
    }
  }
}
//読み込みのときに表示
setScoreTable("home", 36, 0);
//memoの作業

//memoCLickでlocalstolageを更新してsetMemoで表示を更新する
//memo =[["content",true],["content",false]]
//memoClickでinputタグのreset
var memoContent = [];
if (localStorage.getItem("memoContent")) {
  memoContent = JSON.parse(localStorage.getItem("memoContent"));
  for (let i = 0; i < memoContent.length; i++) {
    p = document.createElement("p");
    if (memoContent[i][1]) {
      p.classList.add("checked");
    }
    p.classList.add("memoItem");
    p.setAttribute("onclick", "memoItemClick(this)");
    p.textContent = memoContent[i][0];
    memoList.prepend(p);
  }
}

function memoClick(memoInput) {
  event.preventDefault();

  memoContent.push([memoInput, false]);
  localStorage.setItem("memoContent", JSON.stringify(memoContent));

  p = document.createElement("p");
  p.classList.add("memoItem");
  p.setAttribute("onclick", "memoItemClick(this)");
  p.textContent = memoInput;
  memoList.prepend(p);
}
function memoItemClick(item) {
  item.classList.toggle("checked");
  for (let i = 0; i < memoContent.length; i++) {
    if (memoContent[i][0] == item.textContent) {
      console.log(i);
      memoContent[i][1] = !memoContent[i][1];
      localStorage.setItem("memoContent", JSON.stringify(memoContent));
    }
  }
  //さがしてtoggle
}
