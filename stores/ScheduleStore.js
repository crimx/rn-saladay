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
import { getDate, getPrevDate, getNextDate, getDateTitle } from '../dao/helpers'

const daoScheduleItems = new ScheduleItems()

export default class ScheduleStore {
  @observable.shallow schedules = observable.shallowArray()

  isFetching = false

  constructor () {
    // reverse list for inverted SectionList
    Promise.all(
      [
        getDate(Date.now() + 24 * 3600 * 1000), // tomorrow
        getDate(Date.now()), // today
        getDate(Date.now() - 24 * 3600 * 1000) // yesterday
      ].map(this._getItemsByDate)
    ).then(action(schedules => (this.schedules = schedules)))
  }

  /**
  * @param {Date|string|number} date - Date instance or string in "YYYYDDMM" format or
  * string/number representing milliseconds elapsed since the UNIX epoch
  * @return Promse with schedle object
  */
  @autobind
  _getItemsByDate (date) {
    date = getDate(date)
    return daoScheduleItems.selectItemsByDate(date)
      .then(items => this._buildSchedule(date, items))
  }

  @autobind
  _buildSchedule (date, items) {
    const timeItems = new Array(48)
    items && items.forEach(item => (timeItems[item.schedule_index] = item))
    for (let i = 0; i < 48; i++) {
      if (!timeItems[i]) {
        timeItems[i] = {
          schedule_date: date,
          schedule_index: i,
          goal_id: null,
          isSelected: false
        }
      }
    }

    // each row has two items
    const timeRows = new Array(24)
    for (let i = 0, j = 0; i < 24; i += 1, j += 2) {
      timeRows[i] = {
        key: timeItems[j].schedule_date + timeItems[j].schedule_index,
        data: [timeItems[j], timeItems[j + 1]]
      }
    }

    return {
      data: timeRows,
      key: date,
      title: getDateTitle(date)
    }
  }

  @action.bound
  _addPrevDate (schedule) {
    this.schedules.push(schedule)
  }

  @autobind
  addPrevDate () {
    if (this.isFetching) { return }
    this.isFetching = true
    const prevDate = getPrevDate(this.schedules[this.schedules.length - 1].key)
    return this._getItemsByDate(prevDate)
      .then(schedule => {
        this._addPrevDate(schedule)
        this.isFetching = false
        return this.schedules[this.schedules.length - 1]
      })
  }

  @action.bound
  _addNextDate (schedule) {
    this.schedules.unshift(schedule)
  }

  @autobind
  addNextDate () {
    if (this.isFetching) { return }
    const nextDate = getNextDate(this.schedules[0].key)
    return this._getItemsByDate(nextDate)
      .then(schedule => {
        this._addNextDate(schedule)
        this.isFetching = false
        return this.schedules[0]
      })
  }
}
