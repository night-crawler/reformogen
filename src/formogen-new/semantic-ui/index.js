import AsyncForeignKeyField from './fields/AsyncForeignKeyField';
import AsyncManyToManyField from './fields/AsyncManyToManyField';

import ManyToManyField from './fields/ManyToManyField';
import ForeignKeyField from './fields/ForeignKeyField';

import AutocompleteChoiceField from './fields/AutocompleteChoiceField';

import GenericField from './fields/GenericField';

import IntegerField from './fields/IntegerField';
import BooleanField from './fields/BooleanField';
import CharField from './fields/CharField';
import TextField from './fields/TextField';

import DateTimeField from './fields/DateTimeField';
import DateField from './fields/DateField';
import TimeField from './fields/TimeField';

import DropzoneField from './fields/DropzoneField';

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
