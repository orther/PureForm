var pureForm = (function () {

    var _forms = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * The form object all created forms are based created from.
     */
    function formObject () {

        this._aggregates       = {};
        this._fields           = {};
        this._onInvalid        = null;
        this._onSubmit         = null;
        this._onSubmitComplete = null;
        this._onValid          = null;

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add aggregate to form.
         *
         * @param name   (string)
         * @param params (object)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.addAggregate = function (name, params) {

            if (typeof name != "string")
                throw "pureForm::addAggregate >> `name` not a string";

            if (name in this._aggregates)
                throw "pureForm::addAggregate >> Aggregate with name `" + name + "` already exists";

            if (typeof params != "object")
                throw "pureForm::addAggregate >> `params` not an object";

            // add field
            this._aggregates[name] = params;

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add multiple aggregates to form.
         *
         * @param aggregates (object)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.addAggregates = function (aggregates) {

            for (aggregate_name in aggregates)
                this.addAggregate(aggregate_name, aggregates[aggregate_name]);

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add field to form.
         *
         * @param name   (string)
         * @param params (object)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.addField = function (name, params) {

            if (typeof name != "string")
                throw "pureForm::addField >> `name` not a string";

            if (name in this._fields)
                throw "pureForm::addField >> Field with name `" + name + "` already exists";

            if (typeof params != "object")
                throw "pureForm::addField >> `params` not an object";

            // add field
            this._fields[name] = params;

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add multiple fields to form.
         *
         * @param fields (object)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.addFields = function (fields) {

            for (field_name in fields)
                this.addField(field_name, fields[field_name]);

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Attach button to form submit()
         *
         * @param button_id (string)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.attachSubmitButton = function (button_id) {

            // TODO: Add event listener to trigger submit functionality

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Attach multiple buttons to form submit()
         *
         * @param button_ids (Array)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.attachSubmitButtons = function (button_ids) {

            for (button_id in button_ids)
                this.attachSubmitButton(button_id);

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add custom onSubmit function
         *
         * @param onSubmit (function)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.onSubmit = function (onSubmit) {

            if (typeof onSubmit != "function")
                throw "PureForm::form::onSubmit() >> Failed, onSubmit param must be a function and is not.";

            this._onSubmit = onSubmit;

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Submit this form which entails:
         *      - call custom onSubmit function
         *      - collect field values
         *      - validate field values
         *      - build aggregate values
         *      - validate aggregate values
         *      - call custom onInvalid/onValid function
         *      - call onSubmitComplete
         */
        this.submit = function () {

            // call onSubmit

            // collect field values

            // validate field values

            // build aggregate values

            // validate aggregate values

            // call custom onInvalid/onValid funtion

            // call onSubmitComplete

        };

    };

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

        _forms[name] = new formObject;

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
