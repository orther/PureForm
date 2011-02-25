PureFormTestCase = TestCase("PureForm");

PureFormTestCase.prototype.testCreateForm = function () {
    assertObject(pureForm().addForm("test_form"));
};

PureFormTestCase.prototype.testGetForm = function () {
    assertObject(pureForm().getForm("test_form"));
};

PureFormTestCase.prototype.testAddField = function () {
    /*:DOC += <input id="first_name" value="Brandon" /> */
    assertObject(pureForm().getForm("test_form").addField("first_name", {type: "string", name: "First Name"}));
};

PureFormTestCase.prototype.testAddFieldValidator = function () {
    /*:DOC += <input id="last_name" value="Orther" /> */
    assertObject(pureForm().getForm("test_form").addField("last_name", {
        type: "string",
        name: "Last Name",
        validators: {
            "min": {"min": 3, "error": "%field_name% must be at least %min% characters long."},
            "max": {"max": 30, "error": "%field_name% must be less than %max% characters long."}
        }
    }));
};

PureFormTestCase.prototype.testAddFieldValidator = function () {
    /*:DOC += <input id="last_name" value="Orther" /> */
    assertObject(pureForm().getForm("test_form").addField("last_name", {
        type: "string",
        name: "Last Name",
        validators: {
            "min": {"min": 3, "error": "%field_name% must be at least %min% characters long."},
            "max": {"max": 30, "error": "%field_name% must be less than %max% characters long."}
        },
        onInvalid: function (field_validator_errors) {
            console.log(field_validator_errors);
        }
    }));
};
