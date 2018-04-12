import deepFreeze from 'deep-freeze'
import expect from 'expect'


const addCounter = (list) => {
  const res = list.slice()
  res.push(0)
  return res
}

const removeCounter = (list, index) => {
  const res = list.slice(0, index)
    .concat(list.slice(index + 1))

  return res
}

const testAddCounter = () => {
  const listBefore = []
  const listAfter = [0]

  deepFreeze(listBefore)

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
}

const testRemoveCounter = () => {
  const listBefore = [0]
  const listAfter = []

  deepFreeze(listBefore)

  expect(
    removeCounter(listBefore, 0)
  ).toEqual(listAfter);
}

const incrementCounter = (list, index) => {
  return list.slice(0, index)
    .concat([list[index] + 1])
    .concat(list.slice(index + 1))
}

const testIncrementCounter = () => {
  const listBefore = [0, 0]
  const listAfter = [1, 0]

  deepFreeze(listBefore)

  expect(
    incrementCounter(listBefore, 0)
  ).toEqual(listAfter);
}

testAddCounter()
testRemoveCounter()
testIncrementCounter()