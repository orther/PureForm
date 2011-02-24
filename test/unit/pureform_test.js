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
