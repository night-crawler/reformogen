// fields import
import { AsyncForeignKeyField } from './fields/AsyncForeignKeyField';
import { AsyncManyToManyField } from './fields/AsyncManyToManyField';
import { ManyToManyField } from './fields/InlineManyToManyField';
import { ForeignKeyField } from './fields/InlineForeignKeyField';
import { AutocompleteChoiceField } from './fields/AutocompleteChoiceField';
import { GenericField } from './fields/GenericField';
import { IntegerField } from './fields/IntegerField';
import { BooleanField } from './fields/BooleanField';
import { CharField } from './fields/CharField';
import { TextField } from './fields/TextField';
import { DateTimeField } from './fields/DateTimeField';
import { DateField } from './fields/DateField';
import { TimeField } from './fields/TimeField';
import { DropzoneField } from './fields/DropzoneField';
import { FieldLabel } from './FieldLabel';
import { CaptionTruncator } from './CaptionTruncator';
import { Form } from './FormComponent';
import ModalForm from './ModalForm';
import { ErrorsList } from './ErrorsList';
import { NonFieldErrorsList } from './NonFieldErrorsList';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-times/css/material/default.css';

import './index.css';

export const fields = {
  AutocompleteChoiceField,

  ForeignKeyField,
  AsyncForeignKeyField,

  ManyToManyField,
  AsyncManyToManyField,

  IntegerField,
  BooleanField,
  CharField,
  TextField,

  DateTimeField,
  DateField,
  TimeField,

  DropzoneField,

  GenericField,
};

export const common = {
  FieldLabel,
  CaptionTruncator,

  Form,
  ModalForm,

  ErrorsList,
  NonFieldErrorsList,
};