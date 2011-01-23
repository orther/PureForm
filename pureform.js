var pureForm = (function () {

    var __forms      = {};
    var __types      = {};
    var __validators = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * The form object all created forms are based created from.
     */
    function _formObject (pureForm) {

        this.__aggregates       = {};
        this.__fields           = {};
        this.__fieldValues      = {};
        this.__onInvalid        = null;
        this.__onSubmit         = null;
        this.__onSubmitComplete = null;
        this.__onValid          = null;
        this.__pureForm         = pureForm;

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Create a new field.
         *
         * @param name (string)
         * @param type (string)
         *
         * @return (function)
         */
         this.__createField = function (name, type) {

            // return PureForm methods
            return (function () {

                var __form       = this;
                var __name       = name;
                var __type       = type;
                var __validators = [];
                var __value      = null;

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Return field validators.
                 *
                 * @return (Array)
                 */
                function getValidators () {

                    return __validators;

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Return field value.
                 *
                 * @return (*) The value returned can be any type.
                 */
                function getValue () {

                    return __value;

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Set field value.
                 *
                 * @param value (*) The value can hold any type.
                 */
                function setValue (value) {

                    __value = value;

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Set field validator.
                 *
                 * @param name (string) Validator name.
                 */
                function setValidator (name) {

                    if (name in __validators)
                        throw "pureForm::form::field::setValidator >> Validator `" + name + "` already set";

                    __validators,push(name);

                }

                // -----------------------------------------------------------------------------------------------------

                return {
                    // validator
                    "create":        create,
                    "get":           get,
                    "getTypeCaster": getTypeCaster,
                    "registerType":  registerType
                };

            });

        };

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

            if (name in this.__aggregates)
                throw "pureForm::addAggregate >> Aggregate with name `" + name + "` already exists";

            if (typeof params != "object")
                throw "pureForm::addAggregate >> `params` not an object";

            // add field
            this.__aggregates[name] = params;

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

            if (name in this.__fields)
                throw "pureForm::addField >> Field with name `" + name + "` already exists";

            if (typeof params != "object")
                throw "pureForm::addField >> `params` not an object";

            // add field
            this.__fields[name] = params;

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
                throw "pureForm::form::attachSubmitButton() >> Failed, element with id `" + button_id + "` doesn't exist.";

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
                throw "pureForm::form::attachSubmitButtons() >> Failed, `button_ids` is not an instance of Array";

            for (i in button_ids) {

                try {

                    this.attachSubmitButton(button_ids[i]);

                } catch (e) {

                    throw "pureForm::form::attachSubmitButtons() >> Failed, element with id `" + button_ids[i] + "` doesn't exist.";

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
                throw "pureForm::form::onInvalid() >> Failed, onInvalid param must be a function and is not.";

            this.__onInvalid = onInvalid;

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
                throw "pureForm::form::onSubmit() >> Failed, onSubmit param must be a function and is not.";

            this.__onSubmit = onSubmit;

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
                throw "pureForm::form::onSubmitComplete() >> Failed, onSubmitComplete param must be a function and is not.";

            this.__onSubmitComplete = onSubmitComplete;

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
                throw "pureForm::form::onValid() >> Failed, onValid param must be a function and is not.";

            this.__onValid = onValid;

            return this;

        };

        // -----------------------------------------------------------------------------------------------------------------

        /**
         * Register validator.
         *
         * @param name      (string)
         * @param validator (function)
         *
         * @return (object) Returns this object to allow chaining.
         */
        this.registerValidator = function (name, validator) {

            this.__pureForm.registerValidator(name, validator);

            return this;

        }

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

            if (typeof this.__onSubmit == "function")
                // call custom onSubmit function
                this.__onSubmit();

            // collect field values
            this.__fieldValues = {}

            for (field_id in this.__fields) {

                var field = this.__fields[field_id];

                // type cast value
                this.__fieldValues[field_id] = this.__pureForm.getTypeCaster(field.type).getValue(field_id);

            }

            console.log(this.__fieldValues);

            // validate field values

            // build aggregate values

            // validate aggregate values

            // call custom onInvalid/onValid funtion

            if (typeof this.__onSubmitComplete == "function")
                // call custom onSubmitComplete function
                this.__onSubmitComplete();

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

        if (name in __forms)
            throw "pureForm::create() >> Failed, form named `" + name + "` already exist.";

        __forms[name] = new _formObject(this);

        return __forms[name];

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

        if (!(name in __forms))
            throw "pureForm::get() >> Failed, form named `" + name + "` does not exist.";

        return __forms[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Return registered type caster object.
     *
     * @param name (string)
     *
     * @return (object)
     */
    function getTypeCaster (name) {

        if (name in __types)
            return __types[name];

        // type not registered
        throw "pureForm::getTypeCaster() >> `" +  name + "` not registered";

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register type.
     *
     * @param name       (string)
     * @param typeCaster (object)
     */
    function registerType (name, typeCaster) {

        if (name in __types)
            // type already registered
            throw "pureForm::registerType() >> `" +  name + "` already registered";

        // register type
        __types[name] = typeCaster;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register validator.
     *
     * @param name      (string)
     * @param validator (function)
     */
    function registerValidator (name, validator) {

        if (name in __validators)
            // validator already registered
            throw "pureForm::registerValidator() >> `" +  name + "` already registered";

        // register type
        __validators[name] = validator;

    }

    // -----------------------------------------------------------------------------------------------------------------

    // return PureForm methods
    return (function () {

        return {
            // validator
            "create":            create,
            "get":               get,
            "getTypeCaster":     getTypeCaster,
            "registerType":      registerType,
            "registerValidator": registerValidator
        };

    });

})();
