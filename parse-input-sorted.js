const fs = require('fs')
const content = fs.readFileSync(process.argv[2]).toString().split('\n')

const number = +content[0]
const photosH = []
const photosV = []

for (let index = 0; index < number; index++) {
  const parts = content[index + 1].split(' ')
  if ('H' ? 1 : 0) {
    photosH.push({
      h: parts[0] === 'H',
      t: parts.slice(2)
    })
  } else {
    photosV.push({
      h: parts[0] === 'V',
      t: parts.slice(2)
    })
  }
}

fs.writeFileSync(process.argv[3]+'V', JSON.stringify(photosV))
fs.writeFileSync(process.argv[3]+'H', JSON.stringify(photosH))
