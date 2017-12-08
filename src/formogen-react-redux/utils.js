import _ from 'lodash';
import { extractIdentity } from '../formogen/utils';


export function concatFields(fieldSet = [], anotherFieldSet = []) {
    const fields = [
        ...fieldSet,
        ...anotherFieldSet,
    ];
    return _.differenceBy(fields, 'name');
}

export function mergeMetaData(assigned, received) {
    const initialFields = _.get(assigned, 'fields', []);
    const receivedFields = _.get(received, 'fields', []);

    return {
        title: _.get(assigned, 'title', null) || received.title,
        description: _.get(assigned, 'description', null) || received.description,
        fields: concatFields(initialFields, receivedFields)
    };
}


/**
 * Each field contains a default value.
 * @param {Array} fields
 * @param {Object} formData
 * @returns {Object}
 */
export function updateFormDataWithDefaults(fields, formData) {
    let data = { ...formData };
    for (let field of fields) {
        if (field.name in data) {
            continue;
        }
        // should be undefined for uncontrolled components, not null
        data[field.name] = field.default || '';

        // DRF expects M2M values as a list (empty or not), so empty string is not acceptable here
        if (!data[field.name] && field.type === 'ManyToManyField')
            data[field.name] = [];
    }
    return data;
}


export function getFieldData(state) {
    const { formData, initialFormData } = state;
    const { fields } = state.metaData;

    let files = {}, data = {}, changedFields = [];
    fields.map(({ type, name, upload_url = null }) => {
        const
            value = formData[name],
            ptr = (upload_url || type in ['FileField', 'ImageField']) ? files : data,
            initialValue = initialFormData[name];
        let isChanged = value !== initialValue;

        // go deeper with checks only when the basic comparision returned true
        // this check applies on arrays or object
        if (isChanged && _.isObject(initialValue)) {
            const _initialValueIdentity = extractIdentity(initialValue);
            const _valueIdentity = extractIdentity(value);

            if (_.isArray(_initialValueIdentity)) {
                isChanged = !_(_initialValueIdentity).difference(_valueIdentity).isEmpty();
            } else {
                isChanged = _initialValueIdentity !== _valueIdentity;
            }
        }

        isChanged && changedFields.push(name);
        ptr[name] = value;

        return null;  // shut warning
    });

    return { data, files, changedFields };
}
