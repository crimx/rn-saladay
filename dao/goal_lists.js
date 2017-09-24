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
import { pickle } from './helpers'

export default class GoalLists {
  constructor (db) {
    this.db = db || SQLite.openDatabase('saladay.db')
  }

  /**
  * @param {object|object[]} data
  * @return Promse
  */
  insert (data) {
    let arr = Array.isArray(data) ? data : [data]
    let keys = ['list_id', 'list_title', 'list_color', 'list_order']
    let args = []
    pickle(arr, keys).forEach(d => args.push(...keys.map(k => d[k])))

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO goal_lists
            (list_id, list_title, list_color, list_order)
          VALUES
            ${new Array(arr.length).fill('(?, ?, ?, ?)').join(',')};`,
          args
        )
      }, reject, resolve)
    })
  }

  /**
  * @return Promse<object[]>
  */
  getAll () {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM goal_lists ORDER BY list_order`,
          [],
          (_, {rows}) => resolve(rows._array)
        )
      }, reject)
    })
  }
}
