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

import { observable, action, autorun } from 'mobx'
import Configs from '../dao/configs'

const daoConfigs = new Configs()

export default class AppConfigs {
  @observable config = {}
  _first = true

  get () {
    return daoConfigs.get()
      .then(action(config => {
        this.config = config
        if (this._first) {
          this._first = false
          autorun(() => this.set())
        }
      }))
  }

  set () {
    __DEV__ && console.log('LOG: Config saved')
    return daoConfigs.set(JSON.stringify(this.config))
  }
}
