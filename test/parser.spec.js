const assert = require('assert');
const uuid = require('uuid/v4');
const {LambdaURI} = require('../index');

describe("LambdaURI", () => {
    it("Test setters", () => {
        let instance = new LambdaURI('fog://', 'user', 'pt_pt', 'prj', uuid('id'), 1, 2);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.user, 'user');
        assert.equal(instance.countryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 2);
    });

    it("Test wrong data type", () => {
        assert.throws(()=>LambdaURI.parseFromString([]), TypeError, "URI is invalid data type/length.");
    });

    it("Test wrong data type", () => {
        assert.throws(()=>LambdaURI.parseFromString("fog://pt_pt.prj.32423.1.1"), Error, "Invalid lambda URI");
    });


    it("Test valid URI with proto", () => {
        let id = uuid();
        let instance = LambdaURI.parseFromString("fog://nuno@nunum.me@pt_pt.prj." + id + '.1.2');

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.user, 'nuno@nunum.me');
        assert.equal(instance.countryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 2);
    });

    it("Test valid URI without proto", () => {
        let uri = "nuno@nunum.me@pt_pt.prj." + uuid() + '.1.2';

        let instance = LambdaURI.parseFromString(uri);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.user, 'nuno@nunum.me');
        assert.equal(instance.countryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 2);

        assert.equal(instance.toString(), 'fog://' + uri);
    });

    it("Test valid URI without proto and instance", () => {
        let uri = "nuno@nunum.me@pt_pt.prj." + uuid() + '.1';

        let instance = LambdaURI.parseFromString(uri);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.user, 'nuno@nunum.me');
        assert.equal(instance.countryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 1);

        assert.equal(instance.toString(), 'fog://' + uri + '.1');
    });

    it("Test valid URI from obj", () => {
        let theId = uuid();

        let instance = LambdaURI.parseFromLambda({
            getId : () => theId,
            getOwner : () => 'nuno@nunum.me',
            getEtag : () => 1,
            getProject : () => 'prj'
        });

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.user, 'nuno@nunum.me');
        assert.equal(instance.countryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 1);

    });

});

