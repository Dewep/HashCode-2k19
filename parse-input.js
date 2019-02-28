const fs = require('fs')
const content = fs.readFileSync(process.argv[2]).toString().split('\n')

const number = +content[0]
const photos = []

for (let index = 0; index < number; index++) {
  const parts = content[index + 1].split(' ')
  photos.push({
    h: parts[0] === 'H' ? 1 : 0,
    t: parts.slice(2)
  })
}

fs.writeFileSync(process.argv[3], JSON.stringify(photos))
