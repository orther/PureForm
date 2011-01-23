var pureFormTypeFloat = new pureFormType;

pureFormTypeFloat.typeCast = function (raw_value) {

     if (isNaN(raw_value))
        return false;

    return parseFloat(raw_value);

}

pureForm().registerType("float", pureFormTypeFloat);
