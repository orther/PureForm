/**
 * This is the base class that all retrievers are based off of. A retriever is an object that retrieves the raw value
 * of a DOM element. The two methods that need to be overwritten in extending retriever classes are is
 */
function pureFormRetriever (is_retriever_function, retrieve_value_function) {

    // thow exception if arguments are not valid
    if (typeof is_retriever_function != "function")
        throw "pureFormRetriever >> `is_retriever_function` param is of type `" + typeof params.validators + "` but must be function";

    if (typeof retrieve_value_function != "function")
        throw "pureFormRetriever >> `retrieve_value_function` param is of type `" + typeof params.validators + "` but must be function";

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
