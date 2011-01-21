pureform().assignValidatorPrototype(function () {

    /**
     * Return a new validator function with custom params.
     *
     * @param params (obj)
     *
     * @return (function)
     */
    this._create = function (params)
    {

        alert("CREAT");

    }

    /**
     *
     */
    this.validate = function ()
    {

        throw "Validator method not set for this validor. NOTE: I NEED TO HAVE THIS INCLUDE THE ACTUAL VALIDATORS NAME";


    }

});



pureform("edit_user").addFields({
    "first-name": {type: "string", submitValue: true}
});
