$(function()
{
    let socket = io()

    socket.on("logged-response", function(response)
    {
        response_recieved(response)
    })

    socket.emit("logged")

    function response_recieved(response)
    {
        if (response.logged)
        {
            let msg_socket = io("/messages")

            $("#chat-input").keypress(function(event)
            {
                if (event.which == 13)
                {
                    $("#chat-send").click()
                }
            })

            $("#chat-send").click(function()
            {
                msg_socket.emit("chat-add-message", {
                    from: response.as,
                    text: $("#chat-input").val()
                })
                $("#chat-input").val("")
            })

            msg_socket.on("chat-update", function(data)
            {
                $("#chat-container").prepend(
"                <div class=\"chat-message\">\n" +
"                    <div class=\"chat-message-author\">From: " + data.from + "</div>\n" +
"                    <div class=\"chat-message-text\">" + data.text + "</div>\n" +
"                </div>")
            })

            msg_socket.emit("chat-history")
        }
        else
        {
            document.location.href = "index.html"
        }
    }
})