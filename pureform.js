var pureform = (function () {

    var __validators = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a PureForm validator.
     *
     * @param name      (string)
     * @param validator (function) The validator closure function.
     */
    function isValidatorRegistered (name, validator) {

        return name in __validators;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a PureForm validator.
     *
     * @param name      (string)
     * @param validator (function) The validator closure function.
     */
    function registerValidator (name, validator) {

        __validators[name] = validator;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Unregister a PureForm validator.
     *
     * @param name      (string)
     */
    function unregisterValidator (name, validator) {

        delete __validators[name];

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

// Let's test this function
// function isEven(val) {
//   return val % 2 === 0;
// }
