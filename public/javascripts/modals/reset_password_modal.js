$(document).click(function (e) {
    if ($(e.target).is('#reset-password-modal')) {
        $('#reset-password-modal').hide();
    }
});
function openResetPassword() {
    $("#login-modal").hide();
    $("#reset-password-modal").show();
}
function sendAnEmail() {
    $.post("resetPassword",
        {
            email: $("#mail-reset").val(),
        },
        function (data, status) {
            try {
                var json = jQuery.parseJSON(data);
                if (json.status == "OK") {
                    $('#reset-password-modal').hide();
                    alert("An email will send to you in few minutes")
                }
                else
                    alert(json.status);
            }
            catch (err) {
                alert(err);
                $("#reset-password-modal").hide();
                $("#mail-reset").val("");
            }
        });
}

