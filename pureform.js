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

            // attach button click event to the submit function
            var button = document.getElementById(button_id);

            if (button == null)
                throw "PureForm::form::attachSubmitButton() >> Failed, element with id `" + button_id + "` doesn't exist.";

            var _this = this;

            button.addEventListener('click', function (e) { _this.submit(); }, false);

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

            if (typeof button_ids != "object" || !(button_ids instanceof Array))
                throw "PureForm::form::attachSubmitButtons() >> Failed, `button_ids` is not an instance of Array";

            for (i in button_ids) {

                try {

                    this.attachSubmitButton(button_ids[i]);

                } catch (e) {

                    throw "PureForm::form::attachSubmitButtons() >> Failed, element with id `" + button_ids[i] + "` doesn't exist.";

                }

            }

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add custom onInvalid function
         *
         * @param onInvalid (function)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.onInvalid = function (onInvalid) {

            if (typeof onInvalid != "function")
                throw "PureForm::form::onInvalid() >> Failed, onInvalid param must be a function and is not.";

            this._onInvalid = onInvalid;

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
         * Add custom onSubmitComplete function
         *
         * @param onSubmitComplete (function)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.onSubmitComplete = function (onSubmitComplete) {

            if (typeof onSubmitComplete != "function")
                throw "PureForm::form::onSubmitComplete() >> Failed, onSubmitComplete param must be a function and is not.";

            this._onSubmitComplete = onSubmitComplete;

            return this;

        };

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Add custom onValid function
         *
         * @param onValid (function)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.onValid = function (onValid) {

            if (typeof onValid != "function")
                throw "PureForm::form::onValid() >> Failed, onValid param must be a function and is not.";

            this._onValid = onValid;

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
        this.submit = function (form_object) {

            if (typeof this._onSubmit == "function")
                // call custom onSubmit function
                this._onSubmit();

            // collect field values

            // validate field values

            // build aggregate values

            // validate aggregate values

            // call custom onInvalid/onValid funtion

            if (typeof this._onSubmitComplete == "function")
                // call custom onSubmitComplete function
                this._onSubmitComplete();

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
