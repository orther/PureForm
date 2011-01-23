var pureFormTypeIntegerFloor = new pureFormType;

pureFormTypeIntegerFloor.typeCast = function (raw_value) {

     if (isNaN(raw_value))
        return false;

    return Math.floor(parseFloat(raw_value));

};

pureForm().registerType("integerFloor", pureFormTypeIntegerFloor);
