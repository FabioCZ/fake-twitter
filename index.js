const express = require('express')
const app = express()
app.use(express.json())
const port = 3000

const tweets = []
const users = []

// Helper functions
function makeTweet(user, text, id) {
    return {
        'author' : user,
        'text' : text,
        'date' : new Date().toISOString(),
        'id' : id
    }
}

function makeUser(name) {
    return {
        'name' : name,
        'follow' : []
    }
}

function tweetById(id) {
    return tweets.find((x) => x.id == id)
}

function userByName(name) {
    return users.find(x => x.name == name)
}

function userExists(user) {
    return users.some(x => x.name == user)
}

function newId() {
    return tweets.length + 1
}

// Tweet Routes
app.get('/v1/tweet/:id', (req, res) => {
    let id = req.params.id
    let tweet = tweetById(id)
    if (tweet != undefined) {
        res.json(tweet)
    } else {
        res.status(404).send('Tweet ' + id + ' not found')
    }
})

app.post('/v1/tweet/', (req, res) => {
    if (!userExists(req.body.author)) {
        res.status(404).send('User not found')
    } else {
        let tweet = makeTweet(req.body.author, req.body.text, newId())
        tweets.unshift(tweet)
        res.json(tweet)
    }
})

app.put('/v1/tweet/:id', (req, res) => {
    let id = req.params.id
    let tweet = tweetById(id)
    if (tweet.author !== req.body.author) {
        res.status(403).send('Original author and updating user must be the same')
    } else if (tweet != undefined) {
        tweet.text = req.body.text
        res.json(tweet)
    } else {
        res.status(404).send('Tweet ' + id + ' not found')
    }
})

app.delete('/v1/tweet/:id', (req, res) => {
    let id = req.params.id
    let tweet = tweetById(id)
    if (tweet != undefined) {
        res.status(200).send(id + ' deleted')
    } else {
        res.status(404).send('Tweet ' + id + ' not found')
    }
})

app.get('/v1/tweets', (req, res) => {
    res.json(tweets)
})

app.get('/v1/tweet/random', (req, res) => {
    if (tweets.length == 0) {
        res.send('No tweets available')
    } else {
        res.json(tweets[items.length * Math.random() | 0])
    }
})

// User routes
app.post('/v1/user/new', (req, res) => {
    if (userExists(req.body.name)) {
        res.status(400).send('user already exists')
    } else {
        let newUser = makeUser(req.body.name)
        users.push(newUser)
        res.json(newUser)
    }
})

app.get('/v1/users', (req, res) => {
    return res.json(users)
})

app.post('/v1/user/:name/follow/:toFollow', (req, res) => {
    let userName = req.params.name
    let toFollow = req.params.toFollow
    if (!userExists(userName) || !userExists(toFollow)) {
        res.status(404).send('User not found')
    } else {
        let user = userByName(userName)
        user.follow.push(toFollow)
        res.json(user)
    }
})

app.get('/v1/user/:name/feed', (req, res) => {
    if (!userExists(req.params.name)) {
        res.status(404).send('User not found')
    } else {
        let user = userByName(req.params.name)
        let filtered = tweets.filter(x => user.follow.some(y => y == x.author))
        res.json(filtered)
    }
})

// Starting the service
app.listen(port, () => {
    console.log(`Fake twitter app listening at http://localhost:${port}`)
})

