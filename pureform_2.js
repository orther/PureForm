var pureForm = (function () {

    var __base_retrievers        = {};
    var __base_types             = {};
    var __custom_retrievers      = {};
    var __custom_retriever_order = [];
    var __custom_types           = {};

    // -----------------------------------------------------------------------------------------------------------------

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
     * Register a base type.
     *
     * @param name                     (string)
     * @param type_conversion_function (function)
     *
     * @return (*) Returns type casted value.
     */
    function _registerBaseType (name, type_conversion_function) {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::_registerBaseType >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __base_retrievers)
            throw "pureForm::_registerBaseType >> `" + name + "` retriever already registered";

        if (typeof type_conversion_function != "function")
            throw "pureForm::_registerBaseType >> `type_conversion_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        __base_types[name] = type_conversion_function;

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

        if (!(type_name in __base_types) && !(type_name in __custom_types))
            throw "pureForm::typeCast >> `" + type_name + "` type is not registered";

        if (typeof input_value == "undefined")
            throw "pureForm::typeCast >> `input_value` param is required";

        if (type_name in __custom_types)
            return __custom_types[type_name](input_value);

        return __base_types[type_name](input_value);

    }

    // -----------------------------------------------------------------------------------------------------------------

    return function () {

        return {
            "_registerBaseRetriever": _registerBaseRetriever,
            "_registerBaseType":      _registerBaseType,
            "registerRetriever":      registerRetriever,
            "retrieveValue":          retrieveValue,
            "typeCast":               typeCast
        };

    };

})();
