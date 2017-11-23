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
    [ ] non-field errors
    [ ] state save between requests
    [ ] modal forms support
    [?] dropzone

    [ ] modal mode
    [ ] action URL (old formogen: objUrl, objCreateUrl)
    [ ] cache metadata

    ============================================================
*/

/* All used locales (from moment.js, excepting the 'en' locale) MUST be imported explicitly HERE! */
import 'moment/locale/ru';

import Formogen from './FormogenComponent';
export default Formogen;
