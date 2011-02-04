function pureFormType () {

    // custom functions
    this.getFieldType  = null;
    this.getFieldValue = null;
    this.typeCast      = null;

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Return the field type. The type is a distinct string used to distinguish what value collector to use to retrieve
     * raw string value.
     *
     * @param element (object)
     *
     * @return (string)
     */
    this.__getFieldType = function (element) {

        // call custom getFieldType if it exists
        if (typeof this.getFieldType == "function") {

            var type = this.getFieldType(element);

            if (type != null)
                // type found
                return type;

        }

        switch (element.tagName) {

            case "BUTTON":
                return "BUTTON";

            // ---------------------------------------------------------------------------------------------------------

            case "INPUT":

                switch (element.type) {

                    case "button":
                        return "INPUT_BUTTON";

                    // -------------------------------------------------------------------------------------------------

                    case "checkbox":
                        return "INPUT_CHECKBOX";

                    // -------------------------------------------------------------------------------------------------

                    case "file":
                        return "INPUT_FILE";

                    // -------------------------------------------------------------------------------------------------

                    case "hidden":
                        return "INPUT_HIDDEN";

                    // -------------------------------------------------------------------------------------------------

                    case "image":
                        return "INPUT_IMAGE";

                    // -------------------------------------------------------------------------------------------------

                    case "password":
                        return "INPUT_PASSWORD";

                    // -------------------------------------------------------------------------------------------------

                    case "radio":
                        return "INPUT_RADIO";

                    // -------------------------------------------------------------------------------------------------

                    case "reset":
                        return "INPUT_RESET";

                    // -------------------------------------------------------------------------------------------------

                    case "submit":
                        return "INPUT_SUBMIT";

                    // -------------------------------------------------------------------------------------------------

                    case "text":
                        return "INPUT_TEXT";

                }

            break;

            // ---------------------------------------------------------------------------------------------------------

            case "TEXTAREA":
                return "TEXTAREA";

            // ---------------------------------------------------------------------------------------------------------

            case "SELECT":
                return "SELECT";

        }

        // type can not be determined
        throw "pureFormType::__getFieldType() >> Element's type can not be determined";

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Return the field value. If the value can not be determined then an Error is thrown.
     *
     * @param element (object)
     * @param type    (string)
     *
     * @return (string)
     */
    this.__getFieldValue = function (element, type) {

        // call custom getFieldValue if it exists
        if (typeof this.getFieldValue == "function") {

            var value = this.getFieldValue(element, type);

            if (value != null)
                // value found
                return value;

        }

        switch (type) {

            case "BUTTON":
            case "INPUT_BUTTON":
            case "INPUT_FILE":
            case "INPUT_HIDDEN":
            case "INPUT_IMAGE":
            case "INPUT_PASSWORD":
            case "INPUT_RESET":
            case "INPUT_SUBMIT":
            case "INPUT_TEXT":
                if (typeof element.value != "string")
                    throw "pureFormType::__getFieldValue() >> Type caster failed to collect value from field";

                return element.value;

            // -----------------------------------------------------------------------------------------------------------------

            case "INPUT_CHECKBOX":
                if (typeof element.value != "string")
                    throw "pureFormType::__getFieldValue() >> Type caster failed to collect value from field";

                if (element.checked)
                    return element.value;

                return "";

            // -----------------------------------------------------------------------------------------------------------------

            case "INPUT_RADIO":
                var fields = document.getElementsByName(element.name);

                for (i in fields) {

                    if (fields[i].checked) {

                        var value = fields[i].value;

                        if (typeof value != "string")
                            throw "pureFormType::__getFieldValue() >> Type caster failed to collect value from field";

                        return value;

                    }

                }

                // no radio box selected
                return "";

            // -----------------------------------------------------------------------------------------------------------------

            case "SELECT":
                if (typeof element.value != "string")
                    throw "pureFormType::__getFieldValue() >> Type caster failed to collect value from field";

                return element.value;

            // -----------------------------------------------------------------------------------------------------------------

            case "TEXTAREA":
                if (typeof element.value != "string")
                    throw "pureFormType::__getFieldValue() >> Type caster failed to collect value from field";

                return element.value;

        }

        throw "pureFormType::__getFieldValue() >> Type caster doesn't have field value collection method for type `" + type + "`";

    }

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Get the raw string value of a DOM element.
     *
     * @param field_id (string)
     *
     * @return (string)
     */
    this.__getRawValue = function (field_id) {

        // get field
        var field = document.getElementById(field_id);

        if (field == null)
            throw "pureFormType::__getRawValue() >> Field element with the id `" + field_id + "` does not exist";

        // get field type
        var type = this.__getFieldType(field);

        // get field value
        var value = this.__getFieldValue(field, type);

        return value;

    };

    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Get field type casted value.
     *
     * @param field_id (string)
     *
     * @return (*) Returns the type casted value of the field.
     */
    this.getValue = function (field_id) {

        if (typeof this.typeCast != "function")
            throw "pureFormType::getValue() >> Type class doesn't provide a typeCast method";

        return this.typeCast(this.__getRawValue(field_id));

    };

}
