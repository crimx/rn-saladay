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

import Tables from './tables'
import GoalLists from './goal_lists'
import GoalItems from './goal_items'
import ScheduleItems from './schedule_items'

import { getDate } from './helpers'

export default class Dao {
  constructor () {
    this.isFresh = false
    this.db = SQLite.openDatabase('saladay.db')
  }

  init () {
    let tables = new Tables(this.db)
    return tables.drop()
      .then(() => tables.list())
    // return tables.list()
      .then(tbs => {
        if (tbs.indexOf('configs') === -1) {
          this.isFresh = true
        }
      })
      .then(() => tables.init())
      .then(() => this.isFresh && this.initData())
      .catch(err => console.error(err))
  }

  /**
   * Insert default data
   * @return Promise
   */
  initData () {
    const goalListsData = [
      {
        list_id: '1506167013325',
        list_title: 'Family',
        list_color: '#f64747',
        list_order: 0
      },
      {
        list_id: '1506167013326',
        list_title: 'Health',
        list_color: '#2abb9b',
        list_order: 1
      },
      {
        list_id: '1506167013327',
        list_title: 'Reading',
        list_color: '#3a539b',
        list_order: 2
      }
    ]

    const goalItemsData = [
      {
        goal_date: '1506275781528',
        goal_title: 'Call mom',
        goal_color: '#f64747',
        goal_order: 0,
        list_id: '1506167013325'
      },
      {
        goal_date: '1506275781529',
        goal_title: 'Work out',
        goal_color: '#16a085',
        goal_order: 0,
        list_id: '1506167013326'
      },
      {
        goal_date: '1506275781530',
        goal_title: 'Jogging',
        goal_color: '#3fc380',
        goal_order: 1,
        list_id: '1506167013326'
      }
    ]

    const today = getDate(Date.now())
    const yesterday = getDate(Date.now() - 24 * 3600 * 1000)
    const scheduleItemsData = [
      {
        schedule_date: yesterday,
        schedule_index: 8,
        goal_id: '1506275781528'
      },
      {
        schedule_date: yesterday,
        schedule_index: 10,
        goal_id: '1506275781529'
      },
      {
        schedule_date: yesterday,
        schedule_index: 11,
        goal_id: '1506275781529'
      },
      {
        schedule_date: today,
        schedule_index: 10,
        goal_id: '1506275781529'
      },
      {
        schedule_date: today,
        schedule_index: 11,
        goal_id: '1506275781529'
      },
      {
        schedule_date: today,
        schedule_index: 12,
        goal_id: '1506275781529'
      }
    ]

    return Promise.all([
      new GoalLists(this.db).insert(goalListsData),
      new GoalItems(this.db).insert(goalItemsData),
      new ScheduleItems(this.db).insert(scheduleItemsData)
    ])
  }
}
