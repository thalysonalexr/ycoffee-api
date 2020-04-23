import faker from 'faker'

import {
  TypeCoffe,
  Description,
  Ingredients,
  Preparation,
  TimePrepare,
  Portions,
  Image
} from '@domain/values/Coffee'

describe('Unit test to value objects Coffee', () => {
  it('should be able create new valid type coffe', () => {
    const sentence = faker.name.title()
    const coffee = TypeCoffe.toType(sentence)
    expect(coffee.toString()).toBe(sentence)
  })

  it('should be not able create valid type coffe', () => {
    try {
      expect(TypeCoffe.toType('')).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create new description', () => {
    const sentence = faker.lorem.words(5)
    const description = Description.toDescription(sentence)
    expect(description.toString()).toBe(sentence)
  })

  it('should be not able create description with less sentence', () => {
    const sentence = faker.random.alphaNumeric(5)
    try {
      expect(Description.toDescription(sentence)).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create new ingredient', () => {
    const ingredients = Ingredients.toIngredients()

    const ing1 = faker.name.title()
    const ing2 = faker.name.title()
    
    ingredients.add(ing1).add(ing2)

    expect(ingredients.toArray()).toStrictEqual([ing1, ing2])
  })

  it('should be not able create ingredient with bigger sentence', () => {
    const ingredients = Ingredients.toIngredients()

    try {
      expect(ingredients.add(faker.lorem.paragraph())).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create preparation', () => {
    const preparation = faker.lorem.paragraphs()
    expect(
      Preparation.toPreparation(preparation).toString()
    ).toStrictEqual(preparation)
  })

  it('should be not able create preparation with less sentence', () => {
    const sentence = faker.random.alphaNumeric(5)
    try {
      expect(Preparation.toPreparation(sentence)).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create time prepare', () => {
    const time = faker.random.number(10)
    expect(TimePrepare.toTimePrepare(time).toNumber()).toBe(time)
  })

  it('should be not able create time prepare with negative value', () => {
    try {
      expect(TimePrepare.toTimePrepare(-1)).toThrow(Error)
    } catch (err) {}
  })

  it('should be able get time prepare formatted with equals or less 9', () => {
    const time = 5
    const prepare = TimePrepare.toTimePrepare(time)

    expect(prepare.toFormatted()).toBe('05 Minute(s)')
  })

  it('should be able get time prepare formatted with more 9', () => {
    const time = 10
    const prepare = TimePrepare.toTimePrepare(time)

    expect(prepare.toFormatted()).toBe('10 Minute(s)')
  })

  it('should be able create portions', () => {
    const portions = faker.random.number(10)
    expect(Portions.toPortions(portions).toNumber()).toBe(portions)
  })

  it('should be not able create portions with negative value', () => {
    try {
      expect(Portions.toPortions(-1)).toThrow(Error)
    } catch (err) {}
  })

  it('should be able create new picture', () => {
    const image = {
      name: faker.random.alphaNumeric(16),
      key: faker.random.alphaNumeric(16),
      size: faker.random.number(5000)
    }

    expect(Image.toImage(image).toObject()).toStrictEqual(
      expect.objectContaining({
        name: image.name,
        key: image.key,
        size: image.size
      })
    )
  })
})
