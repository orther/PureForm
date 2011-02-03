pureForm()._registerBaseType("float", function (input_value) {

    if (isNaN(input_value))
        return false;

    return parseFloat(input_value);

});
