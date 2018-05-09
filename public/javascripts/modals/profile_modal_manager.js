$(document).click(function (e) {
    if ($(e.target).is('#profile-modal')) {
        $('#profile-modal').hide();
    }
});
function openProfileModal_Edit(userName) {
    $.post("Details",
        {
            uname: userName,
        },
        function (data, status) {
            var json = jQuery.parseJSON(data);

            $("#fname-profile").val(json.firstName);
            $("#lname-profile").val(json.lastName);
            $("#mail-profile").val(json.email);
            $("#role-profile").val(json.role);
            $("#gender-profile").val(json.gender);
            $("#submit-profile").text("Submit");
            $("#uname-profile").prop('required', false);


            $("#ldelete-profile").show();
            $("#delete-profile").show();
            $("#cpass-profile").show();
            $("#lcpass-profile").show();
            $("#uname-profile").hide();
            $("#luname-profile").hide();

            $('#cpass-profile').prop('checked', false);
            $('#delete-profile').prop('checked', false);
            $("#profile-form").attr("onsubmit", 'editUser("' + json.userName + '")');
            editPassword();

            if (json.role == "employee") {
                $("#branch-profile").val(json.branch);
                $("#branch-profile").show();
                $("#lbranch-profile").show();

            }
            else {
                $("#branch-profile").hide();
                $("#lbranch-profile").hide();
            }

            $("#profile-modal").show();

            $("#role-profile").on('change', function () {
                if (this.value == "employee") {
                    $("#branch-profile").val(json.branch);
                    $("#branch-profile").show();
                    $("#lbranch-profile").show();
                    $("#branch-profile").val("");
                }
                else {
                    $("#branch-profile").hide();
                    $("#lbranch-profile").hide();
                    $("#branch-profile").val("");
                }
            })
        });
}
function openProfileModal_Add() {
    if ($("#fname-profile").val() != "") $("#fname-profile").val("");
    if ($("#fname-profile").val() != "") $("#lname-profile").val("");
    if ($("#fname-profile").val() != "") $("#uname-profile").val("");
    if ($("#fname-profile").val() != "") $("#branch-profile").val("");
    if ($("#fname-profile").val() != "") $("#mail-profile").val("");
    if ($("#fname-profile").val() != "") $("#role-profile").val("");
    if ($("#fname-profile").val() != "") $("#pass-profile").val("");
    if ($("#fname-profile").val() != "") $("#vpass-profile").val("");
    if ($("#fname-profile").val() != "") $("#gender-profile").val("");
    $("#submit-profile").text("Add");

    $("#lbranch-profile").hide();
    $("#branch-profile").hide();
    $("#ldelete-profile").hide();
    $("#delete-profile").hide();
    $("#cpass-profile").hide();
    $("#lcpass-profile").hide();
    $("#uname-profile").show();
    $("#luname-profile").show();

    $('#delete-profile').prop('checked', false);
    $('#cpass-profile').prop('checked', true);
    
    $("#profile-form").attr("onsubmit", 'addUser()');

    editPassword();

    $("#profile-modal").show();

    $("#role-profile").on('change', function () {
        if (this.value == "employee") {
            $("#branch-profile").show();
            $("#lbranch-profile").show();
            $("#branch-profile").val("");
        }
        else {
            $("#branch-profile").hide();
            $("#lbranch-profile").hide();
            $("#branch-profile").val("");
        }
    })
}
function editUser(userName) {
    alert(userName);
    if ($("#pass-profile").val() == $("#vpass-profile").val()) {
        $("status-" + userName).val("Pendding");
        var status = !$("#delete-profile").is(':checked');
        $.post("update",
            {
                uname: userName,
                firstName: $("#fname-profile").val(),
                lastName: $("#lname-profile").val(),
                email: $("#mail-profile").val(),
                password: md5($("#pass-profile").val()),
                branch: $("#branch-profile").val(),
                role: $("#role-profile").val(),
                gender: $("#gender-profile").val(),
                active: status
            },
            function (data, status) {
                document.getElementById("status-" + userName).innerHTML = "Pedding";
                var json = jQuery.parseJSON(data);
                if (json.status = "OK")
                    document.getElementById("status-" + userName).innerHTML = "Updated";
                else
                    document.getElementById("status-" + userName).innerHTML = "Error";
            });

        if ($("#delete-profile").is(':checked')) {
            var row = document.getElementById("row-" + userName);
            row.parentNode.removeChild(row);
        }
        else {
            document.getElementById("img-" + userName).innerHTML = "img/" + $("#gender-profile").val() + ".jpg";
            document.getElementById("name-" + userName).innerHTML = $("#fname-profile").val() + " " + $("#lname-profile").val();
            document.getElementById("role-" + userName).innerHTML = $("#role-profile").val();
            if ($("#role-profile").val() == "employee" && $("#branch-profile").val() != "")
                document.getElementById("branch-" + userName).innerHTML = $("#branch-profile").val().substring(0, $("#branch-profile").val().indexOf(' '));

        }
        $("#profile-modal").hide();
    }
    else
        alert("Password and confirm password doesn't match");
}
function addUser() {
    if ($("#pass-profile").val() == $("#vpass-profile").val()) {
        $.post("add",
            {
                firstName: $("#fname-profile").val(),
                lastName: $("#lname-profile").val(),
                userName: $("#uname-profile").val(),
                email: $("#mail-profile").val(),
                password: md5($("#pass-profile").val()),
                branch: $("#branch-profile").val(),
                role: $("#role-profile").val(),
                gender: $("#gender-profile").val(),
                active: true
            },
            function (data, status) {
                try {
                    var json = jQuery.parseJSON(data);
                    alert(json.error);
                }
                catch (err) {
                    var tableBody = document.getElementsByTagName("tbody")[0];
                    tableBody.appendChild(htmlToElement(data));
                    $("#profile-modal").hide();
                }
            });
    }
    else
        alert("Password and confirm password doesn't match");
}
function deleteUser(userName) {
    $.post("remove",
        {
            uname: userName,
        },
        function (data, status) {
            var json = jQuery.parseJSON(data);
            if (json.status = "OK") {
                var row = document.getElementById("row-" + userName);
                row.parentNode.removeChild(row);
            }
        });
}
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function editPassword() {
    if ($("#cpass-profile").prop('checked')) {
        $("#pass-profile").show();
        $("#vpass-profile").show();
        $("#lvpass-profile").show();
        $("#lpass-profile").show();
        $("#pass-profile").prop('required', true);
        $("#vpass-profile").prop('required', true);
    } else {
        $("#pass-profile").hide();
        $("#vpass-profile").hide();
        $("#lpass-profile").hide();
        $("#lvpass-profile").hide();
        $("#pass-profile").prop('required', false);
        $("#vpass-profile").prop('required', false);
    }
}