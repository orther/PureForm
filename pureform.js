var pureForm = (function () {

    var __base_retrievers        = {};
    var __custom_retrievers      = {};
    var __custom_retriever_order = [];
    var __forms                  = {};
    var __types                  = {};
    var __validators             = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Build a field object.
     *
     * @param id     (string)
     * @param params (object)
     *
     * @return (object)
     */
    function __buildField (id, params) {

        if (typeof id == "undefined")
            throw "pureForm::__buildField >> `id` param is required";

        if (typeof id != "string")
            throw "pureForm::__buildField >> `id` param is of type `" + typeof id + "` but must be a string";

        if (document.getElementById(id) === null)
            throw "pureForm::__buildField >> There is no DOM element with ID `" + id + "`";

        if (typeof params == "undefined")
            throw "pureForm::__buildField >> [" + id + "] `params` param is required";

        if (typeof params != "object")
            throw "pureForm::__buildField >> [" + id + "] `params` param is of type `" + typeof params + "` but must be an object";

        if (typeof params.type != "string")
            throw "pureForm::__buildField >> [" + id + "] `params.type` param is required and must be a string";

        if (!(params.type in __types))
            throw "pureForm::__buildField >> [" + id + "] Field type `" + params.type + "` is not registered";

        var __id               = id;
        var __type             = params.type;
        var __field_validators = {};
        var __validated_value  = null;
        var __validator_errors = {};

        if ("validators" in params) {

            if (typeof params.validators != "object")
                throw "pureForm/form::addField >> [" + id + "] `params.validators` param is of type `" + typeof params.validators + "` but must be an object";

            for (validator_name in params.validators) {

                if (!(validator_name in __validators))
                    throw "pureForm/form::addField >> [" + id + "] Field validator `" + validator_name + "` is not registered";

                __field_validators[validator_name] = params.validators[validator_name];

            }

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Get raw field value. This is the value retrieved from the element before it is type casted.
         *
         * @return (*)
         */
        function __getRawValue () {

            var element = document.getElementById(__id);

            if (element === null)
                throw "pureForm/field::getRawValue >> There is no DOM element with ID `" + __id + "`";

            return retrieveValue(element);

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Return validated value.
         *
         * @return (*)
         */
        function __getValidatedValue () {

            return __validated_value;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Return validation errors object.
         *
         * @return (object)
         */
        function __getValidationErrors () {

            return __validator_errors;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Get type casted field value.
         *
         * @return (*)
         */
        function __getValue () {

            var raw_value = __getRawValue();

            return typeCast(__type, raw_value);

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Validate a field. If no validations errors return true, otherwise return false. All validation errors are
         * stored.
         *
         * @return (boolean)
         */
        function __validate () {

            var field_valid = true;
            var field_value = __getValue();

            __validated_value  = field_value;
            __validator_errors = {};

            for (validator_name in __field_validators) {

                var validation_errors = validate(field_value, validator_name, __field_validators[validator_name]);

                if (validation_errors.length) {

                    // there ARE validation errors
                    __validator_errors[validator_name] = {
                        "errors": validation_errors,
                        "params": __field_validators[validator_name],
                        "value":  field_value
                    }

                    field_valid = false;

                }

            }

            return field_valid;

        }

        // -------------------------------------------------------------------------------------------------------------

        return function () {

            return {
                "getRawValue":         __getRawValue,
                "getValidatedValue":   __getValidatedValue,
                "getValidationErrors": __getValidationErrors,
                "getValue":            __getValue,
                "validate":            __validate
            };

        };

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Build a form object used internally to organize different forms.
     *
     * @return (object)
     */
    function __buildForm () {

        var __fields              = {}
        var __on_invalid_function = null;
        var __on_valid_function   = null;
        var __validator_errors    = {};

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Register a new field.
         *
         * @param id     (string)
         * @param params (object)
         *
         * @return (object) Return this form object to allow chaining.
         */
        function __addField (id, params) {

            if (typeof id == "undefined")
                throw "pureForm/form::addField >> `id` param is required";

            if (id in __fields)
                throw "pureForm/form::addField >> `" + id + "` field already registered";

            if (typeof params == "undefined")
                throw "pureForm/form::addField >> [" + id + "] `params` param is required";

            __fields[id] = __buildField(id, params);

            return this;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Retrieve a single field.
         *
         * @param id (string)
         *
         * @return (object)
         */
        function __getField (id) {

            if (typeof id == "undefined")
                throw "pureForm/form::getField >> `id` param is required";

            if (typeof id != "string")
                throw "pureForm/form::getField >> `id` param is of type `" + typeof id + "` but must be a string";

            if (!(id in __fields))
                throw "pureForm/form::getField >> `" + id + "` field is not registered";

            return __fields[id];

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Retrieve all registered fields.
         *
         * @return (object)
         */
        function __getFields () {

            return __fields;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Return validation errors object which includes an entry for fields that have valdiation errors.
         *
         * @return (object)
         */
        function __getValidationErrors () {

            return __validator_errors;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Assign function to be invoked when form validation fails.
         *
         * NOTE: The custom on_invalid_function is passed a single param which is an object of field validation errors.
         *
         * @param on_invalid_function (function)
         *
         * @return (object) Return this form object to allow chaining.
         */
        function __onInvalid (on_invalid_function) {

            if (typeof on_invalid_function != "function")
                throw "pureForm/form::__onInvalid >> `on_invalid_function` param is of type `" + typeof on_invalid_function + "` but must be a function";

            __on_invalid_function = on_invalid_function;

            return this;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Assign function to be invoked when form validation succeeds.
         *
         * NOTE: The custom on_valid_function is passed a single param which is an object of field values.
         *
         * @param on_invalid_function (function)
         *
         * @return (object) Return this form object to allow chaining.
         */
        function __onValid (on_valid_function) {

            if (typeof on_valid_function != "function")
                throw "pureForm/form::__onValid >> `on_valid_function` param is of type `" + typeof on_valid_function + "` but must be a function";

            __on_valid_function = on_valid_function;

            return this;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Validate all form fields. If no validations errors return true, otherwise return false.
         *
         * @return (boolean)
         */
        function __validate () {

            var fields_valid     = true;
            var validated_values = {};

            __validator_errors = {};

            for (field in __fields) {

                if (!__fields[field]().validate()) {

                    __validator_errors[field] = __fields[field]().getValidationErrors();


                    fields_valid = false;

                }

                validated_values[field] = __fields[field]().getValidatedValue();

            }

            if (fields_valid) {

                if (typeof __on_valid_function == "function")
                    // invoke custom onValid function
                    __on_valid_function(validated_values);

            } else {

                if (typeof __on_invalid_function == "function")
                    // invoke custom onInvalid function
                    __on_invalid_function(__validator_errors);

            }

            return fields_valid;

        }

        // -------------------------------------------------------------------------------------------------------------

        return {
            "addField":            __addField,
            "getField":            __getField,
            "getFields":           __getFields,
            "getValidationErrors": __getValidationErrors,
            "onInvalid":           __onInvalid,
            "onValid":             __onValid,
            "onInvalid":           __onInvalid,
            "validate":            __validate
        };

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Build a retriever object used internally for element value retrieval.
     *
     * @param is_retriever_function   (function)
     * @param retrieve_value_function (function)
     *
     * @return (object)
     */
    function __buildRetriever (is_retriever_function, retrieve_value_function) {

       return {

            /**
             * Test if this retriever is for the supplied element.
             *
             * @param element (object)
             *
             * @return (bool)
             */
            "isRetriever": function (element) {

                return is_retriever_function(element);

            },

            /**
             * Retrieve field value.
             *
             * @param element (object)
             *
             * @return (*)
             */
            "retrieveValue": function (element) {

                return retrieve_value_function(element);

            }

        };

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a base retriever.
     *
     * @param name                    (string)
     * @param is_retiever_function    (function)
     * @param retrieve_value_function (function)
     */
    function _registerBaseRetriever (name, is_retriever_function, retrieve_value_function)  {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::_registerBaseRetriever >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __base_retrievers)
            throw "pureForm::_registerBaseRetriever >> `" + name + "` retriever already registered";

        if (typeof is_retriever_function != "function")
            throw "pureForm::_registerBaseRetriever >> `is_retriever_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        if (typeof retrieve_value_function != "function")
            throw "pureForm::_registerBaseRetriever >> `retrieve_value_function` param is of type `" + typeof retrieve_value_function + "` but must be a function";

        __base_retrievers[name] = __buildRetriever(is_retriever_function, retrieve_value_function);

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a new form.
     *
     * @param name (string)
     *
     * @return (object) Return form object to allow chaining.
     */
    function addForm (name) {

        if (typeof name == "undefined")
            throw "pureForm::addForm >> `name` param is required";

        if (typeof name != "string")
            throw "pureForm::addForm >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __forms)
            throw "pureForm::addForm >> `" + name + "` form already registered";

        __forms[name] = __buildForm();

        return __forms[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Get registered form object.
     *
     * @param name (string)
     *
     * @return (object) Return form object.
     */
    function getForm (name) {

        if (typeof name == "undefined")
            throw "pureForm::getForm >> `name` param is required";

        if (typeof name != "string")
            throw "pureForm::getForm >> `name` param is of type `" + typeof name + "` but must be a string";

        if (!(name in __forms))
            throw "pureForm::addForm >> `" + name + "` form not registered";

        return __forms[name];

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a custom retriever.
     *
     * @param name                    (string)
     * @param is_retiever_function    (function)
     * @param retrieve_value_function (function)
     */
    function registerRetriever (name, is_retriever_function, retrieve_value_function)  {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::registerRetriever >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __custom_retrievers)
            throw "pureForm::registerRetriever >> `" + name + "` retriever already registered";

        if (typeof is_retriever_function != "function")
            throw "pureForm::registerRetriever >> `is_retriever_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        if (typeof retrieve_value_function != "function")
            throw "pureForm::registerRetriever >> `retrieve_value_function` param is of type `" + typeof retrieve_value_function + "` but must be a function";

        // add custom retriever
        __custom_retrievers[name] = __buildRetriever(is_retriever_function, retrieve_value_function);

        // add custom retriever to the end of the order list
        __custom_retriever_order.push(name);

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a type.
     *
     * @param name                     (string)
     * @param type_conversion_function (function)
     */
    function registerType (name, type_conversion_function) {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::_registerBaseType >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __base_retrievers)
            throw "pureForm::_registerBaseType >> `" + name + "` retriever already registered";

        if (typeof type_conversion_function != "function")
            throw "pureForm::_registerBaseType >> `type_conversion_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        __types[name] = type_conversion_function;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a validator.
     *
     * @param name               (string)
     * @param validator_function (function)
     */
    function registerValidator (name, validator_function) {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::_registerBaseValidator >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __validators)
            throw "pureForm::_registerBaseValidator >> `" + name + "` validator already registered";

        if (typeof validator_function != "function")
            throw "pureForm::_registerBaseValidator >> `validator_function` param is of type `" + typeof validator_function + "` but must be a function";

        __validators[name] = validator_function;

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Retrieve DOM Element value.
     *
     * @param element (object)
     *
     * @return (*)
     */
    function retrieveValue (element) {

        if (typeof element != "object")
            throw "pureForm::retrieveValue >> `element` param is of type `" + typeof element + "` but must be an object";

        // loop through custom retrievers
        for (i in __custom_retriever_order) {

            if (__custom_retrievers[__custom_retriever_order[i]].isRetriever(element)) {

                // use this retriever to return value
                return __custom_retrievers[__custom_retriever_order[i]].retrieveValue(element);

            }

        }

        // loop through base retrievers
        for (name in __base_retrievers) {

            if (__base_retrievers[name].isRetriever(element)) {

                // use this retriever to return value
                return __base_retrievers[name].retrieveValue(element);

            }

        }

        throw "pureForm::retrieveValue >> No retrievers registered that compatible with element.";

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Type cast a value.
     *
     * @param type_name   (object)
     * @param input_value (*)
     *
     * @return (*)
     */
    function typeCast (type_name, input_value) {

        if (!(type_name in __types) && !(type_name in __types))
            throw "pureForm::typeCast >> `" + type_name + "` type is not registered";

        if (typeof input_value == "undefined")
            throw "pureForm::typeCast >> `input_value` param is required";

        if (type_name in __types)
            return __types[type_name](input_value);

        return __types[type_name](input_value);

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Validate a value using a registered validator. If error occurs the error message is returned.
     *
     * @param value            (*)
     * @param validator_name   (string)
     * @param validator_params (object) [optional]
     *
     * @return (array) Return error message(s) in array. If array length 0 then the value is valid.
     */
    function validate (value, validator_name, validator_params) {

        if (typeof value == "undefined")
            throw "pureForm::validate >> `value` param is required";

        if (typeof validator_name == "undefined")
            throw "pureForm::validate >> `validator_name` param is required";

        if (typeof validator_name != "string")
            throw "pureForm::validate >> `validator_name` param is of type `" + typeof value + "` but must be a string";

        if (!(validator_name in __validators))
            throw "pureForm::validate >> `" + validator_name + "` validator is not registered";

        // run validator
        return __validators[validator_name](value, validator_params);

    }

    // -----------------------------------------------------------------------------------------------------------------

    return function () {

        return {
            "_registerBaseRetriever": _registerBaseRetriever,
            "addForm":                addForm,
            "getForm":                getForm,
            "registerType":           registerType,
            "registerRetriever":      registerRetriever,
            "registerValidator":      registerValidator,
            "retrieveValue":          retrieveValue,
            "typeCast":               typeCast,
            "validate":               validate
        };

    };

})();
