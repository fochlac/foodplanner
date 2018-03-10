export const filterDuplicatesById = (array) => {
  let idList = []

  return array.filter(item => {
    if (idList.includes(item.id)) {
      return false
    }
    idList.push(item.id)
    return true
  })
}
