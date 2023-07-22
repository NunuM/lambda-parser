import {LambdaURI} from "../lib";
import {v4 as uuid} from 'uuid';

describe("LambdaURI", () => {
    test("Test setters", () => {
        let instance = new LambdaURI('fog://', 'se_pt', 'prj', uuid(), 'zzz', 2);

        expect(instance.protocol).toBe('fog://');
        expect(instance.regionCountryCode).toBe('se_pt');
        expect(instance.project).toBe('prj');
        expect(instance.lambdaVersion).toBe('zzz');
        expect(instance.lambdaInstance).toBe(2);
    });

    test("Test wrong data type", () => {
        expect(() => LambdaURI.parseFromString("")).toThrow(TypeError);
    });

    test("Test wrong data type", () => {
        expect(() => LambdaURI.parseFromString("fog://pt_pt.prj.32423.zzz.1")).toThrow(Error);
    });

    test("Test wrong format", () => {
        expect(() => LambdaURI.parseFromString("fog://prj@")).toThrow(Error);
    });

    test("Test valid URI with proto", () => {
        let id = uuid();
        let instance = LambdaURI.parseFromString("fog://prj@se_pt." + id + '.ttt.2');

        expect(instance.protocol).toBe('fog://');
        expect(instance.regionCountryCode).toBe('se_pt');
        expect(instance.project).toBe('prj');
        expect(instance.lambdaVersion).toBe('ttt');
        expect(instance.lambdaInstance).toBe(2);
    });

    test("Test valid URI without proto", () => {
        let uri = "prj@pt_pt." + uuid() + '.1.2';

        let instance = LambdaURI.parseFromString(uri);

        expect(instance.protocol).toBe('fog://');
        expect(instance.regionCountryCode).toBe('pt_pt');
        expect(instance.project).toBe('prj');
        expect(instance.lambdaVersion).toBe('1');
        expect(instance.lambdaInstance).toBe(2);

        expect(instance.toString()).toBe('fog://' + uri);
    });

    test("Test valid URI without proto and instance", () => {
        let uri = "prj@pt_pt." + uuid() + '.1';

        let instance = LambdaURI.parseFromString(uri);

        expect(instance.protocol).toBe('fog://');
        expect(instance.regionCountryCode).toBe('pt_pt');
        expect(instance.project).toBe('prj');
        expect(instance.lambdaVersion).toBe("1");
        expect(instance.lambdaInstance).toBe(Number.MAX_VALUE);

        expect(instance.toString()).toBe('fog://' + uri + '.*');
    });

    test("Test valid URI from obj", () => {
        let theId = uuid();

        let instance = LambdaURI.parseFromLambda({
            getId: () => theId,
            getEtag: () => '999',
            getProject: () => 'prj',
            getInstanceNumber: () => 1,
        }, 'se_pt');

        expect(instance.protocol).toBe('fog://');
        expect(instance.regionCountryCode).toBe('se_pt');
        expect(instance.project).toBe('prj');
        expect(instance.lambdaVersion).toBe('999');
        expect(instance.lambdaInstance).toBe(1);

    });


    test('match same uris', () => {

        const lambdaURI = new LambdaURI('fog://', 'se_pt', 'test', '11111', '2', 2);

        expect(lambdaURI.match(lambdaURI)).toBe(true);

    })


    test('test wild cards instance for same lambda id', () => {
        const lambdaURI = new LambdaURI('fog://', 'se_pt', 'test', '11111', '2', 2);

        const allLambdaInstances = LambdaURI.allLambdaInstances('se_pt', 'test', '11111', '2');

        expect(lambdaURI.match(allLambdaInstances)).toBe(true);

        const toAllLambdaVersions = allLambdaInstances.toAllLambdaVersions();

        expect(lambdaURI.match(toAllLambdaVersions)).toBe(true);

        const toAllLambdas = allLambdaInstances.toAllLambdas();

        expect(lambdaURI.match(toAllLambdas)).toBe(true);
    })

    test('test wild cards instance for different lambda id', () => {
        const lambdaURI = new LambdaURI('fog://', 'se_pt', 'test', '2222', '2', 2);

        const allLambdaInstances = LambdaURI.allLambdaInstances('se_pt', 'test', '3333', '2');

        expect(lambdaURI.match(allLambdaInstances)).toBe(false);

        const toAllLambdaVersions = allLambdaInstances.toAllLambdaVersions();

        expect(lambdaURI.match(toAllLambdaVersions)).toBe(false);

        const toAllLambdas = allLambdaInstances.toAllLambdas();

        expect(lambdaURI.match(toAllLambdas)).toBe(true);
    })



});

