var pureForm = (function () {

    var
        _forms = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Create new PureForm form and added it to internal form registry. Throw an error if form with name already exists.
     *
     * @param name (string)
     *
     * @return (object) PureForm form object.
     */
    function create (name) {

        if (name in _forms)
            throw "PureForm::create() >> Failed, form named `" + name + "` already exist.";

        _forms[name] = {};

        return _forms[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Return existing PureForm form object. Throw an error if form with name doesn't exists.
     *
     * @param name (string)
     *
     * @return (object) PureForm form object.
     */
    function get (name) {

        if (!(name in _forms))
            throw "PureForm::get() >> Failed, form named `" + name + "` does not exist.";

        return _forms[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    // return PureForm methods
    return (function () {

        return {
            // validator
            "create": create,
            "get":    get
        };

    });

})();
