$(function()
{  
    let socket = io();

    socket.on("log-in-response", function(response)
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
                $("#log-in-form").append(
                    "<div class=\"form-item\" id=\"response\">" + 
                    response.text + 
                    "</div>")
            }
            $("#response").css("color", "rgb(255, 0, 0)")
        }
        else
        {
            document.location.href = "/chat.html"
        }
    })

    $("#username").keypress(function(event)
    {
        if (event.which == 13)
        {
            $("#log-in").click()
        }
    })

    $("#password").keypress(function(event)
    {
        if (event.which == 13)
        {
            $("#log-in").click()
        }
    })

    $("#log-in").click(function()
    {
        socket.emit("log-in", {
            username: $("#username").val(),
            password: $("#password").val(),
        })
    })
})