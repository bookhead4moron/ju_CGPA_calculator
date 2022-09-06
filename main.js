var totalSemesters = 0;
function loadForm() {
  var inputTotalSemseter = $("#inputTotalSemseter")[0].value;

  if (
    inputTotalSemseter == "0" ||
    inputTotalSemseter == "" ||
    isNaN(inputTotalSemseter)
  ) {
    $("#inputTotalSemseter")[0].focus();
    alert("Invalid Total Semesters!");
    return;
  }

  if (inputTotalSemseter < 0) {
    $("#inputTotalSemseter")[0].value *= -1;
    inputTotalSemseter *= -1;
  }

  var str = "";

  for (i = 1; i <= inputTotalSemseter; i++) {
    str +=
      "\
        <!-- Semester " +
      i +
      ' -->\
        <div id="sem_' +
      i +
      '" class="form-row">\
            <div class="form-group col-auto my-1">Semester ' +
      i +
      ':</div>\
            <div class="form-group col">\
                <input type="text" class="form-control credits" placeholder="Credits">\
            </div>\
            <div class="form-group col">\
                <input type="text" class="form-control cgpa" placeholder="GPA">\
            </div>\
        </div>\
        ';
  }

  str +=
    '\
        <button id="calculateBtn" class="btn btn-primary" onclick="calculateCGPA()">Calculate</button>';

  $("#semesterForm")[0].innerHTML = str;

  $("#resultForm")[0].innerHTML = "";

  totalSemesters = inputTotalSemseter;

  setActions();
}

function loadData(dept, data) {
  var str = "";
  var credits = [];

  if (data == null) {
    switch (dept) {
      case "ju":
        credits = [0.1, 0.1, 0.2, 0.2, 0.35, 0.35, 0.35, 0.35];
        break;
      default:
        credits = [0.1, 0.1, 0.2, 0.2, 0.35, 0.35, 0.35, 0.35];
        break;
    }
    gpa = [];
  } else {
    id = data["id"];
    credits = data["credits"];
    gpa = data["gpa"];
    name = data["name"];

    if (id == 0) {
      str +=
        '<div id="id_info" class="alert alert-danger" role="alert"><strong>Invalid ID / Data doesn\'t exists</strong></div>';
    } else {
      str +=
        '<div id="id_info" class="alert alert-warning" role="alert">ID: <strong>' +
        id +
        "</strong><br>Name: <strong>" +
        name +
        "</strong></div>";
    }
  }

  var inputTotalSemseter = credits.length;
  $("#inputTotalSemseter")[0].value = inputTotalSemseter;

  for (i = 1; i <= inputTotalSemseter; i++) {
    str +=
      "\
        <!-- Semester " +
      i +
      ' -->\
        <div id="sem_' +
      i +
      '" class="form-row">\
            <div class="form-group col-auto my-1">Semester ' +
      i +
      ':</div>\
            <div class="form-group col">\
                <input type="text" value="' +
      credits[i - 1] +
      '" class="form-control credits" placeholder="Credits">\
            </div>\
            <div class="form-group col">\
                <input type="text" value="' +
      (gpa.length == 0 ? "" : gpa[i - 1]) +
      '" class="form-control cgpa" placeholder="GPA">\
            </div>\
        </div>\
        ';
  }

  str +=
    '\
        <button id="calculateBtn" class="btn btn-primary" onclick="calculateCGPA()">Calculate</button>';

  $("#semesterForm")[0].innerHTML = str;

  $("#resultForm")[0].innerHTML = "";

  totalSemesters = inputTotalSemseter;

  setActions();
}

function clearForm() {
  for (i = 0; i < $(".cgpa").length; i++) {
    $(".cgpa")[i].value = "";
    $(".credits")[i].value = "";
  }
  $("#id_info").remove();
  $("#resultForm")[0].innerHTML = "";
}

function calculateCGPA() {
  var totalCredits = 0;
  var total = 0;
    var linear_cgpa = 0;
  var arr = [];

  for (i = 1; i <= totalSemesters; i++) {
    var credits = $("#sem_" + i)
      .contents()
      .find(".credits")[0].value;
    var cgpa = $("#sem_" + i)
      .contents()
      .find(".cgpa")[0].value;

    if (credits == "0" || credits == "" || isNaN(credits)) {
      $("#sem_" + i)
        .contents()
        .find(".credits")[0]
        .focus();
      alert("Invalid Credits Value of Semester " + i + "!");
      return;
    }

    if (cgpa == "0" || cgpa == "" || isNaN(cgpa)) {
      $("#sem_" + i)
        .contents()
        .find(".cgpa")[0]
        .focus();
      alert("Invalid CGPA Value of Semester " + i + "!");
      return;
    }

    var credits = parseFloat(credits);
    var cgpa = parseFloat(cgpa);

    totalCredits += credits;
    total += cgpa * credits;
    linear_cgpa += cgpa;

    arr[i - 1] = { credits: credits, cgpa: cgpa };
  }
  linear_cgpa /= totalSemesters;
  var cgpa = total / totalCredits;
  var percentage=(55+(10*(cgpa-6)));
  var result =
    '\
    <div class="alert alert-success" role="alert">CGPA: <strong>' +
    cgpa.toFixed(2) + "</strong></div>" + 
    '\
    <div class="alert alert-success" role="alert">Linear CGPA: <strong>' + 
    linear_cgpa.toFixed(2) + 
    '</strong></div>\
    <div class="alert alert-primary" role="alert">Percentage Marks: <strong>' +
    percentage.toFixed(2) +
    "%</strong></div>";

  $("#resultForm")[0].innerHTML = result;
}

$(document).ready(function () {
  $("#inputTotalSemseter").on("keydown", function (e) {
    if (e.keyCode === 13) {
      loadForm();
    }
  });

  processParameters();
});

function setActions() {
  $(".credits").on("keydown", function (e) {
    if (e.keyCode === 13) {
      this.parentElement.nextElementSibling.children[0].focus();
    }
  });

  $(".cgpa").on("keydown", function (e) {
    if (e.keyCode === 13) {
      if (
        this.parentElement.parentElement.nextElementSibling.type == "submit"
      ) {
        calculateCGPA();
      } else {
        this.parentElement.parentElement.nextElementSibling.children[1].children[0].focus();
      }
    }
  });
}
