import React from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Grid } from 'semantic-ui-react';

import ErrorsList from './ErrorsList';


NonFieldErrorsListComponent.displayName = 'NonFieldErrorsList';
NonFieldErrorsListComponent.propTypes = {
    errors: PropTypes.object,
};
function NonFieldErrorsListComponent({ errors }) {
    return (
        <Grid className='non-field-errors layout' columns={ 16 }>
            {
                _(errors).toPairs().value().map(([ header, errors ], i) =>
                    <Grid.Row key={ i }>
                        <div className='sixteen wide column'>
                            <ErrorsList header={ header } messages={ errors } />
                        </div>
                    </Grid.Row>
                )
            }
        </Grid>
    );
}

export default NonFieldErrorsListComponent;
