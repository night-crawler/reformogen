import {
    makeFormId,
    makeSkipFetchingObject, makeFormFilesUploadProgress,
    makeIsLoading, makeIsFormDataPristine, makeIsFormDataDirty, makeShouldUploadFiles,
    makeTitle, makeDescription, makeFields,
    makePristineFormData, makeDirtyFormData, makeActualFormData, makeDirtyFileData,
    makeSubmitMethod, makeSubmitUrl,
    makeSubmitMiddlewares,
    makeFieldErrorsMap, makeNonFieldErrorsMap,
} from './selectorFactories';


describe('makeFormId', () => {
    it('should return default', () => {
        const result = makeFormId()({}, {});
        expect(result).toEqual('default');
    });
    it('should return props value', () => {
        const result = makeFormId()({}, { formId: 'form-id' });
        expect(result).toEqual('form-id');
    });
});

describe('makeSkipFetchingObject', () => {
    it('should return false', () => {
        const result = makeSkipFetchingObject()({}, {});
        expect(result).toBeFalsy();
    });
    it('should return true', () => {
        const result = makeSkipFetchingObject()({}, { skipFetchingObject: true });
        expect(result).toBeTruthy();
    });
});

describe('makeFormFilesUploadProgress', () => {
    const state = {
        formogen: {
            default: {
                formFilesUploadProgress: 'formFilesUploadProgress'
            }
        }
    };

    it('rubs the lotion on its skin', () => {
        const result = makeFormFilesUploadProgress()(state, {});
        expect(result).toEqual('formFilesUploadProgress');
    });
});

describe('makeIsLoading', () => {
    const props = {
        objectUpdateUrl: 'objectUpdateUrl'
    };

    it('should return false, coz form is loaded', () => {
        const state = {
            formogen: {
                default: {
                    isFormDataReady: true,
                    isMetaDataReady: true,
                }
            }
        };
        const result = makeIsLoading()(state, props);
        expect(result).toBeFalsy();
    });
    it('should return true, coz form is not loaded', () => {
        const state = {
            formogen: {
                default: {
                    isFormDataReady: true,
                    isMetaDataReady: false,
                }
            }
        };
        const result = makeIsLoading()(state, props);
        expect(result).toBeTruthy();
    });
});

describe('makeIsFormDataPristine', () => {
    it('should return false', () => {
        const state = {
            formogen: {
                default: {
                    dirtyFormData: {
                        some: 'some'
                    }
                }
            }
        };
        const result = makeIsFormDataPristine()(state, {});
        expect(result).toBeFalsy();
    });
    it('should return true', () => {
        const state = {
            formogen: {
                default: {
                    dirtyFormData: {}
                }
            }
        };
        const result = makeIsFormDataPristine()(state, {});
        expect(result).toBeTruthy();
    });
});

describe('makeIsFormDataDirty', () => {
    it('should return true', () => {
        const state = {
            formogen: {
                default: {
                    dirtyFormData: {
                        some: 'some'
                    }
                }
            }
        };
        const result = makeIsFormDataDirty()(state, {});
        expect(result).toBeTruthy();
    });
    it('should return false', () => {
        const state = {
            formogen: {
                default: {
                    dirtyFormData: {}
                }
            }
        };
        const result = makeIsFormDataDirty()(state, {});
        expect(result).toBeFalsy();
    });
});

describe('makeShouldUploadFiles', () => {});

describe('metaData', () => {
    const state = {
        formogen: {
            default: {
                receivedMetaData: {
                    title: 'received title',
                    description: 'received description',
                    fields: [
                        { name: 'received 0' },
                        { name: 'received 1' },
                        { name: 'common' },
                    ]
                }
            }
        }
    };
    const props = {
        initialMetaData: {
            title: 'initial title',
            description: 'initial description',
            fields: [
                { name: 'initial 0' },
                { name: 'initial 1' },
                { name: 'common' },
            ]
        }
    };

    describe('makeTitle', () => {
        it('should return initial title from props', () => {
            const result = makeTitle()(state, props);
            expect(result).toEqual('initial title');
        });

        it('should return received title from state', () => {
            const result = makeTitle()(state, {});
            expect(result).toEqual('received title');
        });
    });
    describe('makeDescription', () => {
        it('should return initial description from props', () => {
            const result = makeDescription()(state, props);
            expect(result).toEqual('initial description');
        });
        it('should return received description from state', () => {
            const result = makeDescription()(state, {});
            expect(result).toEqual('received description');
        });
    });
    describe('makeFields', () => {
        it('should return initial and received fields', () => {
            const result = makeFields()(state, props);
            expect(result).toEqual([
                { name: 'initial 0' },
                { name: 'initial 1' },
                { name: 'common' },
                { name: 'received 0' },
                { name: 'received 1' },
            ]);
        });
        it('should return received received fields', () => {
            const result = makeFields()(state, {});
            expect(result).toEqual([
                { name: 'received 0' },
                { name: 'received 1' },
                { name: 'common' },
            ]);
        });
    });
});

describe('makePristineFormData', () => {
    const state = {
        formogen: {
            default: {
                receivedMetaData: {
                    title: 'received title',
                    description: 'received description',
                    fields: [
                        { name: 'name_0', type: 'TextField', default: 'default' },
                        { name: 'name_1', type: 'ManyToManyField' },
                        { name: 'name_2', type: 'CharField' },
                    ]
                }
            }
        }
    };

    it('puts the lotion in the basket', () => {
        const result = makePristineFormData()(state, {});
        expect(result).toEqual({
            name_0: 'default',
            name_1: [],
            name_2: ''
        });
    });
});

describe('makeDirtyFormData', () => {  // todo
    const state = {
        formogen: {
            default: {
                receivedMetaData: {
                    title: 'received title',
                    description: 'received description',
                    fields: [
                        { name: 'name_0', type: 'TextField', default: 'default' },
                        { name: 'name_1', type: 'ManyToManyField' },
                        { name: 'name_2', type: 'CharField' },
                    ]
                },
                dirtyFormData: {
                    name_0: 'dirty value'
                }
            }
        }
    };

    it('rubs the lotion on its skin', () => {
        const result = makeDirtyFormData()(state, {});
        expect(result).toEqual({
            name_0: 'dirty value',
            name_1: [],
            name_2: ''
        });
    });
});

describe('makeActualFormData', () => {});

describe('makeDirtyFileData', () => {});

describe('makeSubmitMethod', () => {
    it('should return PATCH', () => {
        const state = {
            formogen: {
                default: {
                    receivedFormData: {
                        id: 4815162342,
                    },
                }
            }
        };
        const result = makeSubmitMethod()(state, {});
        expect(result).toEqual('PATCH');
    });
    it('should return POST', () => {
        const result = makeSubmitMethod()({ formogen: { default: {} } }, {});
        expect(result).toEqual('POST');
    });
});

describe('makeSubmitUrl', () => {
    const state = { formogen: { default: {} } };
    it('should return create url', () => {
        const result = makeSubmitUrl()(state, { objectCreateUrl: 'http://create-url.com' });
        expect(result).toEqual('http://create-url.com');
    });
    it('should return update url', () => {
        const props = {
            objectCreateUrl: 'http://create-url.com',
            objectUpdateUrl: 'http://update-url.com',
        };
        const result = makeSubmitUrl()(state, props);
        expect(result).toEqual('http://update-url.com');
    });
});

describe('makeSubmitMiddlewares', () => {});

describe('errors', () => {
    const emptyState = { formogen: { default: {} } };
    const state = {
        formogen: {
            default: {
                receivedMetaData: {
                    fields: [
                        { name: 'name_0', type: 'TextField' },
                        { name: 'name_1', type: 'CharField' },
                    ]
                },
                errors: {
                    name_0: 'error of name_0',
                    some: 'some error',
                }
            }
        }
    };

    describe('makeFieldErrorsMap', () => {
        it('should return none', () => {
            const result = makeFieldErrorsMap()(emptyState, {});
            expect(result).toBeUndefined();
        });
        it('should return only field errors', () => {
            const result = makeFieldErrorsMap()(state, {});
            expect(result).toEqual({ name_0: 'error of name_0' });
        });
    });
    describe('makeNonFieldErrorsMap', () => {
        it('should return none', () => {
            const result = makeNonFieldErrorsMap()(emptyState, {});
            expect(result).toBeUndefined();
        });
        it('should return only non-field errors', () => {
            const result = makeNonFieldErrorsMap()(state, {});
            expect(result).toEqual({ some: 'some error' });
        });
    });
});
