pureForm().registerValidator("limit",
    /**
     * This validator will test for limits. If the type of value is a number the min/max it tested against the number.
     * If the type of the value is a string the min/max is tested about the string len. Only the params set are tested.
     * This means if no max param is set then the value is not tested against for a max.
     *
     * @param value  (*)      Value to be tested
     * @param params (object) min:       The minimum limit allowed to pass validation
     *                        min_error: This param allows you to set the error message returned on failed
     *                                   minimum validation.
     *                        max:       The maximum limit allowed to pass validation
     *                        max_error: This param allows you to set the error message returned on failed
     *                                   maximum validation.
     *
     * @return (boolean/array) On valid return true, othewise return error message(s) in an array.
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
                if (typeof params.max == "number" && value > params.max)
                    error_msgs.push(params.max_error);

                if (typeof params.min == "number" && value < params.min)
                    error_msgs.push(params.min_error);

                break;

            // ---------------------------------------------------------------------------------------------------------

            case "string":
                if (typeof params.max == "number" && value.length > params.max)
                    error_msgs.push(params.max_error);

                if (typeof params.min == "number" && value.length < params.min)
                    error_msgs.push(params.min_error);

                break;

        }

        return (error_msgs.length) ? error_msgs : true;

    }
);

