import { createElement } from 'lwc';
import CaseList from 'c/caseList';
import getOpenCases from '@salesforce/apex/CaseHelper.getOpenCases';
import updateCases from '@salesforce/apex/CaseHelper.updateCases';

const mockGetCases = require('./data/_wireCaseList.json');

jest.mock(
    '@salesforce/apex/CaseHelper.getOpenCases',
    () => {
        const {createApexTestWireAdapter} = require('@salesforce/sfdx-lwc-jest');
        return {default: createApexTestWireAdapter(jest.fn())};
    },
    { virtual: true}
)

jest.mock(
    '@salesforce/apex/CaseHelper.updateCases',
    () => {
        return {
            default: jest.fn(() => Promise.resolve())
        };
    },
    { virtual: true}
)

describe('c-case-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    async function flushPromises() {
        return Promise.resolve();
    }

    it('test list being populated', async () => {
        // Arrange
        const element = createElement('c-case-list', {
            is: CaseList
        });

        const EXPECTED_CASENUMBER = '00001029';
        const EXPECTED_SUBJECT = 'hhhhhhhh';
        const EXPECTED_ID = '500QL00000H1y5GYAR';

        document.body.appendChild(element);

        getOpenCases.emit(mockGetCases);
        await flushPromises();

        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        const el1 = datatable.data.data[0];

        expect(el1.CaseNumber).toBe(EXPECTED_CASENUMBER);
        expect(el1.Subject).toBe(EXPECTED_SUBJECT);
        expect(el1.Id).toBe(EXPECTED_ID);
    });

    //test update
    it('test list updates when edited', async () => {
        const INPUT_VALUE = [{Subject:"jest",Id:"500QL00000H1y5GYAR"}];

        const INPUT_PARAM = [{cases: INPUT_VALUE}];
        

        const element = createElement('c-case-list', {
            is: CaseList
        });

        document.body.appendChild(element);

        getOpenCases.emit(mockGetCases);
        await flushPromises();

        const datatable = element.shadowRoot.querySelector('lightning-datatable');

        datatable.dispatchEvent(new CustomEvent('save', {detail: {draftValues: INPUT_VALUE}}));
        await flushPromises();

        expect(updateCases).toHaveBeenCalled();
        expect(updateCases.mock.calls[0]).toEqual(INPUT_PARAM);
    });
});