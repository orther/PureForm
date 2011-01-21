pureform().registerValidator("float", (function () {

    var param_defaults = {
        "min": null,
        "max": null
    };

    /**
     *
     */
    function setup (params)
    {

    }

    function validate (response)
    {

        return response;

    }

    return (function () {

        return {
            "setup": setup,
        };

    });

})());
