var pureFormTypeIntegerCeil = new pureFormType;

pureFormTypeIntegerCeil.typeCast = function (raw_value) {

     if (isNaN(raw_value))
        return false;

    return Math.ceil(parseFloat(raw_value));

}

pureForm().registerType("integerCeil", pureFormTypeIntegerCeil);
