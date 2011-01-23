var pureFormTypeString = new pureFormType;

pureFormTypeString.typeCast = function (raw_value) {

     if (raw_value === "")
        return null;

    return String(raw_value);

}

pureForm().registerType("string", pureFormTypeString);
