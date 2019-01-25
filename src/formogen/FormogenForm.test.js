import { FormogenForm } from './FormogenForm';

import * as sui from '~/formogen/semantic-ui';

export const fullPossibleMetadata = {
  'title': 'Create AllModelFields',
  'description': '',
  'fields': [
    {
      'name': 'f_date',
      'verbose_name': 'date',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'DateField',
      'required': true,
      'default': '2018-11-06'
    },
    {
      'name': 'f_time',
      'verbose_name': 'time',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'TimeField',
      'required': true,
      'default': '08:30:35.793611'
    },
    {
      'name': 'f_dt',
      'verbose_name': 'date and time',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'DateTimeField',
      'required': true,
      'default': '2018-11-06T08:30:35.793628Z'
    },
    {
      'name': 'f_integer',
      'verbose_name': 'integer',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'IntegerField',
      'required': true,
      'default': -22
    },
    {
      'name': 'f_positive_integer',
      'verbose_name': 'positive integer',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'PositiveIntegerField',
      'required': true,
      'default': 0
    },
    {
      'name': 'f_small_integer',
      'verbose_name': 'small integer',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'SmallIntegerField',
      'required': true,
      'default': 13
    },
    {
      'name': 'f_positive_small_integer',
      'verbose_name': 'positive small integer',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'PositiveSmallIntegerField',
      'required': true,
      'default': 222
    },
    {
      'name': 'f_decimal',
      'verbose_name': 'decimal',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'decimal_places': 4,
      'max_digits': 10,
      'type': 'DecimalField',
      'required': true,
      'default': 3.1415
    },
    {
      'name': 'f_float',
      'verbose_name': 'float',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'FloatField',
      'required': true,
      'default': 3.14
    },
    {
      'name': 'f_fk_embed',
      'verbose_name': 'embedded foreign key',
      'help_text': '',
      'blank': true,
      'null': true,
      'editable': true,
      'type': 'ForeignKey',
      'required': false,
      'data': [
        {
          'id': 1,
          'name': 'Author Вася'
        },
        {
          'id': 2,
          'name': 'Author asd Вася'
        }
      ]
    },
    {
      'name': 'f_fk_rel',
      'verbose_name': 'foreign key with relation',
      'help_text': '',
      'blank': true,
      'null': true,
      'editable': true,
      'type': 'ForeignKey',
      'required': false,
      'data': 'http://localhost:8000/api/v1/sample/books/'
    },
    {
      'name': 'f_choice',
      'verbose_name': 'choice',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'type': 'PositiveSmallIntegerField',
      'required': true,
      'default': 255,
      'choices': [
        [
          0,
          'dead'
        ],
        [
          255,
          'alive'
        ],
        [
          30,
          'dried'
        ]
      ]
    },
    {
      'name': 'f_file',
      'verbose_name': 'short preview sample',
      'help_text': '',
      'blank': false,
      'null': false,
      'editable': true,
      'max_length': 100,
      'type': 'FileField',
      'required': true,
      'upload_url': 'http://localhost:8000/api/v1/sample/all/accept_file/'
    },
    {
      'name': 'f_photo',
      'verbose_name': 'photo',
      'help_text': 'logo image',
      'blank': true,
      'null': true,
      'editable': true,
      'max_length': 100,
      'type': 'FileField',
      'required': false,
      'upload_url': 'http://localhost:8000/api/v1/sample/all/accept_file/'
    },
    {
      'name': 'f_char_field',
      'verbose_name': 'char field',
      'help_text': 'charfield',
      'blank': false,
      'null': false,
      'editable': true,
      'max_length': 255,
      'type': 'CharField',
      'required': true
    },
    {
      'name': 'f_text_field',
      'verbose_name': 'text field',
      'help_text': '',
      'blank': true,
      'null': false,
      'editable': true,
      'type': 'TextField',
      'required': false
    },
    {
      'name': 'f_m2m_embed',
      'verbose_name': 'embedded M2M',
      'help_text': '',
      'blank': true,
      'null': false,
      'editable': true,
      'type': 'ManyToManyField',
      'required': false,
      'data': [
        {
          'id': 1,
          'name': 'Author Вася'
        },
        {
          'id': 2,
          'name': 'Author asd Вася'
        }
      ]
    },
    {
      'name': 'f_m2m_rel',
      'verbose_name': 'related M2M',
      'help_text': '',
      'blank': true,
      'null': false,
      'editable': true,
      'type': 'ManyToManyField',
      'required': false,
      'data': 'http://localhost:8000/api/v1/sample/authors/'
    }
  ]
};

it('<FormogenForm />', () => {
  const wrapper = shallow(
    <FormogenForm
      formId='bla'
      metaData={ fullPossibleMetadata }  
      getFieldComponent={ sui.getFieldComponentForType }
      getFormComponent={ () => sui.FormComponent }

      actions={ {
        bootstrap: () => {}
      } }
    />
  );
  expect(wrapper).toMatchSnapshot();
});
