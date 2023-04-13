// fetch teacher_source_standards data
var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTAMSH_Zq2EMGAVfX5I80Q0Ec1tfXMF_I9XlMlpGRcu9rJ7WzaRKh2mwcmPGyS_7yYIFfDCpOqd5Bzp/pub?";
var output = 'output=csv';
var ts_alt = url + output;
var ts_slt = url+"gid=1141079759&" + output;
var ts_rubrics = url+"gid=1309303705&" + output;
console.log('ts_alt: '+ts_alt+'\n ts_slt: '+ts_slt);
let my_subjects = [];
let my_subject_grade = [];
let subj = "";
let grade = "";
let my_alts = [];
let my_slts = [];
let my_rubrics = [];

function updateOutput() {
    //console.log('Updating Output...');
    subj = $('#subject').val();
    grade = $('#grade').val();
    $('#output').html('<b>Subject</b>: '+subj+'<br /><b>Grade</b>: '+grade);
    
    let ALTs = [];
    setALTs();
    setSLTs();
    setRubrics();
}

function loadSubjectChoices() {
    //console.log('setSubjects...');
    for (var i in my_subjects) {
	const my_subj = my_subjects[i];
	$("#subject").append('<option value="'+my_subj+'">'+my_subj+'</option>');
    }
}

function setALTs() {
    //Uses Subject/grade to list ALT's
    mySubj = $("#subject").val();
    myGrade = $("#grade").val();
    console.log('Setting ALTs');
    var myText = "<table id='alt_table'>";
    for(i in my_alts) {
	//console.log('process item: '+item);
	var row = my_alts[i];
	if(row['subject'] == mySubj  & row['grade'] == myGrade) {
	    myText += "<tr><td>"+row['alt_code']+'</td><td>'+row['alt_slug']+'</td><td>'+row['alt_desc']+'</td></tr>';
	}
    }
    myText += '</table>';
    $('#ALTs').html(myText);
}

function setSLTs() {
    mySubj = $("#subject").val();
    myGrade = $("#grade").val();
    console.log('Setting SLTs');
    var myText = "<table id='slt_list'>";
    for(i in my_alts) {
	//console.log('process item: '+item);
	var row = my_alts[i];
	var slts_n = 0;
	
	if(row['subject'] == mySubj  & row['grade'] == myGrade) {
	    //myText += "<tr><td>"+row['alt_code']+'</td><td>'+row['alt_slug']+'</td><td>'+row['alt_desc']+'</td></tr>';
	    myText += "<tr class='alt_row'><td>"+row['alt_code']+'</td><td>'+row['alt_slug'] + '</td><td>' + row['alt_desc']+'</td></tr>';
	    var slt_unique = []; // slt_codes matched to this alt -- to ensure no repeats.
	    for (j in my_slts) {
		var row_slt = my_slts[j];
		if(row_slt['alt_code'] == row['alt_code'] & !slt_unique.includes(row_slt['slt_code'])) {
		    //we have a matched ALT...
		    slt_unique.push(row_slt['slt_code']);
		    slts_n += 1;
		    myText += "<tr class='slt_row'><td>"+row_slt['slt_code']+'</td><td>'+row_slt['slt_slug'] + '</td><td>' + row_slt['slt_desc']+'</td></tr>';
		}
	    }
	    /*if (slts_n > 0) {
		myText += '</ul>';
	    }*/
	}
    }
    myText += '</table>';    
    $('#SLTs').html(myText);
}

function setRubrics() {
    mySubj = $("#subject").val();
    myGrade = $("#grade").val();
    console.log('Setting Rubrics...');
    var myText = "<div id='rubric_list'>";			
    for(i in my_rubrics) {
	//console.log('process item: '+item);
	var row = my_rubrics[i];

	if(row['subject'] == mySubj  & row['grade'] == myGrade) {
	    myText += '<table class="rubric">';	    
	    //myText += "<tr><td>"+row['alt_code']+'</td><td>'+row['alt_slug']+'</td><td>'+row['alt_desc']+'</td></tr>';
	    const alt_desc = my_alts.find(o => o.alt_code == row['alt_code'])['alt_desc'];
	    myText += "<tr class='rubric_alt'><td colspan='5'>"+row['alt_code']+' - '+ alt_desc +'</td></tr>';
	    myText += '<tr class="rubric_header"><td>SLT List</td><td>Highly Proficient</td><td>Proficient</td><td>Nearly Proficient</td><td>Working Towards Proficiency</td></tr>';
	    myText += '<tr><td>'+row['slt_list']+'</td><td>'+row['rubricHP']+'</td><td>'+row['rubricP']+'</td><td>'+row['rubricNP']+'</td><td>'+row['rubricWT']+'</td></tr>';
	myText += '</table></p>';	    
	}

    }
    myText = myText.replaceAll("<p></p>","");
    myText = myText.replaceAll("\n","<br />");
    myText += "</div>";
    $('#Rubrics').html(myText);
}

function getSLTs() {
    //Need to fetch data from other tab...
    $.ajax({
	url: ts_slt,
	success: function(response) {
	    console.log("Got response from SLTs!");
	    var item = response.split("\n");
	    var myJson = $.csv.toObjects(response);
	    try {
		for (var row in item) {
		    var subj = myJson[row]["**Subject**"];
		    var grade = myJson[row]["**Grade**"];
		    var ALT_code = myJson[row]["**ALTCode**"];
		    var SLT_code = myJson[row]["SLTCode"];
		    var SLT_slug = myJson[row]["SLT"];
		    var SLT_desc = myJson[row]["SLTDesc"];
		    const myVal = {
			'subject': subj,
			'grade': grade,
			'alt_code': ALT_code,
			'slt_code': SLT_code,
			'slt_slug': SLT_slug,
			'slt_desc': SLT_desc
		    };
		    if (!my_slts.includes(myVal)) {
			my_slts.push(myVal);
		    }
		}
		setSLTs();
	    } catch(e) {
		console.log('Error caught: '+e);
	    }
	}
    })
}

function getRubrics() {
    //Need to fetch data from other tab...
    $.ajax({
	url: ts_rubrics,
	success: function(response) {
	    console.log("Got response from SLTs!");
	    var item = response.split("\n");
	    var myJson = $.csv.toObjects(response);
	    try {
		for (var row in item) {
		    var subj = myJson[row]["**Subject**"];
		    var grade = myJson[row]["**Grade**"];
		    var ALT_code = myJson[row]["**ALTCode**"];
		    var SLTs = myJson[row]["SLTs"];
		    var rubricHP = myJson[row]["HighlyProficient"];
		    var rubricP = myJson[row]["Proficient"];
		    var rubricNP = myJson[row]["NearlyProficient"];
		    var rubricWT = myJson[row]["WorkingTowardsProficiency"];
		    
		    const myVal = {
			'subject': subj,
			'grade': grade,
			'alt_code': ALT_code,
			'slt_list': SLTs,
			'rubricHP': rubricHP,
			'rubricP': rubricP,
			'rubricNP': rubricNP,
			'rubricWT': rubricWT,
		    };
		    if (!my_rubrics.includes(myVal)) {
			my_rubrics.push(myVal);
		    }
		}
	    } catch(e) {
		console.log('Error caught: '+e);
	    }
	}
    })
}

function loadGradeChoices() {
    //console.log('SetGrades... my_subj_grade is: '+my_subject_grade.length);
    var subj_selected = $('#subject').val();
    $('#grade').empty();
    var grade_unique = [];
    for (item in my_subject_grade) {
	var subj = Object.keys(my_subject_grade[item]).toString();
	var grade = Object.values(my_subject_grade[item]).toString();
	if (subj == subj_selected & !grade_unique.includes(grade)) {
	    grade_unique.push(grade);
	    $("#grade").append("<option value='"+grade+"'>"+grade+"</option>");
	}
    }
    updateOutput();
}

$.ajax({
    url: ts_alt,
    success: function (response) {
	// this is where you can do what you want with the data
	var item = response.split("\n");
	var myJson = $.csv.toObjects(response);
	//console.log(myJson[1]);
	//console.log(myJson[1]["**Subject**"]);
	//console.log('myJson has length: '+Object.keys(myJson).length);
	try {
	    for (var row in item) {
		var subj = myJson[row]["**Subject**"];
		var grade = myJson[row]["**Grade**"];
		var ALT_code = myJson[row]["ALTCode"];
		var ALT_slug = myJson[row]["ALT"];
		var ALT_desc = myJson[row]["ALTDesc"];
		if (!my_subjects.includes(subj)) {
		    my_subjects.push(subj);
		}
		if (!my_subject_grade.includes({[subj]: grade})) {
		    my_subject_grade.push({[subj]: grade});
		}
		const myVal = {
		    'subject': subj,
		    'grade': grade,
		    'alt_code': ALT_code,
		    'alt_slug': ALT_slug,
		    'alt_desc': ALT_desc
		}
		if (!my_alts.includes(myVal)) {
		    my_alts.push(myVal);
		}
	    }
	} catch(e) {
	    console.log('Error caught: '+e);
	}
	loadSubjectChoices();
	loadGradeChoices();
	setALTs();
    }
});

// Run once things are ready for us!
$(window).on('load', function() {
    console.log("window loaded... running script...");
    updateOutput();
    getSLTs();
    getRubrics();
});

$('#subject').change(function () {
    var optionSelected = $(this);
    var valueSelected  = optionSelected.val();
    var textSelected   = optionSelected.text();
    console.log("Val selected:" + valueSelected);
    updateOutput();
    loadGradeChoices();
});

$('#grade').change(function() {
    updateOutput();
});
