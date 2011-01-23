function pureFormType {

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
        throw new pureFormTypeErrorUndeterminedType();

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
                var value = element.value;

                if (typeof value != "string")
                    throw new pureFormTypeErrorValueCollectionFailed();

                return value;

            // -----------------------------------------------------------------------------------------------------------------

            case "INPUT_CHECKBOX":
                var value = element.value;

                if (typeof value != "string")
                    throw new pureFormTypeErrorValueCollectionFailed();

                if (element.checked)
                    return value;

                return "";

            // -----------------------------------------------------------------------------------------------------------------

            case "INPUT_RADIO"
                var fields = document.getElementsByName(element.name);

                for (i in fields) {

                    if (fields[i].checked) {

                        var value = fields[i].value;

                        if (typeof value != "string")
                            throw new pureFormTypeErrorValueCollectionFailed();

                        return vale;

                    }

                }

                // no radio box selected
                return "";

            // -----------------------------------------------------------------------------------------------------------------

            case "SELECT"
                var value = element.value;

                if (typeof value != "string")
                    throw new pureFormTypeErrorValueCollectionFailed();

                if (element.checked)
                    return value;

                return "";

            // -----------------------------------------------------------------------------------------------------------------

            case "TEXTAREA":
                var value = element.value;

                if (typeof value != "string")
                    throw new pureFormTypeErrorValueCollectionFailed();

                return value;

        }

        throw new pureFormTypeErrorNoCollectorForType();

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
            throw new pureFormTypeErrorElementDoesNotExist();

        // get field type
        var type = this.__getFieldType(field);

        // get field value
        var value = this.__getFieldValue(field);

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
            throw new pureFormTypeErrorMissingTypeCastMethod();

        return this.typeCast(this.__getRawValue(field_id));

    };

    // -----------------------------------------------------------------------------------------------------------------

}

// ---------------------------------------------------------------------------------------------------------------------
// EXCEPTIONS
// ---------------------------------------------------------------------------------------------------------------------

/**
 * This is the base error that all other pureFormType errors are based.
 */
var pureFormTypeError = new pureFormError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when a field element with the set ID does not exist.
 */
var pureFormTypeErrorElementDoesNotExist = new pureFormTypeError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when the type class doesn't provide a typeCast method.
 */
var pureFormTypeErrorMissingTypeCastMethod = new pureFormTypeError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when a collector for the element type doesn't exist.
 */
var pureFormTypeErrorNoCollectorForType = new pureFormTypeError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when a collector for the element type doesn't exist.
 */
var pureFormTypeErrorNoCollectorForType = new pureFormTypeError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when an element's type can not be determined.
 */
var pureFormTypeErrorUndeterminedType = new pureFormTypeError;

// ---------------------------------------------------------------------------------------------------------------------

/**
 * This error is thrown when a collector fails to collect value from field.
 */
var pureFormTypeErrorValueCollectionFailed = new pureFormTypeError;
