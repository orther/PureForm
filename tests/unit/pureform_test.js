var test_form = null;

module("PureForm");
test("create()", function () {
    ok(function () { return pureForm().create("test_form"); }, "Create test_form");
    raises(function () { pureForm().create("test_form"); pureForm().create("test_form"); }, "Throw error on attempt to create test_form when it already exists");

});

test("get()", function () {
   same(pureForm().create("test_form"), pureForm().get("test_form"), "Get test_form");
});

