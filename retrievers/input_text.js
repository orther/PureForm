pureForm().registerRetriever("input_text",
    // test if this is retriever for element
    function (element) {

        if (element.tagName == "INPUT" && element.type == "text")
            return true;

        return false;

    },
    // retrieve value
    function (element) {

        return element.value;

    }
);
