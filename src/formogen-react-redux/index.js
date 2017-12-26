/*
    ========================= TODOLIST =========================
    [ ] selected value for files (show additional checkbox to clear && show currently selected file name)
    [ ] two forms on one page
    [ ] do some tests, we need a bit more tests
    [ ] deal with response.status == pending
    [ ] modal forms support (modal-mode)
    [ ] cache metadata
    [ ] fk & m2m - check loading options without paginator (server-side)
    [ ] reload form
    [ ] validate (simple) user input (js-side validators)
    [?] i18n (it's not project's responsibility)
    [ ] fix re-render issue (see logs)

    [+] edit && save support (implemented POST, PATCH logic)
    [+] action URL (old formogen: objUrl, objCreateUrl)
    [+] dropzone
    [+] state save between requests
    [+] m2m async (pagination etc)

    [+] render json metadata (got from sever-side)
    [+] dynamic metadata (without serverside endpoints)
    [+] dynamic data loading (data='/url/')
    [+] additional fields (via <Formogen metaData={ ... }/>
    [+] populate with default values
    [+] layouts
    [+] request interceptions (pipeline)
    [+] error display
    [+] non-field errors
    [+] initial form field state (via props formData)
    [+] custom react-select option && value renderers
    [+] custom react-select option && value renderers deal with initial values before component's data loaded
    [+] misc error display (500, 300 etc) (it's not project's responsibility)

    [+] populate from (*) custom user data values
    [+] proper tab index for fields

    [+] form component as a prop
    [+] submit component as a prop

    ============================================================
*/

/*
    ATTENTION:
        https://github.com/uberVU/react-guide/blob/master/props-vs-state.md
        https://stackoverflow.com/questions/27991366/what-is-the-difference-between-state-and-props-in-react

        Both props and state changes trigger a render update!


        Props
            - immutable (let's react do fast reference checks)
            - used to pass data down from your view-controller (your top level component)
            - better performance, use this to pass data to child components

        State
            - should be managed in your view-controller (your top level component)
            - mutable
            - worse performance
            - don't access this to from child components, pass it down with props instead
 */

// https://github.com/sunnylqm/react-native-storage

/* All used locales (from moment.js, excepting the 'en' locale) MUST be imported explicitly HERE! */

export { default } from './containers';
