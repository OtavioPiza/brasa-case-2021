const http = require('http')
const fs = require('fs')

const data = JSON.parse(fs.readFileSync('test/mock_data.json'))

const app =  http.createServer((request, response) =>
{
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(data))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)