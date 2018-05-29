const express = require("express")
const app = express()
const session = require("express-session")({
    secret: "SAS",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
})

app.use(session)

app.use("/", express.static(__dirname + "/client"))

app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/client/index.html")
})

const port = 0xdead

const server = app.listen(port, function()
{
    console.log("Listening on port " + port)
})

const io = require("socket.io").listen(server)
const sharedSession = require("express-socket.io-session")

io.use(sharedSession(session, {
    autoSave: true
}))


// -----------
// Connections
// -----------


let ids = []
let required_id_count = 100
{
    let set = new Set()

    while (set.size < required_id_count)
    {
        set.add(Math.random())
    }
    ids = Array.from(set)
}

let next_id = 0

io.on("connection", function(socket)
{
    if (socket.handshake.session.logged == undefined)
    {
        if (next_id < ids.length)
        {
            console.log("New session!")
            socket.handshake.session.id = ids[next_id++]
            socket.handshake.session.logged = false;
            socket.handshake.session.save()

            socket_setup(socket)
        }
        else
        {
            socket.disconnect()
        }
    }
    else
    {
        socket_setup(socket)
    }
})

let users = {
    admin: {
        username: "admin",
        password: "1"
    }
}

function socket_setup(socket)
{
    socket.on("sign-up", function(user)
    {
        let re = new RegExp(".+")

        if (user.username.trim().match(re) === null)
        {
            socket.emit("sign-up-response", {
                text: "Choose different username", 
                status: 1
            })
        }
        else 
        {
            if (user.username.toLowerCase() in users)
            {
                socket.emit("sign-up-response", {
                    text: "Username already used!",
                    status: 1
                })
            }
            else
            {
                if (user.password !== user.verify_password)
                {
                    socket.emit("sign-up-response", {
                        text: "Passwords do not match!",
                        status: 1
                    })
                }
                else
                {
                    if (user.password.match(re) === null)
                    {
                        socket.emit("sign-up-response", {
                            text: "Choose different password!",
                            status: 1
                        })
                    }
                    else
                    {
                        users[user.username.toLowerCase()] = 
                        {
                            username: user.username,
                            password: user.password // todo:: replace w/ hash
                        }

                        socket.emit("sign-up-response", {
                            text: "Signed up successfully!",
                            status: 0
                        })
                    }
                }
            }
        }
    })

    socket.on("log-in", function(user)
    {
        if (user.username.toLowerCase() in users)
        {
            if (users[user.username.toLowerCase()].password === user.password)
            {
                socket.handshake.session.logged = true
                socket.handshake.session.user = users[user.username.toLowerCase()]
                socket.handshake.session.save()

                socket.emit("log-in-response", {
                    text: "Logged in successfully!",
                    status: 0
                })
            }
            else
            {
                socket.emit("log-in-response", {
                    text: "Wrong password!",
                    status: 1
                })
            }
        }
        else
        {
            socket.emit("log-in-response", {
                text: "Wrong username!",
                status: 1
            })
        }
    })

    socket.on("logged", function()
    {
        if (socket.handshake.session.logged)
        {
            socket.emit("logged-response", {
                logged: true,
                as: socket.handshake.session.user.username
            })
        }
        else
        {
            socket.emit("logged-response", {
                logged: false
            })
        }
    })

    socket.on("log-out", function()
    {
        socket.handshake.session.logged = false;
        socket.handshake.session.user = undefined;
        socket.handshake.session.save()

        socket.emit("log-out-response", {
            text: "Logged out successfully",
            status: 0
        })
    })
}

let msg = io.of("/messages")

msg.use(sharedSession(session, {
    autoSave: true
}))

history = []

msg.on("connection", function(socket)
{
    if (socket.handshake.session.logged === true)
    {
        message_socket_setup(socket)
    }
    else
    {
        socket.disconnect();
    }
})

function message_socket_setup(socket)
{
    socket.on("chat-add-message", function(data)
    {
        history.push({
            from: data.from,
            text: data.text
        })
        io.of("/messages").emit("chat-update", history[history.length - 1])
    })

    socket.on("chat-history", function()
    {
        for (let i = 0; i < history.length; ++i)
        {
            socket.emit("chat-update", history[i])
        }
    })
}