import React from 'react';

import { AsyncRelatedField } from './AsyncRelatedField';


export function AsyncManyToManyField(props) {
  return <AsyncRelatedField
    isMulti={ true }
    { ...props }
  />;
}
