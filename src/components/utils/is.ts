// 是否手机号
export function isMobilephone(mobilephoneNum: string) {
  const regExp =
    /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[89])\d{8}$/
  return regExp.test(mobilephoneNum)
}
// 是否固定电话
export function isTelephone(telephoneNum: string) {
  const regExp = /^0\d{2,3}-?\d{7,8}$/
  return regExp.test(telephoneNum)
}
// 是否身份证号
export function isIdCard(idCard: string) {
  const regExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return regExp.test(idCard)
}
// 是否银行卡
export function isBankCard(bankCard: string) {
  const regExp = /^([1-9])(\d{14}|\d{18})$/
  return regExp.test(bankCard)
}
// 是否邮箱
export function isEmail(email: string) {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return regex.test(email)
}
