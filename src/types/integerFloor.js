pureForm().registerType("integerFloor", function (input_value) {

    if (isNaN(input_value))
        return false;

    return Math.floor(parseFloat(input_value));

});
