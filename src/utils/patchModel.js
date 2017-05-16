const updateDocument = function (doc, Schema, data) {
  for (const field in Schema.paths) {
    if ((field !== '_id') && (field !== '__v')) {
      const newValue = getObjValue(field, data)
      if (newValue !== undefined) {
        setObjValue(field, doc, newValue)
      }
    }
  }
  return doc
}

function getObjValue (field, data) {
  return field.split('.').reduce((obj, f) => {
    if (obj) return obj[f]
  }, data)
}

function setObjValue (field, data, value) {
  const fieldArr = field.split('.')
  return fieldArr.reduce((o, f, i) => {
    if (i === fieldArr.length - 1) {
      o[f] = value
    } else {
      if (!o[f]) o[f] = {}
    }
    return o[f]
  }, data)
}

export default updateDocument
