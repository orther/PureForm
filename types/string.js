pureForm().registerType("string", function (input_value) {

     if (input_value === "")
        return null;

    return String(input_value);

});
