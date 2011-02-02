var pureForm = (function () {

    var __retrievers      = {};
    var __retriever_order = [];

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Register a retriever.
     *
     * @param name                    (string)
     * @param is_retiever_function    (function)
     * @param retrieve_value_function (function)
     */
    function registerRetriever (name, is_retriever_function, retrieve_value_function) {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::registerRetriever >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __retrievers)
            throw "pureForm::registerRetriever >> `" + name + "` retriever already registered";

        if (typeof is_retriever_function != "function")
            throw "pureForm::registerRetriever >> `is_retriever_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        if (typeof retrieve_value_function != "function")
            throw "pureForm::registerRetriever >> `retrieve_value_function` param is of type `" + typeof retrieve_value_function + "` but must be a function";

        __retrievers[name] = {

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

        __retriever_order.push(name);

    }

    // -----------------------------------------------------------------------------------------------------------------

    return function () {

        return {
            "registerRetriever": registerRetriever,
            "getRetrievers":     function () {
                return __retriever_order;
            }
        };

    };

})();
