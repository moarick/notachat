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
            $("[name=\"start\"]").click(function()
            {
                document.location.href = "chat.html"
            })
        }
        else
        {
            $("[name=\"start\"]").click(function()
            {
                document.location.href = "login.html"
            })
        }
    }
})