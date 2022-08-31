//Load data
function loadDataFromText() {
  let myTextArea =
    document.getElementById('loadFromText')
  let dataText = myTextArea.value;
  let jsonData;
  try {
    jsonData = JSON.parse(dataText);
    console.log("loadDataFromText: loaded", jsonData)
    parseJsonToObjects(jsonData);
    refreshCurrentData()
  } catch (e) {
    console.log("loadDataFromText: Error", e)
    alert("Not valid JSON")
  }
}

var cachedQuestions = [];

function parseJsonToObjects(jsonData) {
  let questions = [];
  for (let i = 0; i < jsonData.length; i++) {
    let q = jsonData[i];
    let question = new Question(q.label, undefined);
    let answers = [];
    for (let j = 0; j < q.answers.length; j++) {
      let answer = new Answer(q.answers[j].label, q.answers[j].count);
      answers.push(answer);
    }
    question.answers = answers;
    questions.push(question);
  }
  cachedQuestions = questions;
}

function refreshCurrentData() {
  refreshCurrentDataAsHumanReadable();
  refreshCurrentDataAsJson();
}

function refreshCurrentDataAsJson() {
  console.log("refreshCurrentData", cachedQuestions);
  document.getElementById('preCurrentData').innerHTML =
    "<pre>JSON Output:\n\n" +
    JSON.stringify(cachedQuestions, null, 2) +
    "</pre>\n";
}

function refreshCurrentDataAsHumanReadable() {
  let output = "";
  for (let i = 0; i < cachedQuestions.length; i++) {
    let question = cachedQuestions[i];
    let qOut = "";
    qOut += "<table>\n";
    qOut += "<tr>" +
      "<th colspan='2'>" + question.label + "</th>" +
      "<td>" +
      "<button onclick='editQuestionLabel(" + i + ", " + question.label + ")'>✏️</button>" +
      "<button onclick='deleteQuestion(" + i + ")'>❌</button>" +
      "</td>" +
      "</tr>\n";
    for (let j = 0; j < question.answers.length; j++) {
      let answer = question.answers[j];
      qOut += "<tr>" +
        "<td>" +
        "<button onclick='editAnswerLabel(" + i + "," + j + ", " + answer.label + ")'>✏️</button>&nbsp;\n" +
        answer.label +
        "</td>" +
        "<td>" + answer.count + "</td>" +
        "<td>" +
        "<button onclick='editAnswerCount(" + i + "," + j + "," + answer.count + ")'>✏️</button>" +
        "<button onclick='deleteAnswer(" + i + "," + j + ")'>❌</button>" +
        "</td>" +
        "</tr>\n";
    }
    qOut += "<tr><td><button onclick='addAnswer(" + i + ")'>➕ add answer...</button></td></tr>\n"
    qOut += "</table>\n<hr />\n";
    output += qOut;
  }
  output += "<button onclick='addQuestion()'>➕ add question...</button>";
  document.getElementById('divCurrentData').innerHTML = output;
}

//CRUD
function deleteAnswer(questionIndex, answerIndex) {
  cachedQuestions[questionIndex].answers.splice(answerIndex, 1);
  refreshCurrentData()
}

function deleteQuestion(questionIndex) {
  cachedQuestions.splice(questionIndex, 1);
  refreshCurrentData()
}

function editQuestionLabel(questionIndex, defaultText) {
  let newData = prompt("Change question label to:", defaultText);
  if (newData == null) {
    newData = defaultText;
  }
  cachedQuestions[questionIndex].label = newData;
  refreshCurrentData()
}

function editAnswerLabel(questionIndex, answerIndex, defaultText) {
  let newData = prompt("Change answer label to:", defaultText);
  if (newData == null) {
    newData = defaultText;
  }
  cachedQuestions[questionIndex].answers[answerIndex].label = newData;
  refreshCurrentData()
}

function editAnswerCount(questionIndex, answerIndex, defaultText) {
  let newData = prompt("Change answer count to:", defaultText);
  if (newData == null) {
    newData = defaultText;
  }
  cachedQuestions[questionIndex].answers[answerIndex].count = newData;
  refreshCurrentData()
}

function addAnswer(questionIndex) {
  let newData = prompt("Enter answer label", "?");
  if (newData == null) {
    return;
  }
  cachedQuestions[questionIndex].answers.push(new Answer(newData, 0));
  refreshCurrentData()
}

function addQuestion() {
  let newData = prompt("Enter question label", "?");
  if (newData == null) {
    return;
  }
  cachedQuestions.push(new Question(newData, []));
  refreshCurrentData()
}

//MODEL
class Question {
  constructor(label, answers) {
    this.label = label;
    this.answers = answers;
  }
}

class Answer {
  constructor(label, count) {
    this.label = label;
    this.count = count;
  }
}