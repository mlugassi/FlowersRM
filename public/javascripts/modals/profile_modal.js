
function edit(userName) {
    $.post("Details",
        {
            uname: userName,
        },
        function (data, status) {

            var json = jQuery.parseJSON(data);
            var modal = document.getElementById('profile-modal');
            var span = document.getElementsByClassName("close")[0];
            var submit = document.getElementById('submit');

            $("#fname").val(json.firstName);
            $("#lname").val(json.lastName);
            $("#uname").val(json.userName);
            $("#role").val(json.role);
            $("#gender").val(json.gender);
            $("#status-cb-label").show();
            $("#status-cb").show();
            $('#status-cb').prop('checked', false);
			$("#pass").hide();
			$("#lablePass").hide();


            if (json.role == "employee") {
                $("#branch").val(json.branch);
                $("#branch").show();
                $("#branch-label").show();

            }
            else {
                $("#branch").hide();
                $("#branch-label").hide();
            }

            modal.style.display = "block";
            $("#role").on('change', function () {
                if (this.value == "employee") {
                    $("#branch").val(json.branch);
                    $("#branch").show();
                    $("#branch-label").show();
                    $("#branch").val("");
                }
                else {
                    $("#branch").hide();
                    $("#branch-label").hide();
                    $("#branch").val("");
                }
            })
            span.onclick = function () {

                modal.style.display = "none";
            }
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
            submit.onclick = function (event) {
                $("status-" + userName).val("Pendding");
                var status =!$("#status-cb").is(':checked');
                $.post("users/update",
                    {
                        uname: userName,
                        firstName: $("#fname").val(),
                        lastName: $("#lname").val(),
                        userName: $("#uname").val(),
                        branch: $("#branch").val(),
                        role: $("#role").val(),
                        gender: $("#gender").val(),
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

                if ($("#status-cb").is(':checked')) {
					deleteUser(userName);
                }
                else {
                    document.getElementById("img-" + userName).innerHTML = "img/" + $("#gender").val() + ".jpg";
                    document.getElementById("name-" + userName).innerHTML = $("#fname").val() + " " + $("#lname").val();
                    document.getElementById("role-" + userName).innerHTML = $("#role").val();
                    if ($("#role").val() == "employee" && $("#branch").val() != "")
                        document.getElementById("branch-" + userName).innerHTML = $("#branch").val().substring(0, $("#branch").val().indexOf(' '));

                }
                modal.style.display = "none";
            }
        });
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

function addUser() {
    var modal = document.getElementById('profile-modal');
    var span = document.getElementsByClassName("close")[0];
    var submit = document.getElementById('submit');
    $("#fname").val("");
    $("#lname").val("");
    $("#uname").val("");
    $("#branch").val("");
    $("#role").val("");
    $("#pass").val("");
    $("#gender").val("");
    $("#submit").val("Add");
    $("#branch-label").hide();
    $("#branch").hide();
    $("#status-cb-label").hide();
    $("#status-cb").hide();
    $('#status-cb').prop('checked', false);
    modal.style.display = "block";
    $("#role").on('change', function () {
        if (this.value == "employee") {
            $("#branch").show();
            $("#branch-label").show();
            $("#branch").val("");
        }
        else {
            $("#branch").hide();
            $("#branch-label").hide();
            $("#branch").val("");
        }
    })
    span.onclick = function () {

        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    submit.onclick = function (event) {
        $.post("add",
            {
                firstName: $("#fname").val(),
                lastName: $("#lname").val(),
                userName: $("#uname").val(),
                password: $("#pass").val(),
                branch: $("#branch").val(),
                role: $("#role").val(),
                gender: $("#gender").val(),
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
                    modal.style.display = "none";
                }
            });
    }
}
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}