var pureForm = (function () {

    var __base_retrievers        = {};
    var __custom_retrievers      = {};
    var __custom_retriever_order = [];

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

        __custom_retrievers[name] = {

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

        __custom_retriever_order.push(name);

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a base retriever.
     *
     * @param name                    (string)
     * @param is_retiever_function    (function)
     * @param retrieve_value_function (function)
     */
    function __registerBaseRetriever (name, is_retriever_function, retrieve_value_function)  {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::__registerBaseRetriever >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __base_retrievers)
            throw "pureForm::__registerBaseRetriever >> `" + name + "` retriever already registered";

        if (typeof is_retriever_function != "function")
            throw "pureForm::__registerBaseRetriever >> `is_retriever_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        if (typeof retrieve_value_function != "function")
            throw "pureForm::__registerBaseRetriever >> `retrieve_value_function` param is of type `" + typeof retrieve_value_function + "` but must be a function";

        __base_retrievers[name] = {

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

    return function () {

        return {
            "__registerBaseRetriever": __registerBaseRetriever,
            "registerRetriever":       registerRetriever,
            "retrieveValue":           retrieveValue
        };

    };

})();
