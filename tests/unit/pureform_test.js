// ---------------------------------------------------------------------------------------------------------------------
// PureForm::form
// ---------------------------------------------------------------------------------------------------------------------

module("PureForm::core");

// ---------------------------------------------------------------------------------------------------------------------

test("create()", function () {

    // tests
    ok(pureForm().create("create()_1"), "Create test_form");
    raises(function () { pureForm().create("create()_2"); pureForm().create("create()_2"); }, "Throw error on attempt to create test_form when it already exists");

});

// ---------------------------------------------------------------------------------------------------------------------

test("get()", function () {

    // tests
    equal(pureForm().create("get()_1"), pureForm().get("get()_1"), "Create form and get it.");
    raises(function () { pureForm().get("get()_2"); }, "Throw error on attempt to get test_form when it already exists");

});

// ---------------------------------------------------------------------------------------------------------------------
// PureForm::form
// ---------------------------------------------------------------------------------------------------------------------

module("PureForm::form");

// ---------------------------------------------------------------------------------------------------------------------

test("addAggregate()", function () {

    // setup
    pureForm().create("addAggregate()_1");

    //tests
    ok(pureForm().get("addAggregate()_1").addAggregate("aggregate_1", {}), "Add aggregate to form");

});

// ---------------------------------------------------------------------------------------------------------------------

test("addAggregates()", function () {

    // setup
    pureForm().create("addAggregates()_1");
    var test_aggregates = {
        "aggregate_1": {},
        "aggregate_2": {}
    }

    //tests
    ok(pureForm().get("addAggregates()_1").addAggregates(test_aggregates), "Add multiple aggregates to form");

});

// ---------------------------------------------------------------------------------------------------------------------

test("addField()", function () {

    // setup
    pureForm().create("addField()_1");

    //tests
    ok(pureForm().get("addField()_1").addField("field_1", {type: "string"}), "Add field to form");

});

// ---------------------------------------------------------------------------------------------------------------------

test("addFields()", function () {

    // setup
    pureForm().create("addFields()_1");
    var test_fields = {
        "field_1": {type: "string"},
        "field_2": {type: "string"}
    }

    //tests
    ok(pureForm().get("addFields()_1").addFields(test_fields), "Add multiple fields to form");

});

// ---------------------------------------------------------------------------------------------------------------------

test("attachSubmitButton()", function () {

    // setup
    pureForm().create("attachSubmitButton()_1");

    //tests
    ok(pureForm().get("attachSubmitButton()_1").attachSubmitButton("submit_1"), "Attach button to submit()")

});

// ---------------------------------------------------------------------------------------------------------------------

test("attachSubmitButtons()", function () {

    // setup
    pureForm().create("attachSubmitButtons()_1");
    var test_buttons = ["submit_1", "submit_2"];

    //tests
    ok(pureForm().get("attachSubmitButtons()_1").attachSubmitButtons(test_buttons), "Attach multiple buttons to submit()");

});

// ---------------------------------------------------------------------------------------------------------------------

test("onInvalid()", function () {

    // setup
    pureForm().create("onInvalid()_1");

    //tests
    ok(pureForm().get("onInvalid()_1").onInvalid(function () {  }), "Set custom onInvalid() function")

});

// ---------------------------------------------------------------------------------------------------------------------

test("onSubmit()", function () {

    // setup
    pureForm().create("onSubmit()_1");

    //tests
    ok(pureForm().get("onSubmit()_1").onSubmit(function () {  }), "Set custom onSubmit() function")

});

// ---------------------------------------------------------------------------------------------------------------------

test("onSubmitComplete()", function () {

    // setup
    pureForm().create("onSubmitComplete()_1");

    //tests
    ok(pureForm().get("onSubmitComplete()_1").onSubmitComplete(function () {  }), "Set custom onSubmitComplete() function")

});

// ---------------------------------------------------------------------------------------------------------------------

test("onValid()", function () {

    // setup
    pureForm().create("onValid()_1");

    //tests
    ok(pureForm().get("onValid()_1").onValid(function () {  }), "Set custom onValid() function")

});

// ---------------------------------------------------------------------------------------------------------------------


