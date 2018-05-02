
$(document).click(function (e) {
    if ($(e.target).is('#sign-up-modal')) {
        $('#sign-up-modal').hide();
    }
});
function openSingUpModal() {
    $("#login-modal").hide();
    if ($("#fname-signup").val() != "") $("#fname-signup").val("");
    if ($("#lname-signup").val() != "") $("#lname-signup").val("");
    if ($("#uname-signup").val() != "") $("#uname-signup").val("");
    if ($("#pass-signup").val() != "") $("#pass-signup").val("");
    if ($("#vpass-signup").val() != "") $("#vpass-signup").val("");
    if ($("#mail-signup").val() != "") $("#mail-signup").val("");
    if ($("#gender-signup").val() != "") $("#gender-signup").val("");
    $("#sign-up-modal").show();
}
function signUpAndLogin() {
    if ($("#pass-signup").val() != $("#vpass-signup").val())
        alert("Password and confirm password doesn't match");
    else {
        $.post("users/add",
            {
                firstName: $("#fname-signup").val(),
                lastName: $("#lname-signup").val(),
                userName: $("#uname-signup").val(),
                password: md5($("#pass-signup").val()),
                email: $("#mail-signup").val(),
                branch: "",
                role: "customer",
                gender: $("#gender-signup").val(),
                active: true
            },
            function (data, status) {
                try {
                    var json = jQuery.parseJSON(data);
                    alert(json.error);
                }
                catch (err) {
                    $("#sign-up-modal").hide();
                    $("#loader").show();
                    setTimeout(function () {
                        login('signup');
                    }, 1000);
                }
            });
    }

}