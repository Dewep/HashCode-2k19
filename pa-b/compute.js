function computeScore (def, sol) {
  // def : b.json
  // sol : [[0],[1,2],[3]]
  let points = 0

  let previousTags = null
  for (let curr of sol) {
    let currentTags = curr.length === 1 ? def[curr[0]].t : [...def[curr[0]].t, ...def[curr[1]].t] //convert photo tags to slide tags
    currentTags = currentTags.filter((i, p) => {
      return currentTags.indexOf(i) === p
    }) // filter duplicates

    if (previousTags) {
      const common = currentTags.reduce((acc, curr) =>  acc + +previousTags.includes(curr), 0) // tags in common score
      const oneNotTwo = previousTags.reduce((acc, curr) => acc + +!currentTags.includes(curr), 0) // tags in 1 but not 2
      const twoNotOne = currentTags.reduce((acc, curr) => acc + +!previousTags.includes(curr), 0) // tags in 2 but not 1
  
      points += Math.min(common, oneNotTwo, twoNotOne)
    }

    previousTags = currentTags
  }
  return points
}

function matchOneTag(def, previous, curr) {
  let currentTags = [...def[previous].t, ...def[curr].t] //convert photo tags to slide tags
  currentTags = currentTags.filter((i, p) => {
    return currentTags.indexOf(i) === p
  }) // filter duplicates

  previousTags = [...def[previous].t]

  const common = currentTags.reduce((acc, curr) =>  acc + +previousTags.includes(curr), 0) // tags in common score

  return common > 1
}

function randomSolution (defBase) {
  const def = [...defBase]
  const sol = []
  let trys = 0
  let index = 0
  let prevIndex = 0
  // let remaning = def.length

  while (def.length > 0) {
    prevIndex = index
    index = index / def.length > 1 ? index % def.length : index
    while (!matchOneTag(defBase, prevIndex, (index + trys) / def.length > 1 ? (index + trys) % def.length : index + trys) && trys < def.length) {
      index += 1
      trys += 1
    }
    trys = 0

    photos = def.splice(index, 1) // on récupère la photo à cet index (en ignorant les index déjà utilisés)

    if (!photos[0].h) { // si c'est vertical, faut récupérer une autre verticale
      const photo = def.find(p => !p.h)
      photos.push(photo)
      def.splice(photo.index, 1)
    }

    // remaning -= photos.length // on retire le nombre de photos restantes
    sol.push(photos.map(photo => photo.index)) // on le slide à la suite de notre slideshow
  }

  return sol
}

module.exports = async function (config, toCompute) {
  const def = require('./b.json')

  let sol = null
  let score = null

  for (let essai = 0; essai < 10; essai++) {
    for (let index = 0; index < def.length; index++) { // On reset nos used
      def[index].index = index
      def[index].used = false
    }

    // console.log('randomSolution...')
    const currentSol = randomSolution(def)
    // console.log('score...')
    const currentScore = computeScore(def, currentSol)

    if (!score || score < currentScore) {
      sol = currentSol
      score = currentScore
    }
    // console.log('score', score)
  }

  return { sol, score }
}
