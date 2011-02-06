pureForm().registerValidator("max",
    /**
     * This validator will test for maximum. If the type of value is a number the max/max it tested against the number.
     * If the type of the value is a string the max is tested against the string length.
     *
     * @param value  (*)      Value to be tested
     * @param params (object) max:       The maximum limit allowed to pass validation
     *                        max_error: This param allows you to set the error message returned on failed
     *                                   maximum validation.
     *
     * @return (array) Return error message(s) in array. If array length 0 then the value is valid.
     */
    function (value, params) {

        if (typeof value == "undefined")
            throw "pureForm/Validator::limit >> `value` param is required";

        if (typeof params == "undefined")
            var params = {}

        if (typeof params != "object")
            throw "pureForm/Validator::limit >> `validator_params` param is of type `" + typeof params + "` but must be an object";

        if (typeof params.max != "undefined" && typeof params.max != "number")
            throw "pureForm/Validator::limit >> `validator_params.max` param is of type `" + typeof params.max + "` but must be a number";

        if (typeof params.max_error == "undefined")
            // default max error message
            params.max_error = "To large!";

        if (typeof params.max_error != "string")
            throw "pureForm/Validator::limit >> `validator_params.max_error` param is of type `" + typeof params.max_error + "` but must be a string";

        var error_msgs = [];

        switch (typeof value) {
            case "number":
                if (typeof params.max == "number" && value < params.max)
                    error_msgs.push(params.max_error);

                break;

            // ---------------------------------------------------------------------------------------------------------

            case "string":
                if (typeof params.max == "number" && value.length < params.max)
                    error_msgs.push(params.max_error);

                break;

        }

        return error_msgs;

    }
);

