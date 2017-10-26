/*
 * This file is part of Saladay <https://www.crimx.com/rn-saladay/>.
 * Copyright (C) 2017 CRIMX <straybugs@gmail.com>
 *
 * Saladay is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Saladay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Saladay.  If not, see <http://www.gnu.org/licenses/>.
 */

import moment from 'moment'

/**
 * JSON.stringfy object properties and coerce boolean properties to number
 * @param {object|object[]} data - data object or an array of data objects
 * @param {string[]} keys
 * @return object[]
 */
export function pickle (data, keys) {
  const isArray = Array.isArray(data)
  const arr = isArray ? data : [data]
  const result = arr.map(data =>
    keys.reduce((newData, k) => {
      if (/^(string|number)$/.test(typeof data[k])) {
        newData[k] = data[k]
      } else if (typeof data[k] === 'boolean') {
        newData[k] = Number(data[k])
      } else if (data[k] == null) {
        newData[k] = ''
      } else if (typeof data[k] === 'object') {
        newData[k] = JSON.stringify(data[k])
      } else {
        newData[k] = String(data[k])
      }
      return newData
    }, {})
  )
  return isArray ? result : result[0]
}

/**
 * @param {Date|string|number} time - Date instance or string in "YYYYDDMM" format or
 * string/number representing milliseconds elapsed since the UNIX epoch
 * @return {string} date in "YYYYMMDD" format
 */
export function getDate (time) {
  if (typeof time === 'string') {
    if (time.length === 8) {
      return time
    } else {
      time = Number(time)
    }
  }

  return moment(time).format('YYYYMMDD')
}

/**
 * @param {string} date in "YYYYMMDD" format
 * @return {string} next date in "YYYYMMDD" format
 */
export function getNextDate (date) {
  return moment(date, 'YYYYMMDD').add(1, 'd').format('YYYYMMDD')
}

/**
 * @param {string} date in "YYYYMMDD" format
 * @return {string} previous date in "YYYYMMDD" format
 */
export function getPrevDate (date) {
  return moment(date, 'YYYYMMDD').subtract(1, 'd').format('YYYYMMDD')
}

/**
 * @param {string} date in "YYYYMMDD" format
 * @return {string} date in "MMMM Do YYYY - dddd" format
 */
export function getDateTitle (date) {
  return moment(date, 'YYYYMMDD').format('MMMM Do YYYY - dddd')
}

export default {
  pickle,
  getDate,
  getDateTitle
}
