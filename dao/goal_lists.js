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
    const keys = ['list_id', 'list_title', 'list_color', 'list_order']

    const sql = (
      `INSERT INTO goal_lists
        (${keys.join(',')})
      VALUES
        (${Array(keys.length).fill('?').join(',')});`
    )

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        pickle(arr, keys).forEach(d => {
          tx.executeSql(
            sql,
            keys.map(k => d[k])
          )
        })
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

  update (listItem) {
    return new Promise((resolve, reject) => {
      if (!listItem.list_id) { return reject('updateListItem: Missing PK list_id') }

      let keys = [
        'list_title',
        'list_color',
        'list_order'
      ].filter(k => listItem[k] !== undefined)

      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE goal_lists
          SET ${keys.map(k => k + ' = ?').join(',')}
          WHERE list_id = ?`,
          [...keys.map(k => listItem[k]), listItem.list_id]
        )
      }, reject, resolve)
    })
  }
}
