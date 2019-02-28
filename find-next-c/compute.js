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

function nbTagsInCommon (tagsArray, tagsArray2) {
  let nb = 0
  for (const tag of tagsArray) {
    if (tagsArray2.includes(tag)) {
      nb += 1
    }
  }
  return Math.min(nb, tagsArray.length - nb, tagsArray2.length - nb)
}

module.exports = async function (config, toCompute) {
  const baseDef = require('./c.json')
  const def = groupShit(baseDef.map((item, index) => {
    return {
      ...item,
      index: [index]
    }
  }))

  let randPosition = Math.floor(Math.random() * def.length) // random index sur le nb de photos restantes
  let sol = [
    def[randPosition]
  ]
  def.splice(randPosition, 1)

  while (def.length > 0) {
    const firstTags = sol[0].t
    const lastTags = sol[sol.length - 1].t

    let nbTagsInCommonMinimum = 10
    let common = []
    let index = null
    let first = false
    while (!common.length) {
      if (Math.random() > 0.8) {
        index = Math.floor(Math.random() * def.length)
        common = [1]
      } else {
        common = def.map((p, index) => ({ ...p, tmpIndex: index })).filter(p => nbTagsInCommon(lastTags, p.t) >= nbTagsInCommonMinimum)
        if (common.length) {
          index = Math.floor(Math.random() * common.length) // random index sur le nb de photos restantes
          index = common[index].tmpIndex
          // index = def.findIndex(p => nbTagsInCommon(lastTags, p.t) >= nbTagsInCommonMinimum)
        } else {
          common = def.map((p, index) => ({ ...p, tmpIndex: index })).filter(p => nbTagsInCommon(firstTags, p.t) >= nbTagsInCommonMinimum)
          if (common.length) {
            index = Math.floor(Math.random() * common.length) // random index sur le nb de photos restantes
            index = common[index].tmpIndex
            first = true
            // index = def.findIndex(p => nbTagsInCommon(lastTags, p.t) >= nbTagsInCommonMinimum)
          }
        }
      }
      nbTagsInCommonMinimum -= 1
    }

    // randPosition = Math.floor(Math.random() * common.length)
    if (first) {
      sol.unshift(def[index])
    } else {
      sol.push(def[index])
    }
    def.splice(index, 1)

    console.log('remaining', def.length)
  }

  sol = sol.map(d => d.index)

  // console.log(sol)
  return { sol, score: computeScore(baseDef, sol) }
}
