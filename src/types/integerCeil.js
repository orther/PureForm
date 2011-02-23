pureForm().registerType("integerCeil", function (input_value) {

    if (isNaN(input_value))
        return false;

    return Math.ceil(parseFloat(input_value));

});
