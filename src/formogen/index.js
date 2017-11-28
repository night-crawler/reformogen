/*
    ========================= TODOLIST =========================

    [ ] edit && save support
    [+] render json metadata
    [ ] validate (simple) user input (js-side validators)
    [+] dynamic data loading (data='/url/')
    [ ] custom (3) renderers
    [+] populate with default values
    [ ] populate from (*) custom user data values
    [+] layouts
    [+] dynamic metadata (without serverside endpoints)
    [ ] additional fields
    [ ] request interceptions (pipeline)
    [ ] i18n
    [+] error display
    [+] non-field errors
    [ ] initial form field state
    [ ] state save between requests
    [ ] modal forms support
    [?] dropzone

    [ ] modal mode
    [ ] action URL (old formogen: objUrl, objCreateUrl)
    [ ] cache metadata

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

/* All used locales (from moment.js, excepting the 'en' locale) MUST be imported explicitly HERE! */
import 'moment/locale/ru';

import Formogen from './FormogenComponent';
export default Formogen;
