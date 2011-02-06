pureForm().registerValidator("min",
    /**
     * This validator will test for minimum. If the type of value is a number the min/max it tested against the number.
     * If the type of the value is a string the min is tested against the string length.
     *
     * @param value  (*)      Value to be tested
     * @param params (object) min:       The minimum limit allowed to pass validation
     *                        min_error: This param allows you to set the error message returned on failed
     *                                   minimum validation.
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

        if (typeof params.min != "undefined" && typeof params.min != "number")
            throw "pureForm/Validator::limit >> `validator_params.min` param is of type `" + typeof params.min + "` but must be a number";

        if (typeof params.min_error == "undefined")
            // default min error message
            params.min_error = "To small!";

        if (typeof params.min_error != "string")
            throw "pureForm/Validator::limit >> `validator_params.min_error` param is of type `" + typeof params.min_error + "` but must be a string";

        var error_msgs = [];

        switch (typeof value) {
            case "number":
                if (typeof params.min == "number" && value < params.min)
                    error_msgs.push(params.min_error);

                break;

            // ---------------------------------------------------------------------------------------------------------

            case "string":
                if (typeof params.min == "number" && value.length < params.min)
                    error_msgs.push(params.min_error);

                break;

        }

        return error_msgs;

    }
);

