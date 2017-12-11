import {
    // METADATA
    totalMetaData, metaDataFields, metaDataFieldMap, formFieldNames,

    // FORMDATA
    totalFormData,
    pristineFormData,

    // SUBMIT
    hasId,
    submitMethod,
    submitUrl,

    // PRISTINE && CHANGE DIFF
    changedFormDataFieldNames,
    changedFormData,

    changedFormFileFieldNames,
    changedFormFile,



    totalFieldsMap,
    changedFieldsMap,

} from 'formogen-react-redux/selectors';

const state = {
    formogen: {
        receivedMetaData: {
            title: 'received title',
            description: 'received description',
            fields: [
                { name: 'name_01' },
                { name: 'name_02' },
            ]
        },

        receivedFormData: {
            'name_01': 'received_name_01',
            'name_02': 'received_name_02',
            'name_03': [{id: 3}, {id: 4}]
        },

        pristineFormData: {
            'name_00': 'assigned_name_00',
        }
    }
};
const props = {
    initialMetaData: {
        title: 'assigned title',
        description: 'assigned description',
        fields: [
            { name: 'name_00' },
            { name: 'name_01' },
        ]
    },

    initialFormData: {
        'name_00': 'assigned_name_00',
        'name_01': 'assigned_name_01',

        'dipshit_dumbass': 'skip',
    },

    objectCreateUrl: 'http://example.com'
};


// METADATA
test('totalMetaData() selector', () => {
    const res = totalMetaData(state, props);
    expect(res).toEqual({
        title: 'assigned title',
        description: 'assigned description',
        fields: [
            { name: 'name_00' },
            { name: 'name_01' },
            { name: 'name_02' },
        ]
    });
});
test('totalMetaDataFields() selector', () => {
    const res = metaDataFields(state, props);
    expect(res).toEqual([
        { name: 'name_00' },
        { name: 'name_01' },
        { name: 'name_02' },
    ]);
});
test('metaDataFieldMap() selector', () => {
    const res = metaDataFieldMap(state, props);
    expect(res).toEqual({
        name_00: { name: 'name_00' },
        name_01: { name: 'name_01' },
        name_02: { name: 'name_02' }
    });
});
test('formFieldNames() selector', () => {
    const res = formFieldNames(state, props);
    expect(res).toEqual([ 'name_00', 'name_01', 'name_02' ]);
});


// FORMDATA
test('totalFormData() selector', () => {
    const res = totalFormData(state, props);
    expect(res).toEqual({
        'name_00': 'assigned_name_00',
        'name_01': 'received_name_01',
        'name_02': 'received_name_02',
    });
});
test('pristineFormData() selector', () => {
    const res = pristineFormData(state, props);
    expect(res).toEqual({
        'name_00': 'assigned_name_00',
    });
});


// SUBMIT
test('hasId() selector', () => {
    const res = hasId(state, props);
    expect(res).toBeFalsy();
});
test('submitMethod() selector', () => {
    const res = submitMethod(state, props);
    expect(res).toEqual('POST');
});
test('submitUrl() selector', () => {
    const res = submitUrl(state, props);
    expect(res).toEqual('http://example.com');
});


// FORM DATA -- PRISTINE && CHANGE DIFF
test('changedFormDataFieldNames() selector', () => {
    const res = changedFormDataFieldNames(state, props);
    expect(res).toEqual([ 'name_01', 'name_02' ]);
});
test('changedFormData() selector', () => {
    const res = changedFormData(state, props);
    expect(res).toEqual({
        'name_01': 'received_name_01',
        'name_02': 'received_name_02',
    });
});





test('totalFieldsMap() selector', () => {
    const res = totalFieldsMap(state, props);

    expect(res).toEqual({
        'name_00': 'assigned_name_00',
        'name_01': 'received_name_01',
        'name_02': 'received_name_02',
    });
});

test('changedFieldsMap() selector', () => {
    const res = changedFieldsMap(state, props);

    expect(res).toEqual({
        'name_00': 'assigned_name_00',
        'name_01': 'received_name_01',
        'name_02': 'received_name_02',
    });
});
