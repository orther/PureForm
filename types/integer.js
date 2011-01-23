var pureFormTypeInteger = new pureFormType;

pureFormTypeInteger.typeCast = function (raw_value) {

     if (isNaN(raw_value))
        return false;

    return Math.round(parseFloat(raw_value));

};

pureForm().registerType("integer", pureFormTypeInteger);
