function editPassword() {
    if ($("#checkbox-pass-editUser").prop('checked')) {
        $("#opass-editUser").prop('disabled', false);
        $("#pass-editUser").prop('disabled', false);
        $("#vpass-editUser").prop('disabled', false);
        $("#opass-editUser").prop('required', true);
        $("#pass-editUser").prop('required', true);
        $("#vpass-editUser").prop('required', true);
    } else {
        $("#opass-editUser").prop('disabled', true);
        $("#pass-editUser").prop('disabled', true);
        $("#vpass-editUser").prop('disabled', true);
    }
}
function openUserModal() {
    $.get("users/Details",{ },
        function (data, status) {

            var json = jQuery.parseJSON(data);
            //var modal = document.getElementById('profileModal');
            //var span = document.getElementsByClassName("close")[0];

            $("#fname-editUser").val(json.firstName);
            $("#lname-editUser").val(json.lastName);
            $("#uname-editUser").val(json.userName);
            editPassword();
            $("#mail-editUser").val(json.email);
            $("#gender-editUser").val(json.gender);
            $("#edit-modal").show();
        }
    );
}

$(document).click(function (e) {
    if ($(e.target).is('#edit-modal')) {
        var answer = confirm("Do you realy want to exit?\nYour changes will not save.")
        if (answer) {
            $('#edit-modal').hide();
        }
    }

});
function editUserData() {

    var user = {};
    //uname = userName;
    user.firstName = $("#fname-editUser").val();
    user.lastName = $("#lname-editUser").val();
    user.userName = $("#uname-editUser").val();
    if ($("#checkbox-pass-editUser").prop('checked')) {
        user.oldPassword = md5($("#opass-editUser").val());
        user.password = md5($("#pass-editUser").val());
    }
    user.gender = $("#gender-editUser").val();
    user.email = $("#mail-editUser").val();
    if ($("#pass-editUser").val() != $("#vpass-editUser").val())
        alert("Password and confirm password doesn't match");
    else {
        $.post("users/update",
            {
                user: user
            },
            function (data, status) {
                try {
                    var json = jQuery.parseJSON(data);
                    alert(status);
                    $('#edit-modal').hide();
                }
                catch (err) {
                    alert(err);
                }
            }
        ).fail(function (data, status) {
            alert("Your old password is wrong!!\nPlease try again.");
        });
    }
}


