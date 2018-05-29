$(function()
{
    let socket = io()

    socket.on("sign-up-response", function(response)
    {
        
        if (response.status == 1)
        {
            let r = $("#response")
            if (r.length)
            {
                r.text(response.text)
            }
            else
            {
                $("#sign-up-form").append(
                    "<div class=\"form-item\" id=\"response\">" + 
                    response.text + 
                    "</div>")
            }
            $("#response").css("color", "rgb(255, 0, 0)")
        }
        else
        {
            document.location.href = "/login.html"
        }
    })

    $("#username").keypress(function(event)
    {
        if (event.which == 13)
        {
            $("#sign-up").click()
        }
    })

    $("#password").keypress(function(event)
    {
        if (event.which == 13)
        {
            $("#sign-up").click()
        }
    })

    $("#verify-password").keypress(function(event)
    {
        if (event.which == 13)
        {
            $("#sign-up").click()
        }
    })

    $("#sign-up").click(function()
    {
        socket.emit("sign-up", {
            username: $("#username").val(),
            password: $("#password").val(),
            verify_password: $("#verify-password").val()
        })
    })
})