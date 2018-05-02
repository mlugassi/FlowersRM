function edit(fName) {
    $.post("Details",
        {
            flower: fName,
        },
        function (data, status) {
            var json = jQuery.parseJSON(data);
            var modal = document.getElementById('profile-modal');
            var span = document.getElementsByClassName("close")[0];
            var submit = document.getElementById('submit');
            $("#fname").val(json.flower);
            $("#fcolor").val(json.color);
            $("#fcost").val(json.cost);
            $("#fname").prop("readonly", true);
            $("#fcolor").prop("readonly", true);
            $("#fcost").prop("readonly", true);

            $("#pictureLabel").hide();
            $("#ffile").hide();
            $("#urlFile").hide();
            $("#submit").hide();
            modal.style.display = "block";

            span.onclick = function () {
                modal.style.display = "none";
            }
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
        });
}

function addFlower() {

    var modal = document.getElementById('profile-modal');
    var span = document.getElementsByClassName("close")[0];
    var submit = document.getElementById('submit');

    $("#fname").val("");
    $("#fcolor").val("");
    $("#fcost").val("");
    $("#fname").prop("readonly", false);
    $("#fcolor").prop("readonly", false);
    $("#fcost").prop("readonly", false);
    $("#pictureLabel").show();
    $("#ffile").show();
    $("#submit").show();
    modal.style.display = "block";

    $("#clear").on("click", function () {
        $("#ffile").replaceWith($("#ffile").val('').clone(true));
    });

    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    submit.onclick = function (event) {
		modal.style.display = "none";
		let file = document.getElementById('ffile').files[0];
		 var pic = '';
        if (document.getElementById('ffile').files.length != 0 && $("#urlFile").val() == "")
            pic = file.name;
        else if ($("#urlFile").val() != "")
            pic = $("#urlFile").val();
        else if (document.getElementById('ffile').files.length == 0 && $("#urlFile").val() == "")
            alert("Must to upload picture!");
        else
            alert("Choose only one way to upload");
		
        $.post("add",
            {
                flower: $("#fname").val(),
                color: $("#fcolor").val(),
                cost: $("#fcost").val(),
                picture: pic,
            },
            function (data, status) {

                try {
                    var json = jQuery.parseJSON(data);
                    alert(json.error);
                }
                catch (err) {
                    var tableBody = document.getElementsByTagName("tbody")[0];
                    tableBody.appendChild(htmlToElement(data));
                    modal.style.display = "none";
                }
            });
			
			
		/*var form_data = new FormData();
		form_data.append("file", file);         
		$.post("addPicture", 
		{
			data: form_data,           
		},
		function (data, status) {
			alert(345343);
		});*/
		event.preventDefault();
         // Get the selected files from the input.
        if (pic != '') {
           let xhr = new XMLHttpRequest();
           if (xhr.upload) {
              // start upload
              xhr.open("POST", "addPicture", true);
              xhr.setRequestHeader("X_FILENAME", pic);
              xhr.onload = () => {
                 if (xhr.status === 200) {
					 //$("#divCatalog").load("/catalog", {"uname": userName});

					 var h3 = $("<h3></h3>").text($("#fname").val());
					 var p = $("<p></p>").text($("#fcost").val());
					 var div1 = $("<div></div>").attr("class", "carousel-caption");
					 div1.append(h3,p);
					 var img = $("<img></img>").attr("src", "\\images\\" + pic, "alt", "Image");
					 var div2 = $("<div></div>").attr("class", "item", "onclick", "edit(" + $("#fname").val() + ")");
					 div2.append(img, div1);
					 $("#catalog_carousel").append(div2);
					 
					 var count_indicators = document.getElementById("carousel_indicators").childElementCount;
					 var li = $("<li></li>").attr("data-target", "#myCarousel","data-slide-to" ,count_indicators + 1);
					 $("#carousel_indicators").append(li);
					 } else
                     alert('An error occurred!');
		   };
              xhr.send(file);
		   }
		 }
			/*$.post("addPicture",
            {
                file: file,
            },
            function (data, status) {
					alert("Work3");
                try {
                    var json = jQuery.parseJSON(data);
                    alert(json.error);
                }
                catch (err) {
                    var tableBody = document.getElementsByTagName("tbody")[0];
                    tableBody.appendChild(htmlToElement(data));
                    modal.style.display = "none";
                }
            });*/
    }
}