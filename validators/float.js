pureform().registerValidator("float", (function () {

    /**
     * Validate value to be a float.
     *
     * @param value (boolean)
     *
     * @return (boolean)
     */
    this.validate = function (value)
    {

        alert("VALIDATE");
        return value === true;

    }

})());
