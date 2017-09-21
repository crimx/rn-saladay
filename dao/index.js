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
import defaultConfig from '../appconfig.json'

export default class Database {
  constructor () {
    this.db = SQLite.openDatabase('saladay.db')
    console.log('Database')
  }

  init () {
    return this.initTables()
  }

  /**
   * @return Promise
   */
  initTables () {
    const queries = [
      `CREATE TABLE IF NOT EXISTS configs (
        config_key TEXT NOT NULL,
        config_value TEXT NOT NULL,
        config_version INT NOT NULL,
        PRIMARY KEY(config_key, config_version)
      );`,
      `CREATE TABLE IF NOT EXISTS goal_lists (
        list_id INT PRIMARY KEY,
        list_title TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS goal_items (
        goal_date INT PRIMARY KEY,
        goal_title TEXT NOT NULL,
        goal_note TEXT,
        goal_color TEXT NOT NULL,
        goal_done INT NOT NULL,
        due INT,
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
   * @return Promise<config> A promsie with the APP config
   */
  getConfig () {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(`
          SELECT config_value
          FROM configs
          WHERE config_key = "app"
          ORDER BY config_version DESC
          LIMIT 1;`,
          [],
          (_, {rows}) => {
            let result = defaultConfig
            if (rows.length < 1) {
              this.setConfig(defaultConfig)
            } else {
              try {
                result = JSON.parse(rows.item(0).config_value)
              } catch (err) {
                return reject('Error getConfig: ' + err.toString())
              }
            }
            resolve(result)
          }
        )
      }, reject)
    })
  }

  /**
   * @param {object} config - serializable
   * @return Promse
   */
  setConfig (config) {
    return new Promise((resolve, reject) => {
      try {
        var configStr = JSON.stringify(config)
      } catch (err) {
        return reject('Error setConfig: ' + err.toString())
      }
      this.db.transaction(tx => {
        tx.executeSql(`
          REPLACE INTO configs (config_key, config_value, config_version)
          VALUES ("app", ?, ?)
          `,
          [configStr, config.version || 0]
        )
      }, reject, resolve)
    })
  }
}
