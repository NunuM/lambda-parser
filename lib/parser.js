const FOG_PROTO = 'fog://';

/**
 * @class
 */
class LambdaURI {

    /**
     * @constructor
     *
     * @param {string} protocol
     * @param {string} regionCountryCode
     * @param {string} project
     * @param {string} lambdaId
     * @param {string} lambdaVersion
     * @param {number} lambdaInstance
     */
    constructor(
        protocol,
        regionCountryCode,
        project,
        lambdaId,
        lambdaVersion,
        lambdaInstance) {
        this._protocol = protocol;
        this._project = project;
        this._regionCountryCode = regionCountryCode;
        this._lambdaVersion = lambdaVersion;
        this._lambdaId = lambdaId;
        this._lambdaInstance = lambdaInstance;
    }

    /**
     * Protocol
     * @return {string}
     */
    get protocol() {
        return this._protocol;
    }

    /**
     * Region country code of this lambda
     *
     * @return {string}
     */
    get regionCountryCode() {
        return this._regionCountryCode;
    }

    /**
     * Project in which this lambda belongs
     *
     * @return {string}
     */
    get project() {
        return this._project;
    }

    /**
     * Identifier of this lambda
     *
     * @return {string}
     */
    get lambdaId() {
        return this._lambdaId;
    }

    /**
     * Version of this lambda
     *
     * @return {string}
     */
    get lambdaVersion() {
        return this._lambdaVersion;
    }

    /**
     * Instance of this lambda
     *
     * @return {number}
     */
    get lambdaInstance() {
        return this._lambdaInstance;
    }

    /**
     * Define this lambda instance number
     *
     * @param {number} value
     */
    set lambdaInstance(value) {
        this._lambdaInstance = value;
    }

    /**
     * String URI representation
     *
     * @return {string}
     */
    toString() {
        return `${this.protocol}${this.project}@${this.regionCountryCode}.${this.lambdaId}.${this.lambdaVersion}.${this.lambdaInstance}`;
    }

    /**
     * @param {string} uri
     *
     * @return {LambdaURI}
     * @throws TypeError If argument is not string
     * @throws Error If is an invalid URI
     */
    static parseFromString(uri) {

        if (typeof uri === 'string'
            && uri.length > 0
            && uri.length < 255) {

            const matches = uri.match(/(fog:\/\/)?([a-z][a-z\-]+)@([a-z]{2}_[a-z]{2})\.([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})\.([a-z0-9]+)\.?([0-9]+)?/s);

            if (!matches) {
                throw new Error("Invalid lambda URI");
            }

            let ignoreProtocol = false;

            if (!matches[1]) {
                ignoreProtocol = true;
            }

            if (!matches[6]) {
                matches[6] = "1";
            }

            if (ignoreProtocol || matches.length === 7) {
                return new LambdaURI(ignoreProtocol ? FOG_PROTO : matches[1],
                    matches[3],
                    matches[2],
                    matches[4],
                    matches[5],
                    Number(matches[6])
                )
            }
            throw new Error("Invalid lambda URI");
        }
        throw new TypeError("URI is invalid data type/length.");
    }

    /**
     * Instance from lambda object
     *
     * @param {Object} lambda
     * @param {string} regionCountryCode
     * @return {LambdaURI}
     * @throws TypeError If argument is not object
     * @throws Error If object does have the methods
     */
    static parseFromLambda(lambda, regionCountryCode) {

        if (typeof lambda === 'object') {
            try {
                return new LambdaURI(FOG_PROTO,
                    regionCountryCode,
                    lambda.getProject(),
                    lambda.getId(),
                    lambda.getEtag(),
                    lambda.getInstanceNumber())
            } catch (e) {
                throw new Error(e.toString());
            }
        }
        throw new TypeError("URI is invalid data type.");
    }
}

module.exports = {LambdaURI};