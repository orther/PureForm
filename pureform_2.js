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
     * @param prepend_to_order_list   (boolean)  [optional]
     */
    function registerRetriever (name, is_retriever_function, retrieve_value_function, prepend_to_order_list) {

        // thow exception if arguments are not valid
        if (typeof name != "string")
            throw "pureForm::registerRetriever >> `name` param is of type `" + typeof name + "` but must be a string";

        if (name in __retrievers)
            throw "pureForm::registerRetriever >> `" + name + "` retriever already registered";

        if (typeof is_retriever_function != "function")
            throw "pureForm::registerRetriever >> `is_retriever_function` param is of type `" + typeof is_retriever_function + "` but must be a function";

        if (typeof retrieve_value_function != "function")
            throw "pureForm::registerRetriever >> `retrieve_value_function` param is of type `" + typeof retrieve_value_function + "` but must be a function";

        if (typeof prepend_to_order_list != "boolean")
            var prepend_to_order_list = false;

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

        if (prepend_to_order_list) {

            // add retriever to begining of order list
            __retriever_order.unshift(name);

        } else {

           // add retriever to end of order list
            __retriever_order.push(name);

        }

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

        console.log(__retriever_order);
        for (i in __retriever_order) {

            if (__retrievers[__retriever_order[i]].isRetriever(element)) {

                // use this retriever to return value
                return __retrievers[__retriever_order[i]].retrieveValue(element);

            }

        }

        throw "pureForm::retrieveValue >> No retrievers registered that compatible with element.";

    }

    // -----------------------------------------------------------------------------------------------------------------

    return function () {

        return {
            "registerRetriever": registerRetriever,
            "retrieveValue":     retrieveValue
        };

    };

})();
