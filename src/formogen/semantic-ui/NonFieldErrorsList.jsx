import React from 'react';
import PropTypes from 'prop-types';
import { toPairs } from 'lodash';
import { Grid } from 'semantic-ui-react';

import { ErrorsList } from './ErrorsList';


NonFieldErrorsList.displayName = 'NonFieldErrorsList';
NonFieldErrorsList.propTypes = {
  errors: PropTypes.object,
};
export function NonFieldErrorsList({ errors }) {
  return (
    <Grid className='non-field-errors layout' columns={ 16 }>
      { toPairs(errors).map(([ header, errors ], i) =>
        <Grid.Row key={ i }>
          <div className='sixteen wide column'>
            <ErrorsList header={ header } messages={ errors } />
          </div>
        </Grid.Row>
      ) }
    </Grid>
  );
}
