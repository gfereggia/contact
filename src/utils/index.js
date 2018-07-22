import objectPath from 'object-path'

//Funcion para ordenar datos de la api pasando por parametro la propiedad correspondiente
export function dynamicSort(property) {
  let sortOrder = 1
  if (property[0] === '-') {
    sortOrder = -1
    property = property.substr(1)
  }
  return function(a, b) {
    let result =
      objectPath.get(a, property) < objectPath.get(b, property)
        ? -1
        : objectPath.get(a, property) > objectPath.get(b, property)
          ? 1
          : 0
    return result * sortOrder
  }
}

//Funcion para copiar los datos del obj y pasarlo a un array pasandole como dato el indice original
export function toObjectAssociative(array, key) {
  let object = {}
  if (!array) {
    return
  }
  array.map((v, k) => {
    if (objectPath.get(v, key)) {
      object[objectPath.get(v, key)] = { ...v, arrayKey: k }
    } else {
      console.log('no existe la key: ' + key + ' en el objeto: ' + v)
    }
    return v
  })
  return object
}

export function objectToArray(object) {
  let array = []
  for (let prop in object) {
    array.push(object[prop])
  }
  return array
}

export default {
  dynamicSort,
  toObjectAssociative,
  objectToArray
}
