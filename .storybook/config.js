import { withConsole } from '@storybook/addon-console';
import { withOptions } from '@storybook/addon-options';
import { addDecorator, configure } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import 'semantic-ui-css/semantic.min.css';

addDecorator(
  withInfo({
    header: false,
    inline: false,
    styles: {
      button: {
        base: {
          zIndex: 5000,
        }
      },
      children: {
        position: 'inherit',
        zIndex: 0,
      },
    }
  })
);

addDecorator(
  withOptions({
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: /\|/,
  })
);

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

addDecorator(withKnobs);

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
