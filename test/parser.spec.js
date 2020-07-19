const assert = require('assert');
const uuid = require('uuid/v4');
const {LambdaURI} = require('../index');

describe("LambdaURI", () => {
    it("Test setters", () => {
        let instance = new LambdaURI('fog://', 'se_pt', 'prj', uuid('id'), 'zzz', 2);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.regionCountryCode, 'se_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 'zzz');
        assert.equal(instance.lambdaInstance, 2);
    });

    it("Test wrong data type", () => {
        assert.throws(()=>LambdaURI.parseFromString([]), TypeError, "URI is invalid data type/length.");
    });

    it("Test wrong data type", () => {
        assert.throws(()=>LambdaURI.parseFromString("fog://pt_pt.prj.32423.zzz.1"), Error, "Invalid lambda URI");
    });


    it("Test valid URI with proto", () => {
        let id = uuid();
        let instance = LambdaURI.parseFromString("fog://prj@se_pt." + id + '.ttt.2');

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.regionCountryCode, 'se_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 'ttt');
        assert.equal(instance.lambdaInstance, 2);
    });

    it("Test valid URI without proto", () => {
        let uri = "prj@pt_pt." + uuid() + '.1.2';

        let instance = LambdaURI.parseFromString(uri);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.regionCountryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, '1');
        assert.equal(instance.lambdaInstance, 2);

        assert.equal(instance.toString(), 'fog://' + uri);
    });

    it("Test valid URI without proto and instance", () => {
        let uri = "prj@pt_pt." + uuid() + '.1';

        let instance = LambdaURI.parseFromString(uri);

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.regionCountryCode, 'pt_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, 1);
        assert.equal(instance.lambdaInstance, 1);

        assert.equal(instance.toString(), 'fog://' + uri + '.1');
    });

    it("Test valid URI from obj", () => {
        let theId = uuid();

        let instance = LambdaURI.parseFromLambda({
            getId : () => theId,
            getEtag : () => 1,
            getProject : () => 'prj',
            getInstanceNumber: () => 1 ,
        }, 'se_pt');

        assert.equal(instance.protocol, 'fog://');
        assert.equal(instance.regionCountryCode, 'se_pt');
        assert.equal(instance.project, 'prj');
        assert.equal(instance.lambdaVersion, '1');
        assert.equal(instance.lambdaInstance, 1);

    });

});

