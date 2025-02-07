import { createElement } from 'lwc';
import CaseForm from 'c/caseForm';
import createCase from '@salesforce/apex/CaseHelper.createCase';

jest.mock(
    '@salesforce/apex/CaseHelper.createCase',
    () => ({
        default: jest.fn()
    }),
    { virtual: true }
);

describe('c-case-form', () => {
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

    //test origin dropdown
    it('test origin dropdown changes origin value', async () => {

        const element = createElement('c-case-form', {
            is: CaseForm
        });

        document.body.appendChild(element);

        const SELECTED_INPUT = 'Phone';
        const selectEl = element.shadowRoot.querySelector('lightning-combobox');

        selectEl.value = SELECTED_INPUT;
        selectEl.dispatchEvent(new CustomEvent('change', {detail: {value: selectEl.value}}));

        await flushPromises();


        expect(selectEl.value).toBe(SELECTED_INPUT);
    });

    //test submit button
    it('test submit button changes response message', async () => {

        const element = createElement('c-case-form', {
            is: CaseForm
        });

        document.body.appendChild(element);

        const SELECTED_INPUT = 'Phone';
        const SUBJECT_INPUT = 'Test';
        const CREATED_MESSAGE = 'Created new Case';

        const comboEl = element.shadowRoot.querySelector('lightning-combobox');
        const subjectEl = element.shadowRoot.querySelector('lightning-input');
        const buttonEl = element.shadowRoot.querySelector('lightning-button');

        createCase.mockResolvedValue(null);

        comboEl.value = SELECTED_INPUT;
        subjectEl.value = SUBJECT_INPUT;
        buttonEl.click();
        
        await flushPromises();

        const pEl = element.shadowRoot.querySelector('p');
        pEl.innerHtml = CREATED_MESSAGE;

        expect(pEl.innerHtml).toBe(CREATED_MESSAGE);
    });
    
});