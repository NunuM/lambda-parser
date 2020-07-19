## Talos lambda Uniform Resource Identifier spec


This lib implements a new URI spec for fog protocol.


### Format

protocol://project@regionCountryCode.lambdaIdentifier.[lambdaVersion.lambdaInstance]


### Spec:

protocol : `'fog'`

project : `[a-z][a-z\-]+ `

regionCountryCode : `[a-z]{2}_[a-z]{2}`

lambdaIdentifier : `[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}`

lambdaVersion : `[a-z0-9]+`

lambdaInstance : `[0-9]+`

### Example:

fog://calculator@se_pt.123e4567-e89b-12d3-a456-426655440000.latest.1