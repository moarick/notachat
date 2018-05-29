$(function()
{
    let socket = io();

    socket.on("logged-response", function(response)
    {
        if (response.logged)
        {
            $("#right-aligned").append(
                "<div class=\"menu-item\" id=\"logged\">Logged in as " + response.as + "</div>" +
                "<div class=\"menu-item button\" name=\"logout\">Log out</div>"
                )
        }
        else
        {
            $("#right-aligned").append(
                "<div class=\"menu-item button\" name=\"login\">Log in</div>\n" +
                "<div class=\"menu-item button\" name=\"signup\">Sign up</div>"
                )
        }
        response_recieved(response)
    })

    socket.emit("logged")

    function response_recieved(response)
    {
        assign_actions()
    }

    function assign_actions()
    {
        $("[name=\"login\"]").click(function()
        {
            document.location.href = "login.html"
        })

        $("[name=\"signup\"]").click(function()
        {
            document.location.href = "signup.html"
        })

        $("[name=\"logout\"]").click(function()
        {
            socket.emit("log-out")
            document.location.href = "/"
        })
    }
})