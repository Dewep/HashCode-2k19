function score (def, sol) {
  // def : b.json
  // sol : [[0],[1,2],[3]]
  let points = 0

  for (let curr )  
  return points
}

function randomSolution (defBase) {
  const def = [...defBase]
  const sol = []
  // let remaning = def.length

  while (def.length > 0) {
    let randPosition = Math.floor(Math.random() * def.length) // random index sur le nb de photos restantes

    photos = def.splice(randPosition, 1) // on récupère la photo à cet index (en ignorant les index déjà utilisés)

    // remaning -= photos.length // on retire le nombre de photos restantes
    sol.push(photos[0].index) // on le slide à la suite de notre slideshow
  }

  return sol
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
   *    index: [1, 45]
   *  },
   *  {
   *    t: ['a', 'b'],
   *    index: [2]
   *  }
   * ]
   */

  return def
}

module.exports = async function (config, toCompute) {
  const def = require('./c.json')

  let sol = null
  let score = null

  const defIndexed = def.map((item, index) => {
    return {
      ...item,
      index: [index]
    }
  })
  for (let essai = 0; essai < 10; essai++) {

    // console.log('randomSolution...')
    const currentSol = randomSolution(groupShit(defIndexed))
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
