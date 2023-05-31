/**
 * @description 手机号码脱敏
 * @param {string} phone 13812345678
 * @return {string} 脱敏后的手机号码 138****5678
 */
export declare function maskMobilephone(phone: string): string;
/**
 * @description 座机电话号码脱敏
 * @param {string} phone 010-12345678
 * @return {string} 脱敏后的手机号码 010****5678
 */
export declare function maskTelephone(phone: string): string;
/**
 * @description 身份证号脱敏
 * @param {string} idCard 440103199001011234
 * @return {string} 脱敏后的身份证号 440103****1234
 */
export declare function maskIdCard(idCard: string): string;
/**
 * @description 银行卡号脱敏
 * @param {string} bankCard 6222021234561234567
 * @return {string} 脱敏后的银行卡号 622202******4567
 */
export declare function maskBankCard(bankCard: string): string;
/**
 * @description 邮箱脱敏
 * @param {string} bankCard abc123@qq.com
 * @return {string} 脱敏后的邮箱 ab****3@qq.com
 */
export declare function maskEmail(email: string): string;
