module("PureForm");
test("create()", function () {
    ok(pureForm().create("create()_1"), "Create test_form");
    raises(function () { pureForm().create("create()_2"); pureForm().create("create()_2"); }, "Throw error on attempt to create test_form when it already exists");

});

test("get()", function () {
    equal(pureForm().create("get()_1"), pureForm().get("get()_1"), "Create form and get it.");
    raises(function () { pureForm().get("get()_2"); }, "Throw error on attempt to get test_form when it already exists");
});
