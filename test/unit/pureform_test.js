TestCase("PureForm", {
    setUp: function () {
        this.form = pureForm().addForm("test_form");
    },

    "test created form": function () {
        assertObject(this.form);
    },

    "test addField": function () {
        assertNoException(this.form.addField("first_name", {type: "string", name: "First Name"}));
    }

});

