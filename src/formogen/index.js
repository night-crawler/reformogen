/*
    ========================= TODOLIST =========================

    [ ] do some tests, we need a bit more tests

    [+] edit && save support (implemented POST, PATCH logic)
    [+] action URL (old formogen: objUrl, objCreateUrl)
    [ ] modal forms support (modal-mode)
    [?] dropzone
    [?] state save between requests
    [ ] m2m async
    [ ] cache metadata

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
    [ ] reload form
    [+] misc error display (500, 300 etc) (it's not project's responsibility)
    [ ] validate (simple) user input (js-side validators)
    [ ] populate from (*) custom user data values
    [ ] i18n
    [ ] fix re-render issue (see logs)

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
import 'moment/locale/ru';

import Formogen from './FormogenComponent';
export default Formogen;
