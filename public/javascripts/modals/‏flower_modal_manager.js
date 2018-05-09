$(document).click(function (e) {
    if ($(e.target).is('#flower-modal')) {
        $('#flower-modal').hide();
    }
});

function addFlower() {
    $('#flower-modal').hide();
    let file = document.getElementById('file-flower').files[0];
    var pic = '';
    if (document.getElementById('file-flower').files.length != 0 && $("#url-flower").val() == "")
        pic = file.name;
    else if ($("#url-flower").val() != "")
        pic = $("#url-flower").val();
    else if (document.getElementById('file-flower').files.length == 0 && $("#url-flower").val() == "")
        alert("Must to upload a picture!");
    else
        alert("Choose only one way to upload");

    $.post("add",
        {
            flower: $("#name-flower").val(),
            color: $("#color-flower").val(),
            cost: $("#cost-flower").val(),
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


  //  event.preventDefault();
    // Get the selected files from the input.
    if (pic != '') {
        let xhr = new XMLHttpRequest();
        if (xhr.upload) {
            // start upload
            xhr.open("POST", "addPicture", true);
            xhr.setRequestHeader("X_FILENAME", pic);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    var h3 = $("<h3></h3>").text($("#name-flower").val());
                    var p = $("<p></p>").text($("#cost-flower").val());
                    var div1 = $("<div></div>").attr("class", "carousel-caption");
                    div1.append(h3, p);
                    var img = $("<img></img>").attr("src", "\\images\\" + pic, "alt", "Image");
                    var div2 = $("<div></div>").attr("class", "item", "onclick", "showFlowerDeatails(" + $("#name-flower").val() + ")");
                    div2.append(img, div1);
                    $("#catalog_carousel").append(div2);

                    var count_indicators = document.getElementById("carousel_indicators").childElementCount;
                    var li = $("<li></li>").attr("data-target", "#myCarousel", "data-slide-to", count_indicators + 1);
                    $("#carousel_indicators").append(li);
                } else
                    alert('An error occurred!');
            };
            xhr.send(file);
        }
    }
}
function showFlowerDeatails(fName) {
    $.post("Details",
        {
            flower: fName,
        },
        function (data, status) {
            var json = jQuery.parseJSON(data);

            $("#name-flower").val(json.flower);
            $("#color-flower").val(json.color);
            $("#cost-flower").val(json.cost);
            $("#name-flower").prop("readonly", true);
            $("#color-flower").prop("readonly", true);
            $("#cost-flower").prop("readonly", true);

            $("#lpicture-flower").hide();
            $("#file-flower").hide();
            $("#lurl-flower").hide();
            $("#url-flower").hide();
            $("#clear-flower").hide();
            $("#submit-flower").hide();

            $('#flower-modal').show();
        });
}

function openFlowerModal() {
    $("#name-flower").val("");
    $("#color-flower").val("");
    $("#cost-flower").val("");
    $("#name-flower").prop("readonly", false);
    $("#color-flower").prop("readonly", false);
    $("#cost-flower").prop("readonly", false);

    $("#lpicture-flower").show();
    $("#file-flower").show();
    $("#lurl-flower").show();
    $("#url-flower").show();
    $("#clear-flower").show();
    $("#submit-flower").show();

    $("#flower-modal").show();

    $("#clear-flower").on("click", function () {
        $("#file-flower").replaceWith($("#file-flower").val('').clone(true));
    });
}