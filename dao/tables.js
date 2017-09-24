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

export default class Tables {
  constructor (db) {
    this.db = db
  }

  /**
   * @return Promise
   */
  init () {
    const queries = [
      `CREATE TABLE IF NOT EXISTS configs (
        config_key TEXT NOT NULL,
        config_value TEXT NOT NULL,
        config_version INT NOT NULL,
        PRIMARY KEY(config_key, config_version)
      );`,
      `CREATE TABLE IF NOT EXISTS goal_lists (
        list_id TEXT PRIMARY KEY,
        list_title TEXT NOT NULL,
        list_color TEXT NOT NULL,
        list_order INT NOT NULL,

        CONSTRAINT list_order_unique UNIQUE (list_order)
      );`,
      `CREATE TABLE IF NOT EXISTS goal_items (
        goal_date TEXT PRIMARY KEY,
        goal_title TEXT NOT NULL,
        goal_note TEXT,
        goal_steps TEXT,
        goal_color TEXT,
        goal_done INT NOT NULL,
        goal_due INT,
        goal_order INT NOT NULL,
        list_id INT NOT NULL,

        FOREIGN KEY (list_id) REFERENCES goal_lists(list_id)
      );`,
      `CREATE TABLE IF NOT EXISTS schedule_items (
        schedule_date TEXT PRIMARY KEY,
        schedule_index INT NOT NULL,
        goal_id INT,

        FOREIGN KEY (goal_id) REFERENCES goal_items(goal_date)
      );`
    ]

    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        queries.forEach(q => {
          tx.executeSql(q, [])
        })
      }, reject, resolve)
    })
  }

  /**
   * @return Promise<string[]> A promise with all the table names
   */
  list () {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `SELECT name FROM sqlite_master WHERE type='table'`,
          [],
          (_, {rows}) => resolve(rows._array.map(r => r.name))
        )
      }, reject, resolve)
    })
  }

  /**
  * @return Promse
  */
  drop () {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        ['configs', 'goal_items', 'goal_lists', 'schedule_items']
          .forEach(table => tx.executeSql(`DROP TABLE IF EXISTS ${table}`))
      }, reject, resolve)
    })
  }
}
