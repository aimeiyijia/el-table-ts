import { isMobilephone, isTelephone, isIdCard, isBankCard, isEmail } from './is'
import {
  maskMobilephone,
  maskTelephone,
  maskIdCard,
  maskBankCard,
  maskEmail
} from './mask'

const maskMap = new Map()
maskMap.set(isMobilephone, maskMobilephone)
maskMap.set(isTelephone, maskTelephone)
maskMap.set(isIdCard, maskIdCard)
maskMap.set(isBankCard, maskBankCard)
maskMap.set(isEmail, maskEmail)

// 判断类型并返回脱敏后的数据
export function judgeAndMask(value: string) {
  for (const [keyFn, valueFn] of maskMap) {
    if (keyFn(value)) {
      return valueFn(value)
    }
  }
  return value
}
