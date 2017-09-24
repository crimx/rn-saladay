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

export default class Configs {
  constructor (db) {
    this.db = db || SQLite.openDatabase('saladay.db')
  }

  /**
   * @return Promise<config> A promsie with the APP config
   */
  get () {
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
              this.set(defaultConfig)
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
  set (config) {
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
