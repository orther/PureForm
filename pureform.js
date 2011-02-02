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
            return function () {

                var __failed_validators = [];
                var __form              = this;
                var __name              = name;
                var __type              = type;
                var __validators        = [];
                var __valid             = false;
                var __value             = null;

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Return field type.
                 *
                 * @return (Array)
                 */
                function getType () {

                    return __type;

                }

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
                 * Return true if field has been validated otherwise false. Throws error if  the validate function has't
                 * been run on this field.
                 *
                 * @return (boolean)
                 */
                function isValid () {

                    if (__valid === null)
                        throw "pureForm::form::field::isValid >> Validator hadn't been ran on this field.";

                    return (__value === true);

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Set field type.
                 *
                 * @param name (string)
                 */
                function setType (name) {

                    __type = type;

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Set field value.
                 *
                 * @param value (*) The value can hold any type.
                 */
                function setValue (value) {

                    console.log(__failed_validators, __form, __name, __type, __validators, __valid, __value);
                    __value = value;

                    //console.log("setValue>> " + __value + " to " + value);
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

                    __validators.push(name);

                }

                // -----------------------------------------------------------------------------------------------------

                /**
                 * Loop through validators and validate field value.
                 *
                 * @return (boolean) Returns false if any validator fails otherwise, return true.
                 */
                function validate () {

                    __valid = true;

                    for (i in __validators) {

                        if (!__form.__pureForm.getValidator(__validators[i])(getValue())) {

                            __valid == false;

                            // add validator name to failed validators array
                            __failed_validators.push(__validators[i]);


                        }

                    }

                    return __valid;

                }

                // -----------------------------------------------------------------------------------------------------

                return {
                    "getType":       getType,
                    "getValidators": getValidators,
                    "getValue":      getValue,
                    "isValid":       isValid,
                    "setType":       setType,
                    "setValidator":  setValidator,
                    "setValue":      setValue,
                    "validate":      validate
                };

            };

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

            if (typeof params.type == "undefiend")
                throw "pureForm::addField >> Field `type` not set";

            if (!(params.type in __types)) {
                throw "pureForm::addField >> `" + name + "` field type `" + params.type  + "` is not registered";
            }

            // create field
            var field = this.__createField(name, params.type);

            if (typeof params.validators != "undefined") {

                if (!(params.validators instanceof Array))
                    throw "pureForm::addField >> Field `validators` is of type `" + typeof params.validators + "` but must be an array";

                for (i in params.validators) {

                    // set validator
                    try {

                        this.__pureForm.setValidator(params.validators[i]);

                    } catch (e) {

                        throw "pureForm::addField >> Field validator `" + params.validators[i] + "` is not registered";

                    }

                    // add validator to field
                    field().setValidator();

                }

            }

            // add field
            this.__fields[name] = field;

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

            var form_valid = true;

            for (field_id in this.__fields) {

                // set type casted value
                var type_casted_value = this.__pureForm.getTypeCaster(this.__fields[field_id]().getType()).getValue(field_id);

                this.__fields[field_id]().setValue(type_casted_value);

                // validate fields
                var field_valid = this.__fields[field_id]().validate();

                if (!field_valid)
                    form_valid = false;

            }

            // validate field values

            // build aggregate values

            // validate aggregate values

            // call custom onInvalid/onValid funtion
            if (form_valid) {

                if (typeof this.__onValid == "function")
                    // call custom onValid function
                    this.__onValid(this.__fields);

            } else {

                if (typeof this.__onInvalid == "function")
                    // call custom onInvalid function
                    this.__onInvalid(this.__fields);

            }


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
     * Return validator.
     *
     * @param name (string)
     *
     * @return (function)
     */
    function getValidator (name) {

        if (name in __validators)
            return __validators[name];

        // type not registered
        throw "pureForm::getValidator() >> `" +  name + "` not registered";

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
            "getValidator":      getValidator,
            "registerType":      registerType,
            "registerValidator": registerValidator
        };

    });

})();
