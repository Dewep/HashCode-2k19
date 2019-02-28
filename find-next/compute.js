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

function nbTagsInCommon (tagsArray, tagsArray2) {
  let nb = 0
  for (const tag of tagsArray) {
    if (tagsArray2.includes(tag)) {
      nb += 1
    }
  }
  return nb
}

module.exports = async function (config, toCompute) {
  const baseDef = require('./b.json')
  const def = baseDef.map((p, i) => {
    return { ...p, i }
  })

  let randPosition = Math.floor(Math.random() * def.length) // random index sur le nb de photos restantes
  const sol = [
    [randPosition]
  ]
  def.splice(randPosition, 1)

  while (def.length > 0) {
    const lastTags = baseDef[sol[sol.length - 1]].t

    let nbTagsInCommonMinimum = 3
    let index = null
    while (index === null || index === -1) {
      // common = def.filter(p => nbTagsInCommon(lastTags, p.t) >= nbTagsInCommonMinimum)
      index = def.findIndex(p => nbTagsInCommon(lastTags, p.t) >= nbTagsInCommonMinimum)
      nbTagsInCommonMinimum -= 1
    }

    // randPosition = Math.floor(Math.random() * common.length)
    sol.push([def[index].i])
    def.splice(index, 1)

    console.log('remaining', def.length)
  }

  // console.log(sol)
  return { sol, score: computeScore(baseDef, sol) }
}
