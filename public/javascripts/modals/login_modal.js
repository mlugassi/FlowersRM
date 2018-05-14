$(document).click(function (e) {
    if ($(e.target).is('#login-modal')) {
        $('#login-modal').hide();
    }
});
function openLoginModal() {
    if ($("#pass-login").val() != "") $("#pass-login").val("");
    if ($("#uname-login").val() != "") $("#uname-login").val("");
    $('#login-modal').show();
}
function login(kind) {
    var salt = Math.random();
    var md5_hash = md5($("#pass-" + kind).val());
    var final_hash = md5(md5_hash + salt);
    $.post("login",
        {
            uname: $("#uname-" + kind).val(),
            psw: final_hash,
            salt: salt
        },
        function (data, status) {
            if (data.status == "success") {
                $('#login-modal').hide();
                location.reload();
            } else {
                alert(data.message);
            }
        }).fail(function (data, status) {
            alert("Your have a wrong connction!");
        });
}