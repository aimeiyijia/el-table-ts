/**
 * @description 手机号码脱敏
 * @param {string} phone 13812345678
 * @return {string} 脱敏后的手机号码 138****5678
 */
export function maskMobilephone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * @description 座机电话号码脱敏
 * @param {string} phone 010-12345678
 * @return {string} 脱敏后的手机号码 010****5678
 */
export function maskTelephone(phone: string): string {
  return phone
    .replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    .replace(/-(?=\d{4})/, '')
}

/**
 * @description 身份证号脱敏
 * @param {string} idCard 440103199001011234
 * @return {string} 脱敏后的身份证号 440103****1234
 */
export function maskIdCard(idCard: string): string {
  const reg = /(\d{6})\d{8}(\d{4})/
  return idCard.replace(reg, '$1****$2')
}

/**
 * @description 银行卡号脱敏
 * @param {string} bankCard 6222021234561234567
 * @return {string} 脱敏后的银行卡号 622202******4567
 */
export function maskBankCard(bankCard: string): string {
  const reg = /(\d{6})\d{6}(\d{4})/
  return bankCard.replace(reg, '$1****$2')
}

/**
 * @description 邮箱脱敏
 * @param {string} bankCard abc123@qq.com
 * @return {string} 脱敏后的邮箱 ab****3@qq.com
 */
export function maskEmail(email: string): string {
  return email.replace(/^(.{2}).*?(\w)@(.+)$/, '$1****$2@$3')
}
