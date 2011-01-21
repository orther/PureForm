var pureform = (function () {

    var
        _fields              = {},
        _validator_prototype = null,
        _validators          = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Create field object and add it to the field stack if it doesn't already exist.
     *
     * @param field_name (string)
     */
    function _addField (field_name)
    {

        if (!field_name in _fields) {

            // add field
            _fields[field_name] = {
                "validators": []
            }

        }

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Assign validator to a field.
     *
     * @param validator_prototype (function) The validator prototype.
     */
    function _assignValidatorToField (field_name, validator_name, validator_params)
    {

        // validate params
        if (!field_name in _fields)
            throw "PureForm::_assignValidatorToField :: field_name `" + field_name + "` doesn't exist in the field stack";

        // validate params
        if (!validator_name in _validators)
            throw "PureForm::_assignValidatorToField :: field_name `" + field_name + "` doesn't exist in the field stack";

        // create validator

        // add validator to field
        _fields[field_name].validators.push();

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Assign the validator prototype.
     *
     * @param validator_prototype (function) The validator prototype.
     */
    function assignValidatorPrototype (validator_prototype)
    {

        _validator_prototype = validator_prototype;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a PureForm validator.
     *
     * @param name      (string)
     * @param validator (function) The validator closure function.
     */
    function isValidatorRegistered (name, validator) {

        return name in _validators;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a PureForm validator.
     *
     * @param name      (string)
     * @param validator (function) The validator closure function.
     */
    function registerValidator (name, validator) {

        _validators[name] = validator;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Setup PureForm instance settings.
     *
     * NOTE: You can run setup multiple times to add more validators.
     *
     * @param params (array)
     */
    function setup (params) {

        if (typeof params != "object")
            throw "PureForm::setup :: No valid params passed";

        if (params.validators instanceof Array) {

            if (!0 in params.validators)
                throw "PureForm::setup :: Field name missing from validator item: ";

            if (!1 in params.validators)
                throw "PureForm::setup :: Validator name missing from validator item: ";

            if (!2 in params.validators)
                var validator_params = null;

            // add validators to fields
            _assignValidatorToField(field_name, validator_name, validator_params);

        }

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Unregister a PureForm validator.
     *
     * @param name      (string)
     */
    function unregisterValidator (name, validator) {

        delete _validators[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    // return PureForm methods
    return (function () {

        return {
            // validator
            "isValidatorRegistered": isValidatorRegistered,
            "registerValidator":     registerValidator,
            "unregisterValidator":   unregisterValidator
        };

    });

})();
