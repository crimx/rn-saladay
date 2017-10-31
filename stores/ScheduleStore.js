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

import { observable, action, computed } from 'mobx'
import autobind from 'autobind-decorator'
import ScheduleItems from '../dao/schedule_items'
import { getDate, getPrevDate, getNextDate, getDateTitle } from '../dao/helpers'
import colors from '../style/colors'

const daoScheduleItems = new ScheduleItems()

export default class ScheduleStore {
  @observable schedules = observable.map()
  // plain objects for section list
  @observable sections = observable.shallowArray()

  @observable selectedSchedules = new Set()

  _isFetching = false

  constructor () {
    // reverse list for inverted SectionList
    Promise.all(
      [
        getDate(Date.now() + 24 * 3600 * 1000), // tomorrow
        getDate(Date.now()), // today
        getDate(Date.now() - 24 * 3600 * 1000) // yesterday
      ].map(this._getItemsByDate)
    ).then(action(sectionItems => this.sections.push(...sectionItems)))
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

  @action.bound
  _buildSchedule (date, items) {
    for (let i = 0; i < 48; i++) {
      this.schedules.set(date + i, {
        schedule_date: date,
        schedule_index: i,
        goal_id: null,
        goal_color: colors.grey,
        isSelected: false
      })
    }

    items && items.forEach(item => {
      item.isSelected = false
      this.schedules.set(item.schedule_date + item.schedule_index, item)
    })

    // each row has two items
    const timeRows = new Array(24)
    for (let i = 0, j = 0; i < 24; i += 1, j += 2) {
      timeRows[i] = {
        key: date + i,
        data: [date + j, date + (j + 1)]
      }
    }

    return {
      data: timeRows,
      key: date,
      title: getDateTitle(date)
    }
  }

  @action.bound
  _addPrevDate (sectionItem) {
    this.sections.push(sectionItem)
  }

  @autobind
  addPrevDate () {
    if (this._isFetching) { return }
    this._isFetching = true
    const prevDate = getPrevDate(this.sections[this.sections.length - 1].key)
    return this._getItemsByDate(prevDate)
      .then(sectionItem => {
        this._addPrevDate(sectionItem)
        this._isFetching = false
      })
  }

  @action.bound
  _addNextDate (sectionItem) {
    this.sections.unshift(sectionItem)
  }

  @autobind
  addNextDate () {
    if (this._isFetching) { return }
    const nextDate = getNextDate(this.sections[0].key)
    return this._getItemsByDate(nextDate)
      .then(sectionItem => {
        this._addNextDate(sectionItem)
        this._isFetching = false
      })
  }

  @action.bound
  toggleItemSelection (id) {
    const schedule = this.schedules.get(id)
    if (schedule.isSelected) {
      schedule.isSelected = false
      this.selectedSchedules.delete(id)
    } else {
      schedule.isSelected = true
      this.selectedSchedules.add(id)
    }
    this.schedules.set(id, schedule)
  }
}
