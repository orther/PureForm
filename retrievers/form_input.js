pureForm().__registerBaseRetriever("form_input",
    // test if this is retriever for element
    function (element) {

        switch (element.tagName) {

            case "BUTTON":
            case "SELECT":
            case "TEXTAREA":
                return true;

            // ---------------------------------------------------------------------------------------------------------

            case "INPUT":
                switch (element.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "hidden":
                    case "image":
                    case "password":
                    case "radio":
                    case "reset":
                    case "submit":
                    case "text":
                        return true;
                }

        }

        return false;

    },
    // retrieve value
    function (element) {

        switch (element.tagName) {
            case "BUTTON":
                return element.value;

            // ---------------------------------------------------------------------------------------------------------

            case "INPUT":
                switch (element.type) {
                    case "button":
                    case "file":
                    case "hidden":
                    case "image":
                    case "password":
                    case "reset":
                    case "submit":
                    case "text":
                        return element.value;

                    // -------------------------------------------------------------------------------------------------

                    case "checkbox":
                        if (element.checked)
                            // checked
                            return element.value;

                        // not checked
                        return "";


                    // -------------------------------------------------------------------------------------------------

                    case "radio":
                        var fields = document.getElementsByName(element.name);

                        for (i in fields) {

                            if (fields[i].checked)
                                return fields[i].value;

                        }

                        // no radio box selected
                        return "";

                }

            // ---------------------------------------------------------------------------------------------------------

            case "SELECT":
                return element.value;

            // ---------------------------------------------------------------------------------------------------------

            case "TEXTAREA":
                return element.value;

        }

    }
);
