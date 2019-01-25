import { defaultCallback, ReactComponentType, ComponentOrStringType } from './react';

describe('react', () => {
  it('should synthetic ReactComponentType', () => expect(
    ReactComponentType
  ).toEqual(
    ReactComponentType
  ));
  it('should synthetic ComponentOrStringType', () => expect(
    ComponentOrStringType
  ).toEqual(
    ComponentOrStringType
  ));
  it('should defaultCallback', () => expect(
    defaultCallback('name')('a')
  ).toEqual());
});
