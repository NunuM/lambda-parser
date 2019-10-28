
const FOG_PROTO = 'fog://';

class LambdaURI {

    /**
     *
     * @param {string} protocol
     * @param {string} user
     * @param {string} countryCode
     * @param {string} project
     * @param {string} lambdaId
     * @param {number} lambdaVersion
     * @param {number} lambdaInstance
     */
    constructor(
        protocol,
        user,
        countryCode,
        project,
        lambdaId,
        lambdaVersion,
        lambdaInstance) {
        this._protocol = protocol;
        this._project = project;
        this._user = user;
        this._countryCode = countryCode;
        this._lambdaVersion = lambdaVersion;
        this._lambdaId = lambdaId;
        this._lambdaInstance = lambdaInstance;
        this._countryCode = countryCode;
    }


    get protocol() {
        return this._protocol;
    }

    get user() {
        return this._user;
    }

    get countryCode() {
        return this._countryCode;
    }

    get project() {
        return this._project;
    }

    get lambdaId() {
        return this._lambdaId;
    }

    get lambdaVersion() {
        return this._lambdaVersion;
    }

    get lambdaInstance() {
        return this._lambdaInstance;
    }

    set lambdaInstance(value) {
        this._lambdaInstance = value;
    }

    toString(){
        return `${this.protocol}${this.user}@${this.countryCode}.${this.project}.${this.lambdaId}.${this.lambdaVersion}.${this.lambdaInstance}`;
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

            const matches = uri.match(/(fog:\/\/)?(.*@.*)@([a-z]{2}_[a-z]{2})\.([a-z][a-z\-]+)\.([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})\.([0-9]+)\.?([0-9]+)?/s);

            if(!matches) {
                throw new Error("Invalid lambda URI");
            }

            let ignoreProtocol = false;

            if (!matches[1]) {
                ignoreProtocol = true;
            }

            if(!matches[7]){
                matches[7] = "1";
            }

            if (ignoreProtocol || matches.length === 8) {
                return new LambdaURI(ignoreProtocol ? FOG_PROTO : matches[1],
                    matches[2],
                    matches[3],
                    matches[4],
                    matches[5],
                    Number(matches[6]),
                    Number(matches[7]),
                )
            }
            throw new Error("Invalid lambda URI");
        }
        throw new TypeError("URI is invalid data type/length.");
    }

    /**
     * @TODO Country code
     * @param deployLambda
     * @return {LambdaURI}
     * @throws TypeError If argument is not object
     * @throws Error If object does have the methods
     */
    static parseFromLambda(deployLambda) {

        if(typeof deployLambda === 'object'){
            try {
                return new LambdaURI(FOG_PROTO,
                    deployLambda.getOwner(),
                    'pt_pt',
                    deployLambda.getProject(),
                    deployLambda.getId(),
                    deployLambda.getEtag(),
                    deployLambda.getInstanceNumber())
            } catch (e) {
                throw new Error(e.toString());
            }
        }
        throw new TypeError("URI is invalid data type.");
    }
}

module.exports = {LambdaURI};