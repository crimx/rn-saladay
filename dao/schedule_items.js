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

import { SQLite } from 'expo'
import { getDate } from './helpers'

export default class ScheduleItems {
  constructor (db) {
    this.db = db || SQLite.openDatabase('saladay.db')
  }

  /**
  * @param {object|object[]} data
  * @return Promse
  */
  replace (data) {
    let arr = Array.isArray(data) ? data : [data]

    const keys = [
      'schedule_date',
      'schedule_index',
      'goal_id'
    ]

    const sql = (
      `REPLACE INTO schedule_items
        (${keys.join(',')})
      VALUES
        (${Array(keys.length).fill('?').join(',')});`
    )

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        arr.forEach(d => {
          tx.executeSql(
            sql,
            keys.map(k => d[k])
          )
        })
      }, reject, resolve)
    })
  }

  /**
  * @param {object|object[]} data
  * @return Promse
  */
  remove (data) {
    let arr = Array.isArray(data) ? data : [data]

    const sql = (
      `DELETE FROM schedule_items
      WHERE schedule_date = ? AND schedule_index = ?;`
    )

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        arr.forEach(d => {
          tx.executeSql(
            sql,
            [d.schedule_date, d.schedule_index]
          )
        })
      }, reject, resolve)
    })
  }

  /**
  * @param {Date|string|number} time - Date instance or string in "YYYYDDMM" format or
  * string/number representing milliseconds elapsed since the UNIX epoch
  * @return Promse with an array of items
  */
  selectItemsByDate (time) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT
            schedule_date, schedule_index, goal_date, goal_color, goal_title
          FROM
            schedule_items
          INNER JOIN
            goal_items
          ON
          goal_items.goal_date = schedule_items.goal_id
          WHERE
            schedule_date = ?
          ORDER BY
            schedule_index`,
          [getDate(time)],
          (_, {rows}) => resolve(rows._array)
        )
      }, reject, resolve)
    })
  }
}
