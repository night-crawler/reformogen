import React from 'react';

import { AsyncRelatedField } from './AsyncRelatedField';


export function AsyncForeignKeyField(props) {
  return <AsyncRelatedField
    isMulti={ false }
    { ...props }
  />;
}
