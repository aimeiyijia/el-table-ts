import SelectTreeBase from './select-tree/index'
import AutocompleteBase from './autocomplete'
import CascaderBase from './cascader'
import CascaderPanelBase from './cascader-panel'
import CheckBoxBase from './check-box'
import ColorPickerBase from './color-picker'
import DatePickerBase from './date-picker'
import DateTimePickerBase from './date-time-picker'
import InputNumberBase from './input-number'
import InputBase from './input'
import RadioBase from './radio'
import RateBase from './rate'
import SelectBase from './select'
import SliderBase from './slider'
import SwitchBase from './switch'
import TimePickerBase from './time-picker'
import TimeSelectrBase from './time-select'
import TransferBase from './transfer'
import TreeBase from './tree'
import UploadBase from './upload'
import { VueConstructor } from 'vue/types/umd'

const ElFormTypes = {
  SelectTree: SelectTreeBase,
  Autocomplete: AutocompleteBase,
  Cascader: CascaderBase,
  CascaderPanel: CascaderPanelBase,
  CheckBox: CheckBoxBase,
  ColorPicker: ColorPickerBase,
  DatePicker: DatePickerBase,
  DateTimePicker: DateTimePickerBase,
  InputNumber: InputNumberBase,
  Input: InputBase,
  Radio: RadioBase,
  Rate: RateBase,
  Select: SelectBase,
  Slider: SliderBase,
  Switch: SwitchBase,
  TimePicker: TimePickerBase,
  TimeSelect: TimeSelectrBase,
  Transfer: TransferBase,
  Tree: TreeBase,
  Upload: UploadBase,
}

export type ElFormType = {
  [key: string]: VueConstructor
}

export default ElFormTypes
