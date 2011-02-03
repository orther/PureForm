pureForm()._registerBaseType("integerCeil", function (input_value) {

    if (isNaN(input_value))
        return false;

    return Math.round(parseFloat(input_value));

});
