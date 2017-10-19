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

import { observable, action } from 'mobx'
import autobind from 'autobind-decorator'
import ScheduleItems from '../dao/schedule_items'
import { getDate, getDateTitle } from '../dao/helpers'

const daoScheduleItems = new ScheduleItems()

export default class ScheduleStore {
  @observable dates = [
    getDate(Date.now() - 24 * 3600 * 1000), // yesterday
    getDate(Date.now()), // today
    getDate(Date.now() + 24 * 3600 * 1000) // tomorrow
  ].map(d => ({
    title: getDateTitle(d),
    date: d
  }))
  @observable schedules = observable.shallowMap()

  constructor () {
    this.dates.forEach(({date}) => this.getItemsByDate(date))
  }

  /**
  * @param {Date|string|number} date - Date instance or string in "YYYYDDMM" format or
  * string/number representing milliseconds elapsed since the UNIX epoch
  * @return Promse
  */
  @autobind
  getItemsByDate (date) {
    date = getDate(date)
    if (this.schedules.has(date)) {
      return this.schedules.get(date)
    }

    return daoScheduleItems.selectItemsByDate(date)
      .then(items => this._setSchedule(date, items))
  }

  @action.bound
  _setSchedule (date, items) {
    const arr48 = new Array(48)
    items.forEach(item => (arr48[item.schedule_index] = item))
    for (let i = 0; i < 48; i++) {
      if (!arr48[i]) {
        arr48[i] = {
          schedule_date: date,
          schedule_index: i,
          goal_id: null
        }
      }
    }

    const arr24 = new Array(24)
    for (let i = 0, j = 0; i < 24; i += 1, j += 2) {
      arr24[i] = [arr48[j], arr48[j + 1]]
    }

    this.schedules.set(date, arr24)
  }
}
