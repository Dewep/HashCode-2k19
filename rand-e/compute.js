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


function groupShit (defIndexed) {
  let def = defIndexed.filter(i => i.h)
  const verticals = defIndexed.filter(i => !i.h)
  while (verticals.length) {
    const one = verticals.splice(0, 1)[0]
    const two = verticals.splice(Math.floor(Math.random() * verticals.length), 1)[0]

    let t = [...one.t, ...two.t]
    t = t.filter((i, p) => {
      return t.indexOf(i) === p
    })
    def.push({
      t,
      index: [one.index[0], two.index[0]]
    })
  }
  // def now contains grouped vertical picture slides && horizontal slides
  /**
   * [
   *  {
   *    t: ['a', 'b'],
   *    index: [2]
   *  },
   *  {
   *    t: ['a', 'b'],
   *    index: [1, 45]
   *  }
   * ]
   */

  return def
}


function randomSolution (defBase) {
  const def = [...defBase]
  const sol = []
  // let remaning = def.length

  while (def.length > 0) {
    let randPosition = Math.floor(Math.random() * def.length) // random index sur le nb de photos restantes

    photos = def.splice(randPosition, 1) // on récupère la photo à cet index (en ignorant les index déjà utilisés)

    // if (!photos[0].h) { // si c'est vertical, faut récupérer une autre verticale
    //   const photo = def.find(p => !p.h)
    //   photos.push(photo)
    //   def.splice(photo.index, 1)
    // }

    // remaning -= photos.length // on retire le nombre de photos restantes
    sol.push(photos[0].index) // on le slide à la suite de notre slideshow
  }

  return sol
}

module.exports = async function (config, toCompute) {
  const def = require('./e.json') // C LE C KON LANCE DIWEP
  const aggregatedDef = groupShit(def.map((item, index) => {
    return {
      ...item,
      index: [index]
    }
  }))

  let sol = null
  let score = null

  for (let essai = 0; essai < 10; essai++) {
    // for (let index = 0; index < def.length; index++) { // On reset nos used
    //   def[index].index = index
    //   def[index].used = false
    // }

    // console.log('randomSolution...')
    const currentSol = randomSolution(aggregatedDef)
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
