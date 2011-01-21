module('PureForm');
test('validator', function () {
   equals(pureform().registerValidator("validator_1", (function () {})), undefined, 'registerValidator()');
   ok(pureform().isValidatorRegistered("validator_1"), 'isValidatorRegistered()');
   equals(pureform().unregisterValidator("validator_1"), undefined, 'unregisterValidator()');
   ok(!pureform().isValidatorRegistered("validator_1"), 'isValidatorRegistered()');
});

