export const FOG_PROTO = 'fog://';


const WILD_CARD: string = '*';

const ALL_INSTANCES: number = Number.MAX_VALUE;
const ALL_VERSIONS: string = WILD_CARD;
const ALL_LAMBDAS: string = WILD_CARD;


/**
 * @class
 */
export class LambdaURI {

    /**
     * @constructor
     * @param {string} _protocol
     * @param {string} _regionCountryCode
     * @param {string} _project
     * @param {string} _lambdaId
     * @param {string} _lambdaVersion
     * @param {number} _lambdaInstance
     */
    constructor(
        private readonly _protocol: string,
        private readonly _regionCountryCode: string,
        private readonly _project: string,
        private readonly _lambdaId: string,
        private readonly _lambdaVersion: string,
        private _lambdaInstance: number) {
    }

    /**
     * Protocol
     * @return {string}
     */
    get protocol(): string {
        return this._protocol;
    }

    /**
     * Region country code of this lambda
     *
     * @return {string}
     */
    get regionCountryCode(): string {
        return this._regionCountryCode;
    }

    /**
     * Project in which this lambda belongs
     *
     * @return {string}
     */
    get project(): string {
        return this._project;
    }

    /**
     * Identifier of this lambda
     *
     * @return {string}
     */
    get lambdaId(): string {
        return this._lambdaId;
    }

    /**
     * Version of this lambda
     *
     * @return {string}
     */
    get lambdaVersion(): string {
        return this._lambdaVersion;
    }

    /**
     * Instance of this lambda
     *
     * @return {number}
     */
    get lambdaInstance(): number {
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
     * Check if is the same project
     * @param {LambdaURI} other
     * @return {boolean}
     */
    isSameProject(other: LambdaURI): boolean {
        return this._project === other._project;
    }

    /**
     * Check if is the same lambda
     * @param {LambdaURI} other
     * @return {boolean}
     */
    isSameLambda(other: LambdaURI): boolean {
        return this.isSameProject(other) && this._lambdaId === other._lambdaId;
    }

    /**
     * Check if is the same lambda version
     * @param {LambdaURI} other
     * @return {boolean}
     */
    isSameLambdaVersion(other: LambdaURI): boolean {
        return this.isSameLambda(other) && this._lambdaVersion === other._lambdaVersion;
    }

    /**
     * Check if is the same lambda instance
     * @param {LambdaURI} other
     * @return {boolean}
     */
    isSameLambdaInstance(other: LambdaURI): boolean {
        return this.isSameLambdaVersion(other) && this._lambdaInstance === other._lambdaInstance;
    }

    /**
     * Verify if this URI's refers to lambda IDs wild card
     * @return {boolean}
     */
    isToAllLambdas(): boolean {
        return this.lambdaId === ALL_LAMBDAS;
    }

    /**
     * Verify if this URI's refers to lambda version wild card
     * @return {boolean}
     */
    isToAllLambdaVersions(): boolean {
        return this.lambdaVersion === ALL_VERSIONS;
    }

    /**
     * Verify if this URI's refers to lambda instance wild card
     * @return {boolean}
     */
    isToAllLambdaInstances(): boolean {
        return this.lambdaInstance === ALL_INSTANCES;
    }

    /**
     * String URI representation
     *
     * @return {string}
     */
    toString() {
        return `${this.protocol}${this.project}@${this.regionCountryCode}.${this.lambdaId}.${this.lambdaVersion}.${this.isToAllLambdaInstances() ? WILD_CARD : this.lambdaInstance}`;
    }

    /**
     * Create a new URI matching all lambdas
     * @return {LambdaURI}
     */
    toAllLambdas(): LambdaURI {
        return LambdaURI.allLambdas(this.regionCountryCode, this.project);
    }

    /**
     * Create a new URI matching all lambda versions
     * @return {LambdaURI}
     */
    toAllLambdaVersions(): LambdaURI {
        return LambdaURI.allLambdaVersions(this.regionCountryCode, this.project, this.lambdaId);
    }

    /**
     * Create a new URI matching all lambda instances
     * @return {LambdaURI}
     */
    toAllLambdaInstances(): LambdaURI {
        return LambdaURI.allLambdaInstances(this.regionCountryCode, this.project, this.lambdaId, this.lambdaVersion);
    }

    /**
     * Match other lambdaURI with this
     * @param {LambdaURI} other
     * @return {boolean}
     */
    match(other: LambdaURI): boolean {

        if (!this.isSameProject(other)) {
            return false;
        }

        if (!this.isSameLambda(other)) {
            return other.isToAllLambdas();
        }

        if (!this.isSameLambdaVersion(other)) {
            return other.isToAllLambdaVersions();
        }

        if (!this.isSameLambdaInstance(other)) {
            return other.isToAllLambdaInstances();
        }

        return true;
    }

    /**
     * Create a new URI matching all lambdas
     * @param {string} regionCountryCode
     * @param {string} project
     * @return {LambdaURI}
     */
    static allLambdas(regionCountryCode: string, project: string): LambdaURI {
        return new LambdaURI(
            FOG_PROTO,
            regionCountryCode,
            project,
            ALL_LAMBDAS,
            ALL_VERSIONS,
            ALL_INSTANCES
        );
    }

    /**
     * Create a new URI matching all lambda versions
     * @param {string} regionCountryCode
     * @param {string} project
     * @param {string} lambdaId
     * @return {LambdaURI}
     */
    static allLambdaVersions(regionCountryCode: string, project: string, lambdaId: string): LambdaURI {
        return new LambdaURI(
            FOG_PROTO,
            regionCountryCode,
            project,
            lambdaId,
            ALL_VERSIONS,
            ALL_INSTANCES
        );
    }

    /**
     * Create a new URI matching all lambda instances
     * @param {string} regionCountryCode
     * @param {string} project
     * @param {string} lambdaId
     * @param {string} lambdaVersion
     * @return {LambdaURI}
     */
    static allLambdaInstances(regionCountryCode: string, project: string, lambdaId: string, lambdaVersion: string): LambdaURI {
        return new LambdaURI(
            FOG_PROTO,
            regionCountryCode,
            project,
            lambdaId,
            lambdaVersion,
            ALL_INSTANCES
        );
    }

    /**
     * @param {string} uri
     *
     * @return {LambdaURI}
     * @throws TypeError If argument is not string
     * @throws Error If is an invalid URI
     */
    static parseFromString(uri: string): LambdaURI {

        if (typeof uri === 'string'
            && uri.length > 0
            && uri.length < 255) {

            let proto = '';

            if (uri.startsWith(FOG_PROTO)) {
                proto = uri.substring(0, FOG_PROTO.length);
            }

            const idx = uri.indexOf("@", proto.length);

            if (idx < 0) {
                throw new Error("Invalid lambda URI");
            }

            const project = uri.substring(proto.length, idx);

            const [region, id, version, instance] = uri.substring(idx + 1).split(".");

            if (region && project) {

                return new LambdaURI(
                    FOG_PROTO,
                    region,
                    project,
                    id || ALL_LAMBDAS,
                    version || ALL_VERSIONS,
                    Number((instance && instance != WILD_CARD) ? instance : ALL_INSTANCES));
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
    static parseFromLambda(lambda: any, regionCountryCode: string): LambdaURI {

        if (typeof lambda === 'object') {
            try {
                return new LambdaURI(FOG_PROTO,
                    regionCountryCode,
                    lambda.getProject(),
                    lambda.getId(),
                    lambda.getEtag(),
                    lambda.getInstanceNumber())
            } catch (e: any) {
                throw new Error(e.toString());
            }
        }
        throw new TypeError("URI is invalid data type.");
    }
}
