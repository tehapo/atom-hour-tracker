'use babel'

export function zeroPad(number) {
  return number < 10 ? '0' + number : number
}

export function round(hours) {
  return hours.toFixed(2)
}
