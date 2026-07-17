// config.js
import pkg from './package.json' with { type: 'json' };
export default { prefix: '%', sessionPath: './buuSession', name: pkg.name, buuTeam: pkg.author, version: pkg.version, info: pkg.description, loggerLevel: 'info', browserInfo: 'Ubuntu', browserBla: 'Chrome', browserVersion: '20.0.04', useQrCodeSmall: true, useBidMapping: true, sessionUserBidPath: './buuUsers', freshMappedUser: './unknown', dsgvoAcceptOnlyUser: './dsgvo/accept', dsgvoRejectOnlyUser: './dsgvo/reject', verifyOnlyUser: './verify/accept', rejectOnlyUser: './verify/reject', useRecursive: true, useForce: true }
