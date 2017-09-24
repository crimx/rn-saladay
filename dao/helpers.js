/**
 * JSON.stringfy object properties and coerce boolean properties to number
 * @param {object|object[]} data - data object or an array of data objects
 * @param {string[]} keys
 * @return object[]
 */
export function pickle (data, keys) {
  const isArray = Array.isArray(data)
  const arr = isArray ? data : [data]
  const result = arr.map(data =>
    keys.reduce((newData, k) => {
      if (/^(string|number)$/.test(typeof data[k])) {
        newData[k] = data[k]
      } else if (typeof data[k] === 'boolean') {
        newData[k] = Number(data[k])
      } else if (data[k] == null) {
        newData[k] = null
      } else if (typeof data[k] === 'object') {
        newData[k] = JSON.stringify(data[k])
      } else {
        newData[k] = String(data[k])
      }
      return newData
    }, {})
  )
  return isArray ? result : result[0]
}

export default {
  pickle
}
