var pureFormTypeString = new pureFormType;

pureFormTypeString.typeCast = function (raw_value) {

    return String(raw_value);

}

pureForm().registerType("string", pureFormTypeString);
