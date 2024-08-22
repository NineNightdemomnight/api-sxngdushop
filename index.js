const express = require('express')
const app = express()
const PORT = 4000

app.listen(PORT, () => {
    console.log(`API on  ${PORT}`)
})

app.get('/',  (req, res) => {
    res.send('api sxngdu runnong...')
})

app.get('/about', (req, res) => {
    res.send('api sxngdu about')
})

module.exports =  app