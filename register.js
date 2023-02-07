
$(() => {
    $("#send").click(() => {
        sendUserData({
            username: $("#username").val(),
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            password: $("#password").val()
        })
    })

})

function sendUserData(user) {
    $.post('http://localhost:3000/user', user)
    window.location.href = 'sign_in.html'
}



$(() => {
    $("#login").click(() => {

        $.get('http://localhost:3000/user', (data) => {
            data.map(addUsers);
        })
    })
})

function addUsers(user) {
    if ($("#username").val().toUpperCase() == user.username.toUpperCase() && $("#password").val().toUpperCase() == user.password.toUpperCase()) {
        localStorage.setItem('RegisteredUser', user.username)
        window.location.href = 'joinChatRoom.html'
    } else {
        document.getElementById('messages').innerHTML = "Failed"
    }
}