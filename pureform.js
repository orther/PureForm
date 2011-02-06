var pureForm = (function () {

    var __base_retrievers        = {};
    var __custom_retrievers      = {};
    var __custom_retriever_order = [];
    var __forms                  = {};
    var __types                  = {};
    var __validators             = {};

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Build a field object used internally to organize the elements of a field.
     *
     * @param id     (string)
     * @param params (object)
     *
     * @return (object)
     */
    function __buildField (params) {


    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Build a form object used internally to organize different forms.
     *
     * @return (object)
     */
    function __buildForm () {

        var __fields = {}

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Register a new field.
         *
         * @param id     (string)
         * @param params (object)
         *
         * @return (object)
         */
        function addField (id, params) {

            if (typeof id == "undefined")
                throw "pureForm/form::addField >> `id` param is required";

            if (typeof id != "string")
                throw "pureForm/form::addField >> `id` param is of type `" + typeof id + "` but must be a string";

            if (id in __fields)
                throw "pureForm/form::addField >> `" + id + "` field already registered";

            if (document.getElementById(id) === null)
                throw "pureForm/form::addField >> There is no DOM element with ID `" + id + "`";

            if (typeof params == "undefined")
                throw "pureForm/form::addField >> [" + id + "] `params` param is required";

            if (typeof params != "object")
                throw "pureForm/form::addField >> [" + id + "] `params` param is of type `" + typeof params + "` but must be an object";

            if (typeof params.type != "string")
                throw "pureForm/form::addField >> [" + id + "] `params.type` param is required and must be a string";

            if (!(params.type in __types))
                throw "pureForm/form::addField >> [" + id + "] Field type `" + params.type + "` is not registered";

            var validators = {};

            if ("validators" in params) {

                if (typeof params.validators != "object")
                    throw "pureForm/form::addField >> [" + id + "] `params.validators` param is of type `" + typeof params.validators + "` but must be an object";

                for (validator_name in params.validators) {

                    if (!(validator_name in __validators))
                        throw "pureForm/form::addField >> [" + id + "] Field validator `" + validator_name + "` is not registered";

                    validators[validator_name] = params.validators[validator_name];

                }

            }

           __fields[id] = {
                "raw_value":  null,
                "type":       params.type,
                "validators": validators,
                "value":      null
            };

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
        function getField (id) {

            if (typeof id == "undefined")
                throw "pureForm/form::getField >> `id` param is required";

            if (typeof id != "string")
                throw "pureForm/form::getField >> `id` param is of type `" + typeof id + "` but must be a string";

            if (id in __fields)
                throw "pureForm/form::getField >> `" + id + "` field already registered";

            return __fields[id];

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Retrieve all registered fields.
         *
         * @return (object)
         */
        function getFields () {

            return __fields;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Set a field's raw value.
         *
         * @param id    (string)
         * @param value (*)
         */
        function setFieldRawValue (id, value) {

            if (typeof id == "undefined")
                throw "pureForm/form::setFieldRawValue >> `id` param is required";

            if (typeof id != "string")
                throw "pureForm/form::setFieldRawValue >> `id` param is of type `" + typeof id + "` but must be a string";

            if (id in __fields)
                throw "pureForm/form::setFieldRawValue >> `" + id + "` field already registered";

            if (typeof value == "undefined")
                throw "pureForm/form::setFieldRawValue >> `value` param is required";

            return __fields[id].raw_value = value;

        }

        // -------------------------------------------------------------------------------------------------------------

        /**
         * Set a field's value.
         *
         * @param id    (string)
         * @param value (*)
         */
        function setFieldValue (id, value) {

            if (typeof id == "undefined")
                throw "pureForm/form::setFieldValue >> `id` param is required";

            if (typeof id != "string")
                throw "pureForm/form::setFieldValue >> `id` param is of type `" + typeof id + "` but must be a string";

            if (id in __fields)
                throw "pureForm/form::setFieldValue >> `" + id + "` field already registered";

            if (typeof value == "undefined")
                throw "pureForm/form::setFieldValue >> `value` param is required";

            return __fields[id].value = value;

        }

        // -------------------------------------------------------------------------------------------------------------

       return {
            "addField":         addField,
            "getField":         getField,
            "getFields":        getFields,
            "setFieldRawValue": setFieldRawValue,
            "setFieldValue":    setFieldValue
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
        return val_resp = __validators[validator_name](value, validator_params);

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
